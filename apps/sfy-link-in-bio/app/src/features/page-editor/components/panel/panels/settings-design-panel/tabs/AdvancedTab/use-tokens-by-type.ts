import { TToken } from '@repo/editor';
import { useSubscriber } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { mapState } from '@/hooks';

export function useTokensByType<GTokenType extends TToken['type'], GTokenValue>(
	tokenType: GTokenType,
	tokenMap: TState<Record<TToken['key'], TToken>, []>
): TTokenByType<GTokenValue>[] {
	const [tokens, setTokens] = React.useState<TTokenByType<GTokenValue>[]>([]);

	useSubscriber(tokenMap, ({ value }) => {
		// Filter tokens by type
		const filteredTokens = Object.entries(value).filter(([, token]) => token.type === tokenType);
		if (filteredTokens.length === 0) {
			setTokens([]);
			return;
		}

		// Create mapped states for each filtered token
		const newTokens: TTokenByType<GTokenValue>[] = [];
		const unsubscribeCallbacks: (() => void)[] = [];
		filteredTokens.forEach(([key, token]) => {
			// Create a mapped state for each token's value
			const [mappedState, unsubscribe] = mapState(tokenMap, {
				map: (tokenMapValue) => {
					return tokenMapValue[key]?.value as GTokenValue;
				},
				sync: (tokenMapState, value: GTokenValue, notifyOptions) => {
					const targetToken = tokenMapState._v[key];
					if (targetToken != null && targetToken.type === tokenType) {
						targetToken.value = value as any;
						tokenMapState._notify(notifyOptions);
					}
				}
			});

			unsubscribeCallbacks.push(unsubscribe);

			newTokens.push({
				key,
				name: token.name || formatTokenName(key, tokenType),
				state: mappedState
			});
		});

		setTokens(newTokens);

		return () => {
			unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
		};
	});

	return tokens;
}

interface TTokenByType<GTokenValue> {
	key: string;
	name: string;
	state: TState<GTokenValue, any>;
}

function formatTokenName(key: string, tokenType: string): string {
	// Remove the token type prefix if it exists
	// e.g., "appearance.default" -> "default", "button.primary" -> "primary"
	const withoutPrefix = key.startsWith(`${tokenType}.`) ? key.slice(tokenType.length + 1) : key;

	// Split by dots and capitalize each part
	// e.g., "primary.hover" -> "Primary Hover", "default" -> "Default"
	return withoutPrefix
		.split('.')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}
