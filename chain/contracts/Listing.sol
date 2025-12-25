// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Listing
 * @dev Investment pool with capped fundraising and pro-rata yield distribution (pull-based).
 * Uses the accumulated dividend per share pattern for O(1) complexity yield distribution.
 */
contract Listing is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- State Variables ---
    IERC20 public immutable token;       // DemoUSD (6 decimals)
    address public immutable spv;        // Authorized SPV address
    uint256 public immutable goal;       // Fundraising target (6 decimals)

    uint256 public raised;               // Total funds raised so far
    bool public closed;                  // True if funding goal reached

    // Dividend Accounting
    // Scaled by 1e18 to handle precision loss (since token is 6 decimals)
    uint256 public accDivPerShare;
    
    // User Info
    mapping(address => uint256) public invested;     // Amount invested by user
    mapping(address => uint256) public rewardDebt;   // Reward debt for dividend tracking

    // Helper for dividend calculation consistency
    uint256 private constant SCALE = 1e18;

    // --- Note Metadata ---
    address public listingOwner;         // Homeowner who listed the note
    bytes32 public contractHash;         // Contract document hash from /contract
    bytes32 public creditHash;           // Credit assessment hash from /contract
    bytes32 public anchorHash;           // Anchor payload hash
    bytes32 public paymentLedgerRoot;    // Merkle root of payment history
    uint256 public listingPrice;         // Price at which note was listed
    uint256 public listedAt;             // Timestamp when listed

    // --- Events ---
    event Invested(address indexed user, uint256 amount, uint256 totalRaised);
    event FundingClosed();
    event YieldDeposited(uint256 amount, uint256 newAccDivPerShare);
    event Claimed(address indexed user, uint256 amount);
    event NoteMetadataUpdated(address indexed owner, bytes32 contractHash, uint256 listingPrice);
    event PaymentReceived(address indexed payer, uint256 amount, uint256 newAccDivPerShare);

    // --- Modifiers ---
    modifier onlySPV() {
        require(msg.sender == spv, "Not SPV");
        _;
    }

    /**
     * @param _token Address of DemoUSD
     * @param _goal Fundraising goal (in token atomic units, e.g. 6 decimals)
     * @param _spv Authorized SPV address
     */
    constructor(address _token, uint256 _goal, address _spv) {
        require(_token != address(0), "Invalid token");
        require(_spv != address(0), "Invalid SPV");
        require(_goal > 0, "Invalid goal");

        token = IERC20(_token);
        goal = _goal;
        spv = _spv;
    }

    /**
     * @dev Invest tokens into the pool.
     * @param amount Amount to invest (6 decimals)
     */
    function invest(uint256 amount) external nonReentrant {
        require(!closed, "Funding closed");
        require(amount > 0, "Amount must be > 0");
        
        // Cap amount to remaining goal
        uint256 remaining = goal - raised;
        if (amount > remaining) {
            amount = remaining;
        }

        // 1. Claim pending rewards first (if any previously invested)
        // This is crucial for the MasterChef/Dividend pattern standard
        if (invested[msg.sender] > 0) {
            uint256 pending = (invested[msg.sender] * accDivPerShare / SCALE) - rewardDebt[msg.sender];
            if (pending > 0) {
                token.safeTransfer(msg.sender, pending);
                emit Claimed(msg.sender, pending);
            }
        }

        // 2. Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        // 3. Update state
        invested[msg.sender] += amount;
        raised += amount;
        
        // 4. Update reward debt
        // rewardDebt is what they are NOT entitled to (rewards from before they entered/increased)
        rewardDebt[msg.sender] = invested[msg.sender] * accDivPerShare / SCALE;

        emit Invested(msg.sender, amount, raised);

        // 5. Check if goal reached
        if (raised >= goal) {
            closed = true;
            emit FundingClosed();
        }
    }

    /**
     * @dev SPV deposits yield for distribution.
     * @param amount Amount of yield tokens (6 decimals)
     */
    function depositYield(uint256 amount) external onlySPV nonReentrant {
        require(closed, "Funding not closed yet");
        require(raised > 0, "No investors");
        require(amount > 0, "Amount must be > 0");

        token.safeTransferFrom(msg.sender, address(this), amount);

        // Update accumulator
        // accDivPerShare += amount * SCALE / totalInvested
        // Note: raised is totalInvested here
        accDivPerShare += (amount * SCALE) / raised;

        emit YieldDeposited(amount, accDivPerShare);
    }

    /**
     * @dev Investor claims their available yield.
     */
    function claim() external nonReentrant {
        require(invested[msg.sender] > 0, "Not an investor");

        uint256 pending = (invested[msg.sender] * accDivPerShare / SCALE) - rewardDebt[msg.sender];
        require(pending > 0, "Nothing to claim");

        // Update debt to reflect that they have claimed everything up to now
        // Effectively, rewardDebt becomes "all rewards up to current accDivPerShare"
        rewardDebt[msg.sender] += pending;

        token.safeTransfer(msg.sender, pending);
        
        emit Claimed(msg.sender, pending);
    }

    /**
     * @dev View function to see claimable amount
     */
    function claimable(address user) external view returns (uint256) {
        if (invested[user] == 0) return 0;
        return (invested[user] * accDivPerShare / SCALE) - rewardDebt[user];
    }

    /**
     * @dev Homeowner lists note by storing metadata on-chain.
     * Anyone can call this (typically the homeowner via MetaMask).
     * Can only be called once (metadata cannot be changed after set).
     */
    function updateNoteMetadata(
        bytes32 _contractHash,
        bytes32 _creditHash,
        bytes32 _anchorHash,
        bytes32 _paymentLedgerRoot,
        uint256 _listingPrice
    ) external {
        require(contractHash == bytes32(0), "Metadata already set");
        require(_listingPrice > 0, "Invalid price");

        listingOwner = msg.sender;
        contractHash = _contractHash;
        creditHash = _creditHash;
        anchorHash = _anchorHash;
        paymentLedgerRoot = _paymentLedgerRoot;
        listingPrice = _listingPrice;
        listedAt = block.timestamp;

        emit NoteMetadataUpdated(msg.sender, _contractHash, _listingPrice);
    }

    /**
     * @dev Buyer makes payment directly to contract.
     * Automatically distributes pro-rata to all investors.
     * Replaces the manual SPV depositYield flow.
     */
    function makePayment(uint256 amount) external nonReentrant {
        require(closed, "Funding not closed yet");
        require(raised > 0, "No investors");
        require(amount > 0, "Amount must be > 0");

        // Transfer from buyer to this contract
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Update accumulator (same logic as depositYield)
        accDivPerShare += (amount * SCALE) / raised;

        emit PaymentReceived(msg.sender, amount, accDivPerShare);
    }

    /**
     * @dev Get all note metadata.
     * Used by investor UI to display note information.
     */
    function getNoteMetadata() external view returns (
        address,
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        uint256,
        uint256
    ) {
        return (
            listingOwner,
            contractHash,
            creditHash,
            anchorHash,
            paymentLedgerRoot,
            listingPrice,
            listedAt
        );
    }
}
