import { TListenerContext, TState, TStateSetOptions } from 'feature-state';

export interface TStepr<GStep extends TSteprBaseStep> {
	_visited: Partial<Record<string, GStep>>;
	_stack: GStep['type'][];
	_stepVisitedListeners: TStepVisitedListener<GStep>[];
	id: string;
	current: TState<GStep, []>;

	getVisited(step: GStep['type'] | null | undefined): GStep | null;
	hasVisited(step: GStep['type'] | null | undefined): boolean;

	goToVisited(step: GStep['type']): boolean;
	goToLastVisited(): GStep['type'] | null;
	goTo(step: GStep, options?: TStateSetOptions<GStep>): void;
	goBack(): boolean;

	onStepVisited(listener: TStepVisitedListener<GStep>): () => void;

	reset(): void;
}

export type TStepVisitedListener<GStep extends TSteprBaseStep> = (
	cx: TListenerContext<GStep>
) => void;

export interface TSteprBaseStep {
	type: string;
}
