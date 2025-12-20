import { useWalletContext } from '../contexts/WalletContext';

export interface UseWalletReturn {
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

export const useWallet = (): UseWalletReturn => {
    return useWalletContext();
};
