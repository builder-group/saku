import { inherit, isInherited, TReference, TUnreference } from '@repo/editor';
import { createState, TState } from 'feature-state';
import { useMemoCleanup } from '@/hooks';

export function useMapStateReference<
	GValue,
	GParentValue extends Record<string, any>,
	GReference extends TReference<any>
>(
	parentState: TState<GParentValue, any>,
	config: TMapStateReferenceConfig<GValue, GParentValue, GReference>
) {
	return useMemoCleanup(
		() => mapStateReference(parentState, config),
		// Note: No callbacks in deps because config object redefined on every render, callback refs change and would cause memo re-runs
		[parentState]
	);
}

export function mapStateReference<
	GValue,
	GParentValue extends Record<string, any>,
	GReference extends TReference<any>
>(
	parentState: TState<GParentValue, any>,
	config: TMapStateReferenceConfig<GValue, GParentValue, GReference>
): [TState<TReference<GValue> | undefined, any>, () => void] {
	const { getTopLevelReference, getPropertyReference, setProperty } = config;

	const childState = createState<TReference<GValue> | undefined>(undefined, { queue: 'sync' });

	// Keep child in sync with parent - handle inheritance
	const unsubscribeParentState = parentState.subscribe(({ value }) => {
		const reference = getTopLevelReference(value);
		if (isInherited(reference)) {
			childState.set(inherit());
		} else {
			childState.set(getPropertyReference(reference as TUnreference<GReference>));
		}
	});

	// Keep parent in sync with child
	const unsubscribeChildState = childState.subscribe(({ value }) => {
		if (value != null && !isInherited(value)) {
			setProperty(value);
		}
	});

	return [
		childState,
		() => {
			unsubscribeParentState();
			unsubscribeChildState();
		}
	];
}

interface TMapStateReferenceConfig<
	GValue,
	GParentValue extends Record<string, any>,
	GReference extends TReference<any>
> {
	/** Gets the top-level reference from the parent value */
	getTopLevelReference: (value: GParentValue) => GReference;
	/** Gets the property reference from the unwrapped top-level reference */
	getPropertyReference: (value: TUnreference<GReference>) => TReference<GValue> | undefined;
	/** Sets the property value to keep it in sync with the state */
	setProperty: (value: GValue) => void;
}
