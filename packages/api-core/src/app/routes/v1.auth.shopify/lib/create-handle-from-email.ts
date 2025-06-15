import { createHash } from 'crypto';

export function createHandleFromEmail(email: string): string {
	const [localPart] = email.toLowerCase().split('@') as [string, string];

	// Clean the local part (remove special chars except letters/numbers)
	const cleanLocalPart = localPart.replace(/[^a-z0-9]/g, '');

	// Generate a 4-digit discriminator from email hash
	const discriminator = createHash('sha256').update(email).digest('hex').slice(0, 8);

	return `${cleanLocalPart}${discriminator}`;
}
