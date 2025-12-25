const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying Listing with:", deployer.address);

    // Params
    // 1. Token: DemoUSD Address from ENV or previous deployment
    const demoUsdAddress = process.env.DEMOUSD_ADDRESS;
    if (!demoUsdAddress) {
        throw new Error("Missing DEMOUSD_ADDRESS in .env");
    }

    // 2. Goal: $455,000 (with 6 decimals)
    const goal = 455_000n * 1_000_000n; // 455,000 * 10^6

    // SPV Address (Original)
    const spvAddress = "0x7757e94e0830c6b4373b72f4450ff19ccc6a92ea";

    console.log("Token:", demoUsdAddress);
    console.log("Goal:", goal.toString());
    console.log("SPV:", spvAddress);

    const Listing = await hre.ethers.getContractFactory("Listing");
    const listing = await Listing.deploy(demoUsdAddress, goal, spvAddress);

    await listing.waitForDeployment();
    const address = await listing.getAddress();

    console.log("Listing deployed to:", address);
    console.log("----------------------------------------------------");
    console.log("Please update your .env with:");
    console.log(`LISTING_ADDRESS=${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
