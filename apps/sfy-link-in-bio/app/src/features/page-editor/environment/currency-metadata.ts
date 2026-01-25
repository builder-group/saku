const CURRENCY_METADATA: Record<string, TCurrencyMetadata> = {
	USD: { symbol: '$', displayName: 'US Dollar', code: 'USD' },
	EUR: { symbol: '€', displayName: 'Euro', code: 'EUR' },
	GBP: { symbol: '£', displayName: 'British Pound', code: 'GBP' },
	CAD: { symbol: '$', displayName: 'Canadian Dollar', code: 'CAD' },
	AUD: { symbol: '$', displayName: 'Australian Dollar', code: 'AUD' },
	JPY: { symbol: '¥', displayName: 'Japanese Yen', code: 'JPY' },
	CHF: { symbol: 'Fr', displayName: 'Swiss Franc', code: 'CHF' },
	CNY: { symbol: '¥', displayName: 'Chinese Yuan', code: 'CNY' },
	SEK: { symbol: 'kr', displayName: 'Swedish Krona', code: 'SEK' },
	NOK: { symbol: 'kr', displayName: 'Norwegian Krone', code: 'NOK' },
	DKK: { symbol: 'kr', displayName: 'Danish Krone', code: 'DKK' },
	NZD: { symbol: '$', displayName: 'New Zealand Dollar', code: 'NZD' }
};

interface TCurrencyMetadata {
	symbol: string;
	displayName: string;
	code: string;
}

export function getCurrencySymbol(currencyCode: string): string {
	return CURRENCY_METADATA[currencyCode]?.symbol ?? currencyCode;
}

export function getCurrencyMetadata(currencyCode: string): TCurrencyMetadata | null {
	return CURRENCY_METADATA[currencyCode] ?? null;
}

export function getCurrencyOptions(): { label: string; value: string }[] {
	return Object.values(CURRENCY_METADATA).map((currency) => ({
		label: `${currency.symbol} ${currency.displayName} (${currency.code})`,
		value: currency.code
	}));
}
