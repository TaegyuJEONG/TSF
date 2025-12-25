const hre = require("hardhat");

async function main() {
    const listingAddress = "0xe0D3BCDfb357D63A763E369A6Dff9B0C317B84A5";
    const demoUSDAddress = "0x2f514963a095533590E1FB98eedC637D3947d219";
    const amount = process.env.AMOUNT || "2500"; // Default $2,500

    console.log("Depositing yield to Listing contract...");
    console.log("Amount:", amount, "USD");

    const [signer] = await hre.ethers.getSigners();
    console.log("SPV Address:", signer.address);

    // Convert to 6 decimals
    const amountWei = BigInt(amount) * 1_000_000n;

    // 1. Approve Listing to spend DemoUSD
    const DemoUSD = await hre.ethers.getContractFactory("DemoUSD");
    const demoUSD = DemoUSD.attach(demoUSDAddress);

    console.log("Approving Listing contract...");
    const approveTx = await demoUSD.approve(listingAddress, amountWei);
    await approveTx.wait();
    console.log("Approved!");

    // 2. Deposit Yield
    const Listing = await hre.ethers.getContractFactory("Listing");
    const listing = Listing.attach(listingAddress);

    console.log("Depositing yield...");
    const depositTx = await listing.depositYield(amountWei);
    const receipt = await depositTx.wait();

    console.log("✅ Yield deposited successfully!");
    console.log("Transaction Hash:", receipt.hash);
    console.log("Investors can now claim their pro-rata share.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
