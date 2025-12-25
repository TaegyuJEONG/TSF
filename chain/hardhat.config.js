require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz",
      accounts: process.env.SPV_PRIVATE_KEY
        ? [process.env.SPV_PRIVATE_KEY]
        : process.env.PRIVATE_KEY
          ? [process.env.PRIVATE_KEY]
          : [],
    },
  },
};
