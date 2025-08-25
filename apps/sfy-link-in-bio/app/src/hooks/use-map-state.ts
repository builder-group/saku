import { createState, TCreateStateOptions, TState, TStateNotifyOptions } from 'feature-state';
import { useMemoCleanup } from './react-router';

export function useMapState<GParentValue, GChildValue>(
	parentState: TState<GParentValue, any>,
	config: TMapStateConfig<GParentValue, GChildValue>
): TState<GChildValue, any>;
export function useMapState<GParentValue, GChildValue>(
	parentState: TState<GParentValue, any> | undefined | null,
	config: TMapStateConfig<GParentValue, GChildValue>
): TState<GChildValue, any> | undefined;
export function useMapState<GParentValue, GChildValue>(
	parentState: TState<GParentValue, any> | undefined | null,
	config: TMapStateConfig<GParentValue, GChildValue>
): TState<GChildValue, any> | undefined {
	return useMemoCleanup(
		() => (parentState != null ? mapState(parentState, config) : [undefined, () => {}]),
		// Note: No callbacks in deps because config object redefined on every render, callback refs change and would cause memo re-runs
		[parentState]
	) as TState<GChildValue, any> | undefined;
}

export function mapState<GParentValue, GChildValue>(
	parentState: TState<GParentValue, any>,
	config: TMapStateConfig<GParentValue, GChildValue>
): [TState<GChildValue, any>, () => void] {
	const { get, set, ...stateOptions } = config;

	const childState = createState(get(parentState._v), stateOptions);

	// Keep child in sync with parent
	const unsubscribeParentState = parentState.listen(({ value, source }) => {
		if (source === 'mapState:child') {
			return;
		}

		childState.set(get(value), { listenerContext: { source: 'mapState:parent' } });
	});

	// Keep parent in sync with child
	const unsubscribeChildState = childState.listen(({ value, source }) => {
		if (source === 'mapState:parent') {
			return;
		}

		set(parentState, value, { listenerContext: { source: 'mapState:child' } });
	});

	return [
		childState,
		() => {
			unsubscribeParentState();
			unsubscribeChildState();
		}
	];
}

interface TMapStateConfig<GParentValue, GChildValue> extends TCreateStateOptions {
	get: (parent: GParentValue) => GChildValue;
	set: (
		parent: TState<GParentValue, any>,
		child: GChildValue,
		notifyOptions?: TStateNotifyOptions<GParentValue>
	) => void;
}
