const { ethers } = require("hardhat");

async function main() {
    const LISTING_ADDRESS = "0x376EDcdbc2Ef192d74937BF61C0E0CB8c20c95b0";

    console.log("Checking contract version at:", LISTING_ADDRESS);

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");

    // Try to call getTotalNotes() - only exists in multi-note version
    const abiMultiNote = [
        "function getTotalNotes() view returns (uint256)",
        "function createNote(address,bytes32,bytes32,bytes32,bytes32,uint256,uint256) returns (uint256)",
        "function getNoteMetadata(uint256) view returns (address,bytes32,bytes32,bytes32,bytes32,uint256,uint256,uint256,uint256,bool)"
    ];

    const abiSingleNote = [
        "function raised() view returns (uint256)",
        "function goal() view returns (uint256)"
    ];

    try {
        const contract = new ethers.Contract(LISTING_ADDRESS, abiMultiNote, provider);
        const totalNotes = await contract.getTotalNotes();
        console.log("✅ MULTI-NOTE CONTRACT detected!");
        console.log("   Total notes:", totalNotes.toString());
    } catch (error) {
        console.log("❌ Multi-note functions not found.");
        console.log("   Checking if single-note...");

        try {
            const contractSingle = new ethers.Contract(LISTING_ADDRESS, abiSingleNote, provider);
            const raised = await contractSingle.raised();
            const goal = await contractSingle.goal();
            console.log("✅ SINGLE-NOTE CONTRACT detected!");
            console.log("   Raised:", ethers.formatUnits(raised, 6));
            console.log("   Goal:", ethers.formatUnits(goal, 6));
        } catch (e) {
            console.log("❌ Neither multi-note nor single-note functions found!");
            console.log("   Error:", e.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
