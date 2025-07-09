import { TListenerContext, TState, TStateSetOptions } from 'feature-state';

export interface TStepr<GStep extends TSteprBaseStep> {
	_visited: Partial<Record<string, GStep>>;
	_stack: GStep['type'][];
	_stepVisitedListeners: TStepVisitedListener<GStep>[];
	id: string;
	current: TState<GStep, []>;

	getVisited<GType extends GStep['type']>(
		stepType: GType | null | undefined
	): TStepByType<GStep, GType> | null;
	hasVisited(stepType: GStep['type'] | null | undefined): boolean;

	goToVisited(stepType: GStep['type']): boolean;
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

export type TStepByType<
	GStep extends { type: string },
	GType extends GStep['type']
> = GStep extends {
	type: GType;
}
	? GStep
	: never;
