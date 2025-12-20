
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

