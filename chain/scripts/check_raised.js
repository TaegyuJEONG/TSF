
const hre = require("hardhat");

async function main() {
    const listingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`Checking Listing at ${listingAddress}...`);

    const Listing = await hre.ethers.getContractFactory("Listing");
    const listing = Listing.attach(listingAddress);

    try {
        const raised = await listing.raised();
        console.log(`RAISED AMOUNT: ${raised.toString()}`);
    } catch (e) {
        console.error("Error fetching data:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
