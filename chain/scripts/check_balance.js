const { ethers } = require("hardhat");

async function main() {
    const tokenAddress = process.env.DEMOUSD_ADDRESS || "0x2f514963a095533590E1FB98eedC637D3947d219"; // Default to the one from logs if env missing

    if (!tokenAddress) throw new Error("Missing Token Address");

    const demo = await ethers.getContractAt("DemoUSD", tokenAddress);

    const recipients = [
        { name: "SPV", address: "0x7757e94e0830c6b4373b72f4450ff19ccc6a92ea" },
        { name: "Investor1", address: "0xd1033d95fa1e3d1a38d0a770fb3f5192fb0983c8" },
        { name: "Investor2", address: "0x834e87f5c0e21df98870d4bba5bd0f04be2d5a71" },
    ];

    console.log(`Checking balances for DemoUSD at ${tokenAddress}...`);

    for (const r of recipients) {
        const balance = await demo.balanceOf(r.address);
        console.log(`${r.name} (${r.address}): ${ethers.formatUnits(balance, 6)} dUSD`);
    }
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
