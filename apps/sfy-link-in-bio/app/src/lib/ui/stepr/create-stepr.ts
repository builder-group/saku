import { shortId, withNew } from '@blgc/utils';
import { createState } from 'feature-state';
import { TStepr, TSteprBaseStep } from './types';

export function createStepr<GStep extends TSteprBaseStep>(
	config: TCreateSteprConfig<GStep>
): TStepr<GStep> {
	const { initialStep } = config;

	return withNew({
		_visited: { [initialStep.type]: initialStep },
		_stack: [initialStep.type],
		_stepVisitedListeners: [],
		id: shortId(),
		current: createState<GStep>(initialStep),

		_new(this: TStepr<GStep>) {
			this.current.subscribe(({ value: step, prevValue: prevStep }) => {
				if (step == null) {
					return;
				}

				// Sync current step to visited
				this._visited[step.type] = step;

				// Only trigger listeners if we're moving to a new step type
				if (step.type !== prevStep?.type) {
					this._stack.push(step.type);
					for (const listener of this._stepVisitedListeners) {
						listener({
							value: step,
							prevValue: prevStep ?? undefined
						});
					}
				}
			});
		},

		getVisited(this: TStepr<GStep>, step) {
			return step != null ? (this._visited[step] ?? null) : null;
		},
		hasVisited(this: TStepr<GStep>, step) {
			return step != null && step in this._visited;
		},

		goTo(this: TStepr<GStep>, step, options = {}) {
			const { listenerContext = {}, processListenerQueue = true } = options;
			listenerContext.source = listenerContext.source ?? 'goToStep';

			this.current.set(step, { listenerContext, processListenerQueue });
		},
		goToVisited(this: TStepr<GStep>, type) {
			const visited = this.getVisited(type);
			if (visited == null) {
				return false;
			}

			// If the step is already the current step, return true
			if (this.current._v?.type === type) {
				return true;
			}

			// Trim the stack to remove the target step and all that followed.
			// The target will be re-added when navigated to again.
			const idx = this._stack.lastIndexOf(type);
			if (idx !== -1) {
				this._stack.splice(idx);
			}

			this.goTo(visited, { listenerContext: { source: 'goToVisitedStep' } });
			return true;
		},
		goToLastVisited(this: TStepr<GStep>) {
			if (!this._stack.length) {
				return null;
			}

			const lastType = this._stack[this._stack.length - 1];
			if (lastType == null) {
				return null;
			}

			return this.goToVisited(lastType) ? lastType : null;
		},
		goBack(this: TStepr<GStep>) {
			if (!this._stack.length) {
				return false;
			}

			const currentStep = this.current._v;
			if (currentStep == null) {
				return false;
			}

			// If the current step is the first step, return false
			const idx = this._stack.lastIndexOf(currentStep.type);
			if (idx <= 0) {
				return false;
			}

			// Get the previous step
			const prevType = this._stack[idx - 1];
			if (prevType == null) {
				return false;
			}

			return this.goToVisited(prevType);
		},

		onStepVisited(this: TStepr<GStep>, callback) {
			this._stepVisitedListeners.push(callback);
			return () => {
				const idx = this._stepVisitedListeners.indexOf(callback);
				if (idx !== -1) {
					this._stepVisitedListeners.splice(idx, 1);
				}
			};
		},

		reset(this: TStepr<GStep>) {
			this._stack.length = 0;
			this._stepVisitedListeners.length = 0;
			this._visited = {};
			this.current.set(initialStep);
		}
	});
}

export interface TCreateSteprConfig<GStep extends TSteprBaseStep> {
	initialStep: GStep;
}
