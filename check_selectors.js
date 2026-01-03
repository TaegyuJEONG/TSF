import { ethers } from "ethers";

const errors = [
    "ERC20InsufficientBalance(address,uint256,uint256)",
    "ERC20InvalidSender(address)",
    "ERC20InvalidReceiver(address)",
    "ERC20InsufficientAllowance(address,uint256,uint256)",
    "ERC20InvalidApprover(address)",
    "ERC20InvalidSpender(address)",
    "OwnableUnauthorizedAccount(address)"
];

console.log("Checking selectors...");
errors.forEach(err => {
    const selector = ethers.id(err).slice(0, 10);
    console.log(`${selector} : ${err}`);
});

const target = "0xe450d38c";
console.log(`Target: ${target}`);
