export interface ContractSnapshotRef {
    schemaVersion: "contract_snapshot_ref_v1";
    contractId: string;
    propertyId: string;
    chainId: number;
    contractHash: string;
    creditHash: string;
    anchorHash: string;
    contractTxHash: string;
    anchoredAt: string;
    source?: "GENESIS" | "LIVE"; // To support UI label
}

export type PaymentEventType = "PAYMENT_RECEIVED";
export type PaymentMethod = "PAY_NOW";
export type PaymentStatus = "PAID";

export interface Money {
    principal: number;
    interest: number;
    total: number;
    currency: string;
}

export interface PaymentEvent {
    schemaVersion: "payment_event_v1";

    // Linkage
    contractId: string;
    paymentId: string;
    propertyId: string;
    noteId: string | null;

    contractAnchorRef: ContractSnapshotRef;

    // Event Meaning
    eventType: PaymentEventType;
    scheduledDueDate: string;
    receivedAt: string; // ISO string
    amount: Money;
    method: PaymentMethod;

    // Deterministic Identity
    eventId: string; // uuid or nonce
    statusAfter: PaymentStatus;

    // Verification Metadata (Excluded from Leaf Hash)
    anchoredTxHash?: string;
}

export interface PaymentLedgerSnapshot {
    schemaVersion: "payment_ledger_snapshot_v1";
    contractId: string;
    chainId: number;
    paymentLedgerRoot: string;
    includedEventCount: number;
    snapshotTimestamp: string;
    ledgerTxHash: string;
    orderingRule: string; // "receivedAt ASC, then eventId ASC"
}
