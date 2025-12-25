const hre = require("hardhat");

async function main() {
    const listingAddress = "0xe0D3BCDfb357D63A763E369A6Dff9B0C317B84A5";
    const demoUSDAddress = "0x2f514963a095533590E1FB98eedC637D3947d219";

    const [signer] = await hre.ethers.getSigners();
    console.log("Checking from address:", signer.address);

    // Get contracts
    const Listing = await hre.ethers.getContractFactory("Listing");
    const listing = Listing.attach(listingAddress);

    const DemoUSD = await hre.ethers.getContractFactory("DemoUSD");
    const demoUSD = DemoUSD.attach(demoUSDAddress);

    // Check listing state
    const raised = await listing.raised();
    const goal = await listing.goal();
    const closed = await listing.closed();

    console.log("\n=== Listing State ===");
    console.log("Raised:", raised.toString(), "($" + (Number(raised) / 1_000_000) + ")");
    console.log("Goal:", goal.toString(), "($" + (Number(goal) / 1_000_000) + ")");
    console.log("Closed:", closed);
    console.log("Progress:", (Number(raised) * 100 / Number(goal)).toFixed(2) + "%");

    // Check SPV DemoUSD balance
    const spvBalance = await demoUSD.balanceOf(signer.address);
    console.log("\n=== SPV Balance ===");
    console.log("DemoUSD:", spvBalance.toString(), "($" + (Number(spvBalance) / 1_000_000) + ")");

    // Check if SPV is correct
    const spvAddress = await listing.spv();
    console.log("\n=== SPV Check ===");
    console.log("Contract SPV:", spvAddress);
    console.log("Current Signer:", signer.address);
    console.log("Is SPV?", spvAddress.toLowerCase() === signer.address.toLowerCase());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
