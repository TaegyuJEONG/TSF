import { BrowserProvider } from 'ethers';

export const MANTLE_TESTNET_CHAIN_ID = 5003;
export const MANTLE_TESTNET_CHAIN_ID_HEX = '0x138b';

export const MANTLE_TESTNET_CONFIG = {
    chainId: MANTLE_TESTNET_CHAIN_ID_HEX,
    chainName: 'Mantle Sepolia Testnet',
    nativeCurrency: {
        name: 'MNT',
        symbol: 'MNT',
        decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
    blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz/'],
};

// Define a type for the window object with ethereum
interface WindowWithEthereum extends Window {
    ethereum?: any;
}

export class WalletService {
    /**
     * Checks if a wallet provider (like MetaMask) is installed.
     */
    static hasProvider(): boolean {
        const win = window as WindowWithEthereum;
        return !!win.ethereum;
    }

    /**
     * Connects to the wallet and requests accounts.
     * Returns the connected address and provider.
     */
    static async connect(): Promise<{ address: string; chainId: number }> {
        if (!this.hasProvider()) {
            throw new Error('No wallet provider found');
        }

        const win = window as WindowWithEthereum;
        const provider = new BrowserProvider(win.ethereum);

        // Request accounts
        const accounts = await provider.send('eth_requestAccounts', []);
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
        }

        // Get network
        const network = await provider.getNetwork();

        // Switch to Mantle Testnet if needed, but don't fail if we can't yet
        // The UI should prompt for switch if chainId doesn't match

        return {
            address: accounts[0],
            chainId: Number(network.chainId)
        };
    }

    /**
     * Switches the wallet network to Mantle Testnet.
     * Attempts to add the network if it doesn't represent.
     */
    static async switchToMantleTestnet(): Promise<void> {
        if (!this.hasProvider()) return;
        const win = window as WindowWithEthereum;

        try {
            await win.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: MANTLE_TESTNET_CHAIN_ID_HEX }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await win.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [MANTLE_TESTNET_CONFIG],
                    });
                } catch (addError) {
                    throw addError;
                }
            } else {
                throw switchError;
            }
        }
    }

    /**
     * Gets the current `ethers` BrowserProvider.
     */
    static getProvider(): BrowserProvider | null {
        const win = window as WindowWithEthereum;
        if (!win.ethereum) return null;
        return new BrowserProvider(win.ethereum);
    }

    /**
     * Revokes permissions to force a real disconnect.
     * This will cause MetaMask to prompt for connection again next time.
     */
    static async disconnect(): Promise<void> {
        if (!this.hasProvider()) return;
        const win = window as WindowWithEthereum;

        try {
            await win.ethereum.request({
                method: 'wallet_revokePermissions',
                params: [{
                    eth_accounts: {}
                }]
            });
        } catch (error) {
            console.error('Failed to revoke permissions:', error);
            // Even if it fails, we should let the app clear its state
        }
    }
}
