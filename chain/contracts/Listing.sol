// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Listing
 * @dev Multi-Note investment pool with capped fundraising and pro-rata yield distribution per note.
 * Supports multiple notes with independent investment tracking and dividend distribution.
 */
contract Listing is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Immutables ---
    IERC20 public immutable token;       // DemoUSD (6 decimals)
    address public immutable spv;        // Authorized SPV address

    // --- Note Data Structure ---
    struct NoteMetadata {
        address listingOwner;            // Homeowner who listed the note
        bytes32 contractHash;            // Contract document hash
        bytes32 creditHash;              // Credit assessment hash
        bytes32 anchorHash;              // Anchor payload hash
        bytes32 paymentLedgerRoot;       // Merkle root of payment history
        uint256 listingPrice;            // Price at which note was listed
        uint256 listedAt;                // Timestamp when listed
        uint256 goal;                    // Fundraising target for this note
        uint256 raised;                  // Total funds raised for this note
        bool closed;                     // True if funding goal reached
    }

    // --- State Variables ---
    uint256 public nextNoteId = 1;
    
    mapping(uint256 => NoteMetadata) public notes;
    mapping(uint256 => mapping(address => uint256)) public invested;
    mapping(uint256 => mapping(address => uint256)) public rewardDebt;
    mapping(uint256 => uint256) public accDivPerShare;

    // Helper for dividend calculation consistency
    uint256 private constant SCALE = 1e18;

    // --- Events ---
    event NoteCreated(uint256 indexed noteId, address indexed owner, uint256 listingPrice, uint256 goal, uint256 listedAt);
    event Invested(uint256 indexed noteId, address indexed user, uint256 amount, uint256 totalRaised);
    event FundingClosed(uint256 indexed noteId);
    event PaymentReceived(uint256 indexed noteId, address indexed payer, uint256 amount, uint256 newAccDivPerShare);
    event Claimed(uint256 indexed noteId, address indexed user, uint256 amount);

    // --- Modifiers ---
    modifier onlySPV() {
        require(msg.sender == spv, "Not SPV");
        _;
    }

    modifier noteExists(uint256 noteId) {
        require(noteId > 0 && noteId < nextNoteId, "Note does not exist");
        _;
    }

    /**
     * @param _token Address of DemoUSD
     * @param _spv Authorized SPV address
     */
    constructor(address _token, address _spv) {
        require(_token != address(0), "Invalid token");
        require(_spv != address(0), "Invalid SPV");

        token = IERC20(_token);
        spv = _spv;
    }

    /**
     * @dev Create a new note. Called by homeowner when listing.
     * @param _contractHash Contract document hash
     * @param _creditHash Credit assessment hash
     * @param _anchorHash Anchor payload hash
     * @param _paymentLedgerRoot Merkle root of payment history
     * @param _listingPrice Price at which note is listed
     * @param _goal Fundraising goal for this note
     * @return noteId The ID of the newly created note
     */
    function createNote(
        bytes32 _contractHash,
        bytes32 _creditHash,
        bytes32 _anchorHash,
        bytes32 _paymentLedgerRoot,
        uint256 _listingPrice,
        uint256 _goal
    ) external returns (uint256) {
        require(_listingPrice > 0, "Invalid price");
        require(_goal > 0, "Invalid goal");

        uint256 noteId = nextNoteId++;

        notes[noteId] = NoteMetadata({
            listingOwner: msg.sender,
            contractHash: _contractHash,
            creditHash: _creditHash,
            anchorHash: _anchorHash,
            paymentLedgerRoot: _paymentLedgerRoot,
            listingPrice: _listingPrice,
            listedAt: block.timestamp,
            goal: _goal,
            raised: 0,
            closed: false
        });

        emit NoteCreated(noteId, msg.sender, _listingPrice, _goal, block.timestamp);
        
        return noteId;
    }

    /**
     * @dev Invest tokens into a specific note.
     * @param noteId ID of the note to invest in
     * @param amount Amount to invest (6 decimals)
     */
    function invest(uint256 noteId, uint256 amount) external nonReentrant noteExists(noteId) {
        NoteMetadata storage note = notes[noteId];
        
        require(!note.closed, "Funding closed");
        require(amount > 0, "Amount must be > 0");
        
        // Cap amount to remaining goal
        uint256 remaining = note.goal - note.raised;
        if (amount > remaining) {
            amount = remaining;
        }

        // 1. Claim pending rewards first (if any previously invested)
        if (invested[noteId][msg.sender] > 0) {
            uint256 pending = (invested[noteId][msg.sender] * accDivPerShare[noteId] / SCALE) - rewardDebt[noteId][msg.sender];
            if (pending > 0) {
                token.safeTransfer(msg.sender, pending);
                emit Claimed(noteId, msg.sender, pending);
            }
        }

        // 2. Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        // 3. Update state
        invested[noteId][msg.sender] += amount;
        note.raised += amount;
        
        // 4. Update reward debt
        rewardDebt[noteId][msg.sender] = invested[noteId][msg.sender] * accDivPerShare[noteId] / SCALE;

        emit Invested(noteId, msg.sender, amount, note.raised);

        // 5. Check if goal reached
        if (note.raised >= note.goal) {
            note.closed = true;
            emit FundingClosed(noteId);
        }
    }

    /**
     * @dev Buyer makes payment directly to contract for a specific note.
     * Automatically distributes pro-rata to all investors of that note.
     * @param noteId ID of the note this payment is for
     * @param amount Amount to pay
     */
    function makePayment(uint256 noteId, uint256 amount) external nonReentrant noteExists(noteId) {
        NoteMetadata storage note = notes[noteId];
        
        require(note.closed, "Funding not closed yet");
        require(note.raised > 0, "No investors");
        require(amount > 0, "Amount must be > 0");

        // Transfer from buyer to this contract
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Update accumulator (same logic as depositYield)
        accDivPerShare[noteId] += (amount * SCALE) / note.raised;

        emit PaymentReceived(noteId, msg.sender, amount, accDivPerShare[noteId]);
    }

    /**
     * @dev Investor claims their available yield from a specific note.
     * @param noteId ID of the note to claim from
     */
    function claim(uint256 noteId) external nonReentrant noteExists(noteId) {
        require(invested[noteId][msg.sender] > 0, "Not an investor");

        uint256 pending = (invested[noteId][msg.sender] * accDivPerShare[noteId] / SCALE) - rewardDebt[noteId][msg.sender];
        require(pending > 0, "Nothing to claim");

        // Update debt to reflect that they have claimed everything up to now
        rewardDebt[noteId][msg.sender] += pending;

        token.safeTransfer(msg.sender, pending);
        
        emit Claimed(noteId, msg.sender, pending);
    }

    /**
     * @dev View function to see claimable amount for a specific note.
     * @param noteId ID of the note
     * @param user Address of the user
     */
    function claimable(uint256 noteId, address user) external view noteExists(noteId) returns (uint256) {
        if (invested[noteId][user] == 0) return 0;
        return (invested[noteId][user] * accDivPerShare[noteId] / SCALE) - rewardDebt[noteId][user];
    }

    /**
     * @dev Get metadata for a specific note.
     * @param noteId ID of the note
     */
    function getNoteMetadata(uint256 noteId) external view noteExists(noteId) returns (
        address listingOwner,
        bytes32 contractHash,
        bytes32 creditHash,
        bytes32 anchorHash,
        bytes32 paymentLedgerRoot,
        uint256 listingPrice,
        uint256 listedAt
    ) {
        NoteMetadata storage note = notes[noteId];
        return (
            note.listingOwner,
            note.contractHash,
            note.creditHash,
            note.anchorHash,
            note.paymentLedgerRoot,
            note.listingPrice,
            note.listedAt
        );
    }

    /**
     * @dev Get funding status for a specific note.
     * @param noteId ID of the note
     */
    function getNoteStatus(uint256 noteId) external view noteExists(noteId) returns (
        uint256 goal,
        uint256 raised,
        bool closed
    ) {
        NoteMetadata storage note = notes[noteId];
        return (note.goal, note.raised, note.closed);
    }

    /**
     * @dev Get total number of notes created.
     */
    function getTotalNotes() external view returns (uint256) {
        return nextNoteId - 1;
    }
}
