const { ethers } = require("hardhat");

async function main() {
    const LISTING_ADDRESS = "0x376EDcdbc2Ef192d74937BF61C0E0CB8c20c95b0";

    console.log("Searching for ALL PaymentReceived events...\n");

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");

    const abi = [
        "event PaymentReceived(uint256 indexed noteId, address indexed payer, uint256 amount, uint256 newAccDivPerShare)"
    ];

    const contract = new ethers.Contract(LISTING_ADDRESS, abi, provider);

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000);

    console.log(`Searching blocks ${fromBlock} to ${currentBlock}...`);

    // Get ALL payment events (no filter)
    const filter = contract.filters.PaymentReceived();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);

    console.log(`\n✅ Found ${events.length} PaymentReceived events total:\n`);

    const noteEvents = {};

    for (const event of events) {
        const noteId = event.args[0].toString();
        const payer = event.args[1];
        const amount = ethers.formatUnits(event.args[2], 6);

        if (!noteEvents[noteId]) {
            noteEvents[noteId] = [];
        }

        noteEvents[noteId].push({
            block: event.blockNumber,
            tx: event.transactionHash,
            amount: amount
        });
    }

    // Display by noteId
    for (const [noteId, payments] of Object.entries(noteEvents)) {
        console.log(`📝 Note #${noteId}: ${payments.length} payment(s)`);
        for (const p of payments) {
            console.log(`   - Block ${p.block}: ${p.amount} dUSD`);
            console.log(`     TX: ${p.tx}`);
        }
        console.log();
    }

    if (events.length === 0) {
        console.log("⚠️  No payment events found at all!");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
