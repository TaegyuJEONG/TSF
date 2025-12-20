import { ethers } from 'ethers';

/**
 * Generates a SHA-256 hash of the contract data.
 * @param data The contract data object to hash.
 * @returns The hex string of the hash.
 */
export const generateContractHash = (data: Record<string, unknown>): string => {
    // Sort keys to ensure deterministic hashing
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    return ethers.sha256(ethers.toUtf8Bytes(jsonString));
};

/**
 * Generates a SHA-256 hash of the credit summary.
 * @param data The credit summary data to hash.
 * @returns The hex string of the hash.
 */
export const generateCreditHash = (data: Record<string, unknown>): string => {
    // Sort keys to ensure deterministic hashing
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    return ethers.sha256(ethers.toUtf8Bytes(jsonString));
};
