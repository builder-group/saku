import { createState, TCreateStateOptions, TState } from 'feature-state';
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
	const { get, set, queue = 'sync' } = config;

	const childState = createState(get(parentState._v), { queue });

	// Keep child in sync with parent
	const unsubscribeParentState = parentState.listen(({ value }) => {
		childState.set(get(value));
	});

	// Keep parent in sync with child
	const unsubscribeChildState = childState.listen(({ value }) => {
		set(parentState, value);
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
	set: (parent: TState<GParentValue, any>, child: GChildValue) => void;
}
