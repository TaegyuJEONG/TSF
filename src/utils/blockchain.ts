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
        const privateKey = import.meta.env.VITE_TSF_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error("Missing TSF Private Key");
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
 * Includes retry logic to handle transient RPC errors (e.g. block not found).
 * @param txHash The transaction hash to verify.
 * @returns The anchored data string (utf8).
 */
export const verifyTransaction = async (txHash: string): Promise<string> => {
    const maxRetries = 5;
    const baseDelay = 2000; // 2 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const tx = await provider.getTransaction(txHash);

            if (!tx) {
                console.log(`Transaction ${txHash} not found (attempt ${i + 1}/${maxRetries}). Retrying...`);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                continue;
            }

            // Decode input data
            const data = ethers.toUtf8String(tx.data);
            return data;

        } catch (error) {
            console.warn(`Verification attempt ${i + 1}/${maxRetries} failed:`, error);
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, baseDelay));
        }
    }

    throw new Error("Transaction verification failed after retries");
};

/**
 * Calls a smart contract function using TSF's private key (custodial).
 * Used for List Note action (TSF signs on behalf of homeowner/buyer who don't have wallets).
 */
export const callContractAsTSF = async (
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[]
): Promise<TransactionResult> => {
    try {
        const privateKey = import.meta.env.VITE_TSF_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error("Missing TSF Private Key");
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        console.log(`Calling ${functionName} as TSF (${wallet.address})...`);

        // Get current nonce explicitly to avoid conflicts
        const nonce = await provider.getTransactionCount(wallet.address, 'pending');
        console.log(`Using nonce: ${nonce}`);

        const tx = await contract[functionName](...args, { nonce });
        console.log("Transaction submitted:", tx.hash);

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
        console.error("Custodial contract call failed:", error);
        throw error;
    }
};

/**
 * Calls a smart contract function using SPV's private key (custodial).
 * Used for Make Payment and depositYield actions.
 */
export const callContractAsSPV = async (
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[]
): Promise<TransactionResult> => {
    try {
        const privateKey = import.meta.env.VITE_SPV_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error("Missing SPV Private Key");
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        console.log(`Calling ${functionName} as SPV (${wallet.address})...`);

        // Get current nonce explicitly to avoid conflicts
        const nonce = await provider.getTransactionCount(wallet.address, 'pending');
        console.log(`Using nonce: ${nonce}`);

        const tx = await contract[functionName](...args, { nonce });
        console.log("Transaction submitted:", tx.hash);

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
        console.error("Custodial contract call failed:", error);
        throw error;
    }
};
