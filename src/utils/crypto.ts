
/**
 * Canonically stringifies an object by recursively sorting keys.
 * Ensures deterministic output for hashing.
 */
export const canonicalStringify = (obj: any): string => {
    if (obj === null || obj === undefined) {
        return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
        return '[' + obj.map(item => canonicalStringify(item)).join(',') + ']';
    }
    if (typeof obj === 'object') {
        const sortedKeys = Object.keys(obj).sort();
        const parts = sortedKeys.map(key => {
            const val = canonicalStringify(obj[key]);
            return val !== undefined ? `${JSON.stringify(key)}:${val}` : '';
        }).filter(part => part !== '');
        return '{' + parts.join(',') + '}';
    }
    return JSON.stringify(obj);
};

/**
 * Generates a SHA-256 hash of the input string using the browser's Web Crypto API.
 * Returns a 0x-prefixed hex string.
 */
export const sha256 = async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return '0x' + hashHex;
};

/**
 * Generates a SHA-256 hash of the contract data.
 */
export const generateContractHash = async (data: Record<string, unknown>): Promise<string> => {
    const jsonString = canonicalStringify(data);
    return await sha256(jsonString);
};

/**
 * Generates a SHA-256 hash of the credit summary.
 */
export const generateCreditHash = async (data: Record<string, unknown>): Promise<string> => {
    const jsonString = canonicalStringify(data);
    return await sha256(jsonString);
};


/**
 * Generates a SHA-256 hash of a PaymentEvent.
 * The event must be strictly typed to ensure deterministic serialization.
 */
export const generatePaymentLeafHash = async (event: Record<string, unknown>): Promise<string> => {
    // strict copy to avoid mutation
    const eventForHashing = { ...event };
    // Remove metadata fields that are not part of the payment intent/content
    delete eventForHashing.anchoredTxHash;

    const jsonString = canonicalStringify(eventForHashing);
    return await sha256(jsonString);
};

/**
 * Computes the Merkle Root for a list of leaf hashes.
 * Uses a simple pairwise hashing strategy (A+B -> Hash(A+B)).
 * If an odd number of leaves, the last leaf is duplicated (or effectively hashed with itself, or just promoted - common strategy is duplicating last).
 * We will duplicate the last leaf if count is odd.
 */
export const computeMerkleRoot = async (leaves: string[]): Promise<string> => {
    if (leaves.length === 0) {
        return '0x0000000000000000000000000000000000000000000000000000000000000000';
    }

    let currentLevel = [...leaves];

    while (currentLevel.length > 1) {
        const nextLevel: string[] = [];

        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = (i + 1 < currentLevel.length) ? currentLevel[i + 1] : left; // Duplicate last if odd

            // Hash(left + right) - removing 0x prefix for concatenation, then adding back
            const combined = left.slice(2) + right.slice(2);
            // We need to re-hash. sha256 input is usually string or buffer. 
            // If we treat them as hex strings:
            // Let's stick to simple string concatenation of the hex values for this generic implementation
            // equivalent to packing them.
            const hash = await sha256(combined);
            nextLevel.push(hash);
        }
        currentLevel = nextLevel;
    }

    return currentLevel[0];
};
