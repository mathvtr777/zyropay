/**
 * Generates unique alphanumeric slugs for payment links
 */

const SLUG_LENGTH = 6;
const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars: 0, O, I, 1

/**
 * Generate a random slug
 */
export function generateSlug(): string {
    let slug = '';
    for (let i = 0; i < SLUG_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        slug += CHARACTERS[randomIndex];
    }
    return slug;
}

/**
 * Generate a unique slug by checking against existing slugs
 * @param checkExists - Async function that returns true if slug exists
 * @param maxAttempts - Maximum number of attempts to generate unique slug
 */
export async function generateUniqueSlug(
    checkExists: (slug: string) => Promise<boolean>,
    maxAttempts: number = 10
): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const slug = generateSlug();
        const exists = await checkExists(slug);

        if (!exists) {
            return slug;
        }
    }

    throw new Error('Failed to generate unique slug after maximum attempts');
}
