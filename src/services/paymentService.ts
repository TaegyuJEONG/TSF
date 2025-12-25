import type { PaymentEvent, PaymentLedgerSnapshot, ContractSnapshotRef, Money } from '../types/payment';
import { generatePaymentLeafHash, computeMerkleRoot, canonicalStringify } from '../utils/crypto';
import { type TransactionResult, submitCustodialTransaction } from '../utils/blockchain';

const DB_KEY_PAYMENTS = 'tsf_payment_events_v1';
const DB_KEY_CONTRACT = 'tsf_contract_snapshot_v1';

// --- Genesis Snapshot Data (Approx. matching Listing 1) ---
// This ensures we always have a root to link to, even if the user skipped the /contract page.
const GENESIS_CONTRACT_SNAPSHOT: ContractSnapshotRef = {
    schemaVersion: "contract_snapshot_ref_v1",
    contractId: "contract_genesis_001",
    propertyId: "prop_5931_abernathy_dr",
    chainId: 5003,
    contractHash: "0xGENESIS_CONTRACT_HASH_MOCK_123456789",
    creditHash: "0xGENESIS_CREDIT_HASH_MOCK_987654321",
    anchorHash: "0xGENESIS_ANCHOR_HASH_MOCK_ABCDEF123456",
    contractTxHash: "0xGENESIS_TX_HASH_0000000000000000000",
    anchoredAt: "2025-10-01T10:00:00Z", // Past date
    source: "GENESIS"
};

export const getContractSnapshot = (): ContractSnapshotRef => {
    const stored = localStorage.getItem(DB_KEY_CONTRACT);
    if (stored) {
        try {
            const data = JSON.parse(stored);
            return { ...data, source: "LIVE" };
        } catch (e) {
            console.error("Failed to parse stored contract snapshot", e);
        }
    }
    return GENESIS_CONTRACT_SNAPSHOT;
};

export const saveContractSnapshot = (snapshot: ContractSnapshotRef): void => {
    localStorage.setItem(DB_KEY_CONTRACT, JSON.stringify(snapshot));
};

export const getPaymentEvents = (): PaymentEvent[] => {
    const stored = localStorage.getItem(DB_KEY_PAYMENTS);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

export const savePaymentEvent = (event: PaymentEvent): void => {
    const events = getPaymentEvents();
    events.push(event);
    localStorage.setItem(DB_KEY_PAYMENTS, JSON.stringify(events));
};

export const clearPaymentEvents = (): void => {
    localStorage.removeItem(DB_KEY_PAYMENTS);
};

/**
 * Deterministically sorts payment events.
 * Rule: receivedAt ASC, then eventId ASC.
 */
export const sortPaymentEvents = (events: PaymentEvent[]): PaymentEvent[] => {
    return [...events].sort((a, b) => {
        const timeA = new Date(a.receivedAt).getTime();
        const timeB = new Date(b.receivedAt).getTime();
        if (timeA !== timeB) return timeA - timeB;
        return a.eventId.localeCompare(b.eventId);
    });
};

/**
 * Adds a new payment event, recomputes the ledger, and anchors it.
 */
export const processPayment = async (
    amount: Money,
    scheduledDueDate: string
): Promise<{ event: PaymentEvent, snapshot: PaymentLedgerSnapshot, tx: TransactionResult }> => {

    // 1. Get current state
    const currentEvents = getPaymentEvents();
    const contractSnapshot = getContractSnapshot();

    // 2. Create New Event
    const newEvent: PaymentEvent = {
        schemaVersion: "payment_event_v1",
        contractId: contractSnapshot.contractId,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        propertyId: contractSnapshot.propertyId,
        noteId: null,
        contractAnchorRef: contractSnapshot,
        eventType: "PAYMENT_RECEIVED",
        scheduledDueDate,
        receivedAt: new Date().toISOString(),
        amount,
        method: "PAY_NOW",
        eventId: crypto.randomUUID(), // deterministic identity for this record
        statusAfter: "PAID"
    };

    // 3. Append and Sort
    const updatedEvents = sortPaymentEvents([...currentEvents, newEvent]);

    // 4. Generate Leaves (in sorted order)
    const leaves: string[] = [];
    for (const event of updatedEvents) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leaf = await generatePaymentLeafHash(event as any);
        leaves.push(leaf);
    }

    // 5. Compute Root
    const paymentLedgerRoot = await computeMerkleRoot(leaves);

    // 6. Create Snapshot Record
    const snapshotTimestamp = new Date().toISOString();
    const ledgerSnapshotPayload = {
        schemaVersion: "payment_ledger_snapshot_v1",
        contractId: contractSnapshot.contractId,
        chainId: 5003,
        paymentLedgerRoot,
        includedEventCount: updatedEvents.length,
        snapshotTimestamp,
        // We include the root in human readable form for the explorer
        humanReadable: `Payment Ledger Root: ${paymentLedgerRoot} (Count: ${updatedEvents.length})`
    };

    // 7. Anchor on Chain
    // We anchor the Full JSON so the root is visible in Input Data decoder
    const anchorPayloadJson = canonicalStringify(ledgerSnapshotPayload);
    const txResult = await submitCustodialTransaction(anchorPayloadJson);

    // 8. Update Event with Anchor Info & Finalize Snapshot
    // We update the local event with the tx hash for UI verification
    // This does NOT change the leaf hash because we exclude anchoredTxHash in generatePaymentLeafHash
    newEvent.anchoredTxHash = txResult.hash;

    // Re-save with the updated event (now including tx hash)
    // We need to replace the event in the array. Since we sorted, we find it or just re-map.
    // Easier: map over updatedEvents and update the one with matching eventId
    const finalEvents = updatedEvents.map(e =>
        e.eventId === newEvent.eventId ? { ...e, anchoredTxHash: txResult.hash } : e
    );

    const finalizedSnapshot: PaymentLedgerSnapshot = {
        ...ledgerSnapshotPayload,
        ledgerTxHash: txResult.hash,
        orderingRule: "receivedAt ASC, then eventId ASC",
    } as PaymentLedgerSnapshot;

    // 9. Persist
    localStorage.setItem(DB_KEY_PAYMENTS, JSON.stringify(finalEvents));

    return {
        event: newEvent,
        snapshot: finalizedSnapshot,
        tx: txResult
    };
};

/**
 * Returns data needed for the Audit Package.
 */
export const getAuditPackageData = async () => {
    const events = sortPaymentEvents(getPaymentEvents());
    const contractSnapshot = getContractSnapshot();

    // Recompute root to be sure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaves = await Promise.all(events.map(e => generatePaymentLeafHash(e as any)));
    const root = await computeMerkleRoot(leaves);

    return {
        contractSnapshot,
        paymentLedger: {
            orderingRule: "receivedAt ASC, then eventId ASC",
            events,
            calculatedRoot: root,
            leaves
        }
    };
};
