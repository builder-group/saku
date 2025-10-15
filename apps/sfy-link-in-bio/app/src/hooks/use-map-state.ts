import { createState, TCreateStateOptions, TState, TStateNotifyOptions } from 'feature-state';
import { useMemoCleanup } from './react-router';

export function useMapState<GBaseValue, GMappedValue>(
	baseState: TState<GBaseValue, any>,
	config: TMapStateConfig<GBaseValue, GMappedValue>
): TState<GMappedValue, any>;
export function useMapState<GBaseValue, GMappedValue>(
	baseState: TState<GBaseValue, any> | undefined | null,
	config: TMapStateConfig<GBaseValue, GMappedValue>
): TState<GMappedValue, any> | undefined;
export function useMapState<GBaseValue, GMappedValue>(
	baseState: TState<GBaseValue, any> | undefined | null,
	config: TMapStateConfig<GBaseValue, GMappedValue>
): TState<GMappedValue, any> | undefined {
	return useMemoCleanup(
		() => (baseState != null ? mapState(baseState, config) : [undefined, () => {}]),
		// Note: No callbacks in deps because config object redefined on every render, callback refs change and would cause memo re-runs
		[baseState]
	) as TState<GMappedValue, any> | undefined;
}

export function mapState<GBaseValue, GMappedValue>(
	baseState: TState<GBaseValue, any>,
	config: TMapStateConfig<GBaseValue, GMappedValue>
): [TState<GMappedValue, any>, () => void] {
	const { map, sync, isEqual = Object.is, ...stateOptions } = config;

	const mappedState = createState(map(baseState._v), { queue: 'sync', ...stateOptions });

	// Keep mapped in sync with base
	const unsubscribeBaseState = baseState.listen(({ value, source }) => {
		if (source === 'mapState:mapped') {
			return;
		}

		const newMappedValue = map(value);

		// Only update if values are different (or isEqual is disabled)
		if (isEqual === false || !isEqual(newMappedValue, mappedState._v)) {
			mappedState._v = newMappedValue;
			mappedState._notify({ listenerContext: { source: 'mapState:base' } });
		}
	});

	// Keep base in sync with mapped
	let unsubscribeMappedState: (() => void) | undefined;
	if (sync != null) {
		unsubscribeMappedState = mappedState.listen(({ value, source }) => {
			if (source === 'mapState:base') {
				return;
			}

			sync(baseState, value, { listenerContext: { source: 'mapState:mapped' } });
		});
	}

	return [
		mappedState,
		() => {
			unsubscribeBaseState();
			unsubscribeMappedState?.();
		}
	];
}

interface TMapStateConfig<GBaseValue, GMappedValue> extends TCreateStateOptions {
	map: (baseValue: GBaseValue) => GMappedValue;
	sync?: (
		baseState: TState<GBaseValue, any>,
		mappedValue: GMappedValue,
		notifyOptions?: TStateNotifyOptions<GBaseValue>
	) => void;
	isEqual?: ((a: GMappedValue, b: GMappedValue) => boolean) | false;
}
