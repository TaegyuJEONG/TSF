import React from 'react';
import Modal from '../ui/Modal';
import { Link, Layers, CheckCircle, ExternalLink } from 'lucide-react';

interface MerkleRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    contractHash?: string;
    creditHash?: string;
    anchorHash?: string;
    paymentLedgerRoot?: string;
    listingPrice?: number;
    listedAt?: number;
    listingTxHash?: string;
}

const MerkleRecordModal: React.FC<MerkleRecordModalProps> = ({
    isOpen,
    onClose,
    contractHash,
    creditHash,
    anchorHash,
    paymentLedgerRoot,
    listingPrice,
    listedAt,
    listingTxHash
}) => {
    // Format timestamp
    const formattedDate = listedAt
        ? new Date(listedAt * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        }) + ' UTC'
        : '-';

    // Format price
    const formattedPrice = listingPrice
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(listingPrice / 1_000_000)
        : '-';

    // Create MantleScan link
    const mantleScanLink = listingTxHash
        ? `https://sepolia.mantlescan.xyz/tx/${listingTxHash}`
        : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Note Metadata Verified on Blockchain">
            <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                    This note's contract metadata and payment ledger root have been anchored on the Mantle Sepolia blockchain
                    to ensure integrity and transparency for investors.
                </p>

                {/* Section 1: Note Metadata Summary */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Layers size={18} color="#4f46e5" />
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>On-Chain Note Metadata</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Contract Document Hash</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#111827', wordBreak: 'break-all', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                {contractHash || 'Not available'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Credit Assessment Hash</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#111827', wordBreak: 'break-all', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                {creditHash || 'Not available'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Anchor Payload Hash</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#111827', wordBreak: 'break-all', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                {anchorHash || 'Not available'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Payment Ledger Merkle Root</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#111827', wordBreak: 'break-all', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                {paymentLedgerRoot || 'Not available'}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '8px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>Listing Price</div>
                                <div style={{ fontWeight: 500, color: '#111827', fontSize: '13px' }}>{formattedPrice}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>Listed At</div>
                                <div style={{ fontWeight: 500, color: '#111827', fontSize: '13px' }}>{formattedDate}</div>
                            </div>
                        </div>

                        <div>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 500
                            }}>
                                <CheckCircle size={12} />
                                Anchored on Mantle Sepolia
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Blockchain Transaction Details */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Link size={18} color="#4f46e5" />
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Blockchain Transaction</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Transaction Hash</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#111827', wordBreak: 'break-all' }}>
                                {listingTxHash || 'Not available'}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Network</div>
                            <div style={{ fontWeight: 500, color: '#111827', fontSize: '13px' }}>Mantle Sepolia Testnet</div>
                        </div>

                        <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Contract Function</div>
                            <div style={{ fontSize: '13px', color: '#374151' }}>
                                <code style={{ backgroundColor: '#f9fafb', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>
                                    updateNoteMetadata()
                                </code>
                            </div>
                        </div>

                        {mantleScanLink && (
                            <a
                                href={mantleScanLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '4px',
                                    padding: '8px 12px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    color: '#374151',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    maxWidth: 'fit-content',
                                    textDecoration: 'none'
                                }}
                            >
                                View on MantleScan
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default MerkleRecordModal;
