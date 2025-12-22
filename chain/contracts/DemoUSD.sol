// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DemoUSD
 * @dev Mock ERC20 USD stablecoin for hackathon demo purposes.
 *      Decimals set to 6 to mimic USDC.
 *      Only the owner (SPV Admin) can mint tokens.
 */
contract DemoUSD is ERC20, Ownable {
    constructor() ERC20("Demo USD", "dUSD") Ownable(msg.sender) {}

    /**
     * @dev Override decimals to 6 (standard for USDC).
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /**
     * @dev Mint new tokens. Only callable by the contract owner.
     * @param to The address to receive the minted tokens.
     * @param amount The amount of tokens to mint (in atomic units, e.g., 1000000 = 1 dUSD).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
