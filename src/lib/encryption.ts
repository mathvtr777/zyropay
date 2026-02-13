// Encryption utilities for client-side (before sending to server)
// The Edge Function will also decrypt these

const ENCRYPTION_ALGORITHM = 'AES-GCM'

async function getEncryptionKey(): Promise<CryptoKey> {
    // In production, this should be an environment variable
    // For now, we'll use a derived key from a passphrase
    const passphrase = import.meta.env.VITE_ENCRYPTION_PASSPHRASE || 'priva-default-key-change-in-production'

    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveKey']
    )

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('priva-salt'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: ENCRYPTION_ALGORITHM, length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

function uint8ArrayToHex(arr: Uint8Array): string {
    return Array.from(arr)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

function hexToUint8Array(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes
}

export async function encryptCredential(text: string): Promise<string> {
    try {
        const key = await getEncryptionKey()
        const encoder = new TextEncoder()
        const data = encoder.encode(text)

        const iv = crypto.getRandomValues(new Uint8Array(12))

        const encrypted = await crypto.subtle.encrypt(
            { name: ENCRYPTION_ALGORITHM, iv },
            key,
            data
        )

        const encryptedArray = new Uint8Array(encrypted)
        return `${uint8ArrayToHex(iv)}:${uint8ArrayToHex(encryptedArray)}`
    } catch (error) {
        console.error('Encryption error:', error)
        throw new Error('Failed to encrypt credential')
    }
}

export async function decryptCredential(encryptedText: string): Promise<string> {
    try {
        const [ivHex, encryptedHex] = encryptedText.split(':')
        const iv = hexToUint8Array(ivHex)
        const encrypted = hexToUint8Array(encryptedHex)

        const key = await getEncryptionKey()

        const decrypted = await crypto.subtle.decrypt(
            { name: ENCRYPTION_ALGORITHM, iv },
            key,
            encrypted.buffer as ArrayBuffer
        )

        return new TextDecoder().decode(decrypted)
    } catch (error) {
        console.error('Decryption error:', error)
        throw new Error('Failed to decrypt credential')
    }
}
