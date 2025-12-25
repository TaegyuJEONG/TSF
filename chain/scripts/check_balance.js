
const hre = require("hardhat");

async function main() {
    const listingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const demoUSDAddress = "0x2f514963a095533590E1FB98eedC637D3947d219";

    console.log(`Checking Balance of Listing at ${listingAddress}...`);

    // Minimal ERC20 ABI
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const demoUSD = await hre.ethers.getContractAt(abi, demoUSDAddress);

    try {
        const balance = await demoUSD.balanceOf(listingAddress);
        console.log(`DEMO USD BALANCE: ${balance.toString()}`);
    } catch (e) {
        console.error("Error fetching data:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
