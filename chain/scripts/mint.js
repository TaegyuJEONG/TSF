const hre = require("hardhat");

async function main() {
    // Ensure we are connecting to the correct network/provider
    // This script assumes the contract is already deployed and address is available.
    // For demo purposes, you might want to replace this with the actual deployed address
    // or pass it as an environment variable.
    const DEMO_USD_ADDRESS = process.env.DEMO_USD_ADDRESS;

    if (!DEMO_USD_ADDRESS) {
        console.error("Please set DEMO_USD_ADDRESS in your .env file or script.");
        process.exit(1);
    }

    const [admin] = await hre.ethers.getSigners();
    console.log("Minting with admin account:", admin.address);

    // Attach to the deployed contract
    const DemoUSD = await hre.ethers.getContractFactory("DemoUSD");
    const demoUSD = DemoUSD.attach(DEMO_USD_ADDRESS);

    // Check if signer is owner
    const owner = await demoUSD.owner();
    if (owner !== admin.address) {
        console.error(`Signer ${admin.address} is not the owner (${owner}). Minting will fail.`);
        // Proceeding anyway to show the failure or if testing locally where signers might match
    }

    // Minting amounts (1 dUSD = 1,000,000 units)
    const amountInvestorA = 1000n * 1000000n; // 1,000 dUSD
    const amountInvestorB = 1000n * 1000000n; // 1,000 dUSD
    const amountSPVAdmin = 5000n * 1000000n; // 5,000 dUSD

    // Addresses from env (fallback to hardcoded or generated for demo if env missing)
    const investorA_Address = process.env.INVESTOR_A_ADDRESS || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Example Hardhat test account 2
    const investorB_Address = process.env.INVESTOR_B_ADDRESS || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Example Hardhat test account 3
    const spvAdmin_Address = process.env.SPV_ADMIN_ADDRESS || admin.address;

    console.log(`Minting 1,000 dUSD to Investor A (${investorA_Address})...`);
    let tx = await demoUSD.mint(investorA_Address, amountInvestorA);
    await tx.wait();
    console.log("Tx confirmed:", tx.hash);

    console.log(`Minting 1,000 dUSD to Investor B (${investorB_Address})...`);
    tx = await demoUSD.mint(investorB_Address, amountInvestorB);
    await tx.wait();
    console.log("Tx confirmed:", tx.hash);

    console.log(`Minting 5,000 dUSD to SPV Admin (${spvAdmin_Address})...`);
    tx = await demoUSD.mint(spvAdmin_Address, amountSPVAdmin);
    await tx.wait();
    console.log("Tx confirmed:", tx.hash);

    // Verification: Check balances
    const balanceA = await demoUSD.balanceOf(investorA_Address);
    const balanceB = await demoUSD.balanceOf(investorB_Address);
    const balanceAdmin = await demoUSD.balanceOf(spvAdmin_Address);

    console.log("\n--- Final Balances ---");
    console.log(`Investor A: ${hre.ethers.formatUnits(balanceA, 6)} dUSD`);
    console.log(`Investor B: ${hre.ethers.formatUnits(balanceB, 6)} dUSD`);
    console.log(`SPV Admin : ${hre.ethers.formatUnits(balanceAdmin, 6)} dUSD`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
