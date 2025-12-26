const { ethers } = require("hardhat");

async function main() {
    const LISTING_ADDRESS = "0x376EDcdbc2Ef192d74937BF61C0E0CB8c20c95b0";

    console.log("Checking Note #8 status...\n");

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");

    const abi = [
        "function getNoteStatus(uint256) view returns (uint256 goal, uint256 raised, bool closed)"
    ];

    const contract = new ethers.Contract(LISTING_ADDRESS, abi, provider);

    try {
        const status = await contract.getNoteStatus(8);

        const goal = Number(status.goal) / 1_000_000;
        const raised = Number(status.raised) / 1_000_000;
        const closed = status.closed;
        const percentage = goal > 0 ? (raised / goal * 100).toFixed(2) : 0;

        console.log("=== Note #8 Funding Status ===");
        console.log("Goal:    $" + goal.toLocaleString());
        console.log("Raised:  $" + raised.toLocaleString());
        console.log("Funded:  " + percentage + "%");
        console.log("Closed:  " + (closed ? "YES" : "NO"));

        console.log("\n" + "=".repeat(35));

        if (raised >= goal && goal > 0) {
            console.log("✅ FUNDING COMPLETE!");
            console.log("   Payment CAN be made.");
        } else {
            console.log("❌ FUNDING INCOMPLETE!");
            console.log("   Payment CANNOT be made yet.");
            if (goal > 0) {
                console.log("   Need: $" + (goal - raised).toLocaleString() + " more");
            }
        }

        console.log("=".repeat(35));

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
