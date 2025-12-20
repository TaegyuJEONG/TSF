import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WalletService, MANTLE_TESTNET_CHAIN_ID } from '../services/wallet';

interface WalletContextType {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    switchToMantle: () => Promise<void>;
    isMantleNetwork: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial check on mount
    useEffect(() => {
        const checkConnection = async () => {
            if (WalletService.hasProvider()) {
                const provider = WalletService.getProvider();
                if (provider) {
                    try {
                        const accounts = await provider.listAccounts();
                        if (accounts.length > 0) {
                            const network = await provider.getNetwork();
                            setAddress(accounts[0].address);
                            setChainId(Number(network.chainId));
                        }
                    } catch (err) {
                        console.error('Failed to restore connection:', err);
                    }
                }
            }
        };
        checkConnection();
    }, []);

    // Event listeners
    useEffect(() => {
        if (!WalletService.hasProvider()) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                // User disconnected
                setAddress(null);
                setChainId(null);
            } else {
                setAddress(accounts[0]);
            }
        };

        const handleChainChanged = (chainIdHex: string) => {
            setChainId(parseInt(chainIdHex, 16));
        };

        const win = window as any;
        win.ethereum?.on('accountsChanged', handleAccountsChanged);
        win.ethereum?.on('chainChanged', handleChainChanged);

        return () => {
            win.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            win.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, []);

    const connect = useCallback(async () => {
        setIsConnecting(true);
        setError(null);
        try {
            const { address: connectedAddress, chainId: connectedChainId } = await WalletService.connect();
            setAddress(connectedAddress);
            setChainId(connectedChainId);
        } catch (err: any) {
            setError(err.message || 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(async () => {
        try {
            await WalletService.disconnect();
        } catch (e) {
            console.error(e);
        }
        setAddress(null);
        setChainId(null);
        setError(null);
    }, []);

    const switchToMantle = useCallback(async () => {
        setError(null);
        try {
            await WalletService.switchToMantleTestnet();
        } catch (err: any) {
            setError(err.message || 'Failed to switch network');
        }
    }, []);

    const isConnected = !!address;
    const isMantleNetwork = chainId === MANTLE_TESTNET_CHAIN_ID;

    return (
        <WalletContext.Provider value={{
            address,
            chainId,
            isConnected,
            isConnecting,
            error,
            connect,
            disconnect,
            switchToMantle,
            isMantleNetwork
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWalletContext must be used within a WalletProvider');
    }
    return context;
};
