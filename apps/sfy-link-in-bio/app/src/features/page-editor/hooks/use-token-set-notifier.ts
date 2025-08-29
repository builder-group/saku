import { notEmpty } from '@blgc/utils';
import { createState, TState } from 'feature-state';
import { useMemoCleanup } from '@/hooks';
import { TMixinTokenGroupMap, TPageEditor } from '../lib';

export function useTokenSetNotifier(
	editor: TPageEditor,
	tokenTypes: (keyof TMixinTokenGroupMap)[]
): TState<null, []> {
	return useMemoCleanup(() => {
		const notifier = createState(null);

		// Subscribe to all specified token sets
		const unsubscribes = tokenTypes
			.map((type) => {
				const tokenState = editor.mixinTokenMap[type];
				if (tokenState == null) {
					return null;
				}

				return tokenState.subscribe(() => notifier._notify(), { key: `token-observer-${type}` });
			})
			.filter(notEmpty);

		return [notifier, () => unsubscribes.forEach((unsubscribe) => unsubscribe?.())];
	}, [editor, ...tokenTypes]);
}
