import { inherit, isInherited, TReference, TUnreference } from '@repo/editor';
import { createState, TCreateStateOptions, TState, TStateNotifyOptions } from 'feature-state';
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
	const { getTopLevelReference, getPropertyReference, setProperty, ...stateOptions } = config;

	const childState = createState<TReference<GValue> | undefined>(undefined, stateOptions);

	// Keep child in sync with parent - handle inheritance
	const unsubscribeParentState = parentState.subscribe(({ value, source }) => {
		if (source === 'mapStateReference:child') {
			return;
		}

		const reference = getTopLevelReference(value);
		if (isInherited(reference)) {
			childState.set(inherit(), { listenerContext: { source: 'mapStateReference:parent' } });
		} else {
			childState.set(getPropertyReference(reference as TUnreference<GReference>), {
				listenerContext: { source: 'mapStateReference:parent' }
			});
		}
	});

	// Keep parent in sync with child
	const unsubscribeChildState = childState.listen(({ value, source }) => {
		if (source === 'mapStateReference:parent') {
			return;
		}

		if (value != null && !isInherited(value)) {
			setProperty(value, { listenerContext: { source: 'mapStateReference:parent' } });
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
> extends TCreateStateOptions {
	/** Gets the top-level reference from the parent value */
	getTopLevelReference: (value: GParentValue) => GReference;
	/** Gets the property reference from the unwrapped top-level reference */
	getPropertyReference: (value: TUnreference<GReference>) => TReference<GValue> | undefined;
	/** Sets the property value to keep it in sync with the state */
	setProperty: (value: GValue, notifyOptions?: TStateNotifyOptions<GParentValue>) => void;
}
