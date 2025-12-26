const { ethers } = require("hardhat");

async function main() {
    const LISTING_ADDRESS = "0x376EDcdbc2Ef192d74937BF61C0E0CB8c20c95b0";

    console.log("Fetching PaymentReceived events for noteId 8...");

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");

    const abi = [
        "event PaymentReceived(uint256 indexed noteId, address indexed payer, uint256 amount, uint256 newAccDivPerShare)"
    ];

    const contract = new ethers.Contract(LISTING_ADDRESS, abi, provider);

    // Get events for noteId 8
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000);

    console.log(`Searching blocks ${fromBlock} to ${currentBlock}...`);

    const filter = contract.filters.PaymentReceived(8); // noteId = 8
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);

    console.log(`\nFound ${events.length} PaymentReceived events for noteId 8:`);

    for (const event of events) {
        console.log("\n---");
        console.log("Block:", event.blockNumber);
        console.log("TX:", event.transactionHash);
        console.log("NoteId:", event.args[0].toString());
        console.log("Payer:", event.args[1]);
        console.log("Amount:", ethers.formatUnits(event.args[2], 6), "dUSD");
        console.log("AccDivPerShare:", event.args[3].toString());
    }

    if (events.length === 0) {
        console.log("\n⚠️  No payment events found for noteId 8!");
        console.log("   This means makePayment() was never successfully called for this note.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
