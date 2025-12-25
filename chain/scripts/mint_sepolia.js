const hre = require("hardhat");

async function main() {
    // Replace with YOUR wallet address
    const recipientAddress = process.env.RECIPIENT_ADDRESS || "0xAb3d054ACbF4a0D5551b12209d88bBA4e9248267";
    const demoUSDAddress = "0x3027c69fE0b4C90ae5717e08A40892aCB8BF2C19";

    console.log("Minting DemoUSD for:", recipientAddress);

    const DemoUSD = await hre.ethers.getContractFactory("DemoUSD");
    const demoUSD = DemoUSD.attach(demoUSDAddress);

    // Mint 1,000,000 dUSD (with 6 decimals)
    const amount = 1_000_000n * 1_000_000n;

    const tx = await demoUSD.mint(recipientAddress, amount);
    await tx.wait();

    console.log("Minted:", amount.toString(), "($1,000,000 dUSD)");
    console.log("Transaction hash:", tx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
