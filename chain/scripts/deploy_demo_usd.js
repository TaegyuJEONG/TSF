const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const DemoUSD = await hre.ethers.getContractFactory("DemoUSD");
    const demoUSD = await DemoUSD.deploy();

    await demoUSD.waitForDeployment();

    const address = await demoUSD.getAddress();

    console.log("DemoUSD deployed to:", address);

    // Verification step: Check if deployer is owner
    const owner = await demoUSD.owner();
    if (owner === deployer.address) {
        console.log("Verification Passed: Deployer is the owner.");
    } else {
        console.error("Verification Failed: Deployer is NOT the owner.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
