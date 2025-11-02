export function getPlanKey(name: string): TPlanKey {
	if (name.toLowerCase().startsWith('awesome')) {
		return 'awesome';
	}
	return 'free';
}

export type TPlanKey = 'free' | 'awesome';
