import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.sepolia.mantle.xyz';

export interface TransactionResult {
    hash: string;
    from: string;
    network: string;
    status: 'confirmed' | 'failed';
}

/**
 * Submits a custodial transaction to anchor data on-chain.
 * @param anchorPayloadJson The canonical JSON string of the anchor payload.
 * @returns Promise resolving to the transaction result.
 */
export const submitCustodialTransaction = async (
    anchorPayloadJson: string
): Promise<TransactionResult> => {
    try {
        const privateKey = import.meta.env.VITE_TRUST_PARTNER_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error("Missing Trust Partner Private Key");
        }

        // Initialize Provider
        const provider = new ethers.JsonRpcProvider(RPC_URL);

        // Initialize Wallet
        const wallet = new ethers.Wallet(privateKey, provider);

        console.log("Preparing custodial transaction from:", wallet.address);

        // Encode payload as hex string for data field
        const dataHex = ethers.hexlify(ethers.toUtf8Bytes(anchorPayloadJson));

        // Create Transaction
        // Sending 0 ETH, just anchoring data
        const tx = await wallet.sendTransaction({
            to: wallet.address, // Sending to self
            value: 0,
            data: dataHex
        });

        console.log("Transaction submitted:", tx.hash);

        // Wait for 1 confirmation
        const receipt = await tx.wait(1);

        if (!receipt) {
            throw new Error("Transaction failed to confirm");
        }

        return {
            hash: receipt.hash,
            from: wallet.address,
            network: 'Mantle Sepolia Testnet',
            status: 'confirmed'
        };

    } catch (error) {
        console.error("Custodial Transaction Failed:", error);
        throw error;
    }
};

/**
 * Verifies a transaction by fetching it and returning the decoded input data.
 * @param txHash The transaction hash to verify.
 * @returns The anchored data string (utf8).
 */
export const verifyTransaction = async (txHash: string): Promise<string> => {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
            throw new Error("Transaction not found");
        }

        // Decode input data
        const data = ethers.toUtf8String(tx.data);
        return data;
    } catch (error) {
        console.error("Verification Failed:", error);
        throw error;
    }
};
