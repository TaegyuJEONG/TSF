const { ethers } = require("hardhat");

async function main() {
    const txHash = "0x4bed2d0f007d64cad9656fda2105ccfa43f34771337d6ddb81df4655600baa4c36";

    console.log("Analyzing transaction:", txHash);

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");

    try {
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
            console.log("Transaction not found!");
            return;
        }

        console.log("\n=== Transaction Details ===");
        console.log("From:", tx.from);
        console.log("To:", tx.to);
        console.log("Value:", ethers.formatEther(tx.value), "MNT");
        console.log("Data:", tx.data);

        // Try to decode the input data
        const ListingABI = require("../abis/Listing.json");
        const iface = new ethers.Interface(ListingABI);

        try {
            const decoded = iface.parseTransaction({ data: tx.data });
            console.log("\n=== Decoded Function Call ===");
            console.log("Function:", decoded.name);
            console.log("Arguments:", decoded.args);
        } catch (e) {
            console.log("\nCould not decode as Listing contract call");
            console.log("This might be a plain data transaction (anchoring)");
        }

        // Check if it's a createNote call
        const createNoteSelector = iface.getFunction("createNote").selector;
        console.log("\n=== Function Selector Check ===");
        console.log("Expected createNote selector:", createNoteSelector);
        console.log("Actual selector:", tx.data.slice(0, 10));
        console.log("Is createNote?", tx.data.startsWith(createNoteSelector));

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
