import { useSubscriber } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { mapState } from '@/hooks';

export function useMixinTokens<GTokenValue>(
	tokenMap: TState<Record<string, any>, any> | undefined | null
): TMixinToken<GTokenValue>[] {
	const [tokens, setTokens] = React.useState<TMixinToken<GTokenValue>[]>([]);

	useSubscriber(tokenMap, ({ value }) => {
		if (tokenMap == null) {
			setTokens([]);
			return;
		}

		// Go through each variant and create state via mapState
		const newTokens: TMixinToken<GTokenValue>[] = [];
		const unsubscribeCallbacks: (() => void)[] = [];
		Object.entries(value).forEach(([variant, token]) => {
			if (tokenMap != null && token != null) {
				const [mappedState, unsubscribe] = mapState(tokenMap, {
					map: (tokenMapValue) => {
						// Safe to access - variant exists because we're iterating over Object.entries(value)
						return tokenMapValue[variant].value;
					},
					sync: (tokenMapState, value: GTokenValue, notifyOptions) => {
						const tokenVariant = tokenMapState._v[variant];
						if (tokenVariant != null) {
							tokenVariant.value = value;
							tokenMapState._notify(notifyOptions);
						}
					}
				});

				unsubscribeCallbacks.push(unsubscribe);

				newTokens.push({
					variant,
					state: mappedState
				});
			}
		});

		setTokens(newTokens);

		return () => {
			unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
		};
	});

	return tokens;
}

interface TMixinToken<GTokenValue> {
	variant: string;
	state: TState<GTokenValue, any>;
}
