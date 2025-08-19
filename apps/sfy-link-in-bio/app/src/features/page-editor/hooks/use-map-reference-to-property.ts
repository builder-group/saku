import { inherit, isInherited, TFlatNode, TReference, TUnreference } from '@repo/editor';
import { createState } from 'feature-state';
import { useMemoCleanup } from '@/hooks';
import { TNodeState } from '../lib';

export function useMapReferenceToProperty<
	GValue,
	GNodeValue extends TFlatNode,
	GReference extends TReference<any>
>(
	nodeState: TNodeState<GNodeValue>,
	config: TUseMapReferenceToPropertyConfig<GValue, GNodeValue, GReference>
) {
	const { topLevelReference, propertyReference, updateProperty } = config;

	return useMemoCleanup(
		() => {
			const state = createState<TReference<GValue> | undefined>(undefined, { queue: 'sync' });

			const unsubscribeNodeState = nodeState.subscribe(({ value }) => {
				// Check if the top-level reference itself is inherited
				const reference = topLevelReference(value);
				if (isInherited(reference)) {
					state.set(inherit());
				} else {
					state.set(propertyReference(reference as TUnreference<GReference>));
				}
			});

			const unsubscribePropertyState = state.subscribe(({ value }) => {
				if (value != null && !isInherited(value)) {
					updateProperty(value);
				}
			});

			return [
				state,
				() => {
					unsubscribeNodeState();
					unsubscribePropertyState();
				}
			];
		},
		// Note: No callbacks in deps because config object redefined on every render, callback refs change and would cause memo re-runs
		[nodeState]
	);
}

interface TUseMapReferenceToPropertyConfig<
	GValue,
	GNodeValue extends TFlatNode,
	GReference extends TReference<any>
> {
	/** Gets the top-level reference from the node value */
	topLevelReference: (value: GNodeValue) => GReference;
	/** Extracts the property reference from the unwrapped top-level reference */
	propertyReference: (value: TUnreference<GReference>) => TReference<GValue> | undefined;
	/** Updates the property value to keep it in sync with the state */
	updateProperty: (value: GValue) => void;
}
