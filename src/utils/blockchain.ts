import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.sepolia.mantle.xyz';

export interface TransactionResult {
    hash: string;
    from: string;
    network: string;
    status: 'confirmed' | 'failed';
}

/**
 * Submits a custodial transaction to anchor contract data on-chain.
 * @param contractHash The hash of the contract documents.
 * @param creditHash The hash of the credit summary.
 * @returns Promise resolving to the transaction result.
 */
export const submitCustodialTransaction = async (
    contractHash: string,
    creditHash: string
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

        // Construct Data Payload
        const payload = {
            contractHash,
            creditHash,
            timestamp: new Date().toISOString(),
            documentType: "RWA_CONTRACT",
            action: "ANCHOR_PROOF"
        };

        // Encode payload as hex string for data field
        // formatting as utf8 bytes -> hex
        const dataHex = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(payload)));

        // Create Transaction
        // Sending 0 ETH, just anchoring data
        const tx = await wallet.sendTransaction({
            to: wallet.address, // Sending to self effectively, or could be a burn address. Self is safer for history.
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
