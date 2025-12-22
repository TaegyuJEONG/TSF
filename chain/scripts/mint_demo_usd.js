const { ethers } = require("hardhat");

async function main() {
  const token = process.env.DEMOUSD_ADDRESS;
  if (!token) throw new Error("Missing DEMOUSD_ADDRESS in .env");

  const [deployer] = await ethers.getSigners();
  console.log("Minter:", deployer.address);
  console.log("Token:", token);

  const demo = await ethers.getContractAt("DemoUSD", token);

  // 받을 주소들
  const recipients = [
    "0x7757e94e0830c6b4373b72f4450ff19ccc6a92ea", // SPV
    "0xd1033d95fa1e3d1a38d0a770fb3f5192fb0983c8", // Investor1
    "0x834e87f5c0e21df98870d4bba5bd0f04be2d5a71", // Investor2
  ];

  // 각자 100,000,000 DemoUSD (6 decimals)
  const amount = ethers.parseUnits("100000000", 6);

  for (const to of recipients) {
    console.log("Minting to:", to);
    const tx = await demo.mint(to, amount);
    await tx.wait();
    console.log("  tx:", tx.hash);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
