import { describe, expect, it } from 'vitest';
import { createStepr } from './create-stepr';

describe('createStepr', () => {
	const step1: TTestStep = { type: 'step1', value: 'first' };
	const step2: TTestStep = { type: 'step2', value: 'second' };
	const step3: TTestStep = { type: 'step3', value: 'third' };

	it('initializes with the initial step', () => {
		const stepr = createStepr<TTestStep>({ initialStep: step1 });
		expect(stepr.current._v).toEqual(step1);
		expect(stepr._stack).toEqual(['step1']);
		expect(stepr._visited).toEqual({ step1 });
	});

	describe('goTo', () => {
		it('changes current step and updates visited/stack', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			stepr.goTo(step2);

			expect(stepr.current._v).toEqual(step2);
			expect(stepr._stack).toEqual(['step1', 'step2']);
			expect(stepr._visited).toEqual({ step1, step2 });
		});
	});

	describe('onStepVisited', () => {
		it('triggers only when step type changes', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			const visits: TTestStep[] = [];

			stepr.onStepVisited(({ value }) => visits.push(value));

			// Same type, different value
			stepr.goTo({ ...step1, value: 'updated' });
			expect(visits).toHaveLength(0);

			// Different type
			stepr.goTo(step2);
			expect(visits).toHaveLength(1);
			expect(visits[0]).toEqual(step2);
		});
	});

	describe('goBack', () => {
		it('returns false if at the first step', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			expect(stepr.goBack()).toBe(false);
		});

		it('goes back to the previous step', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			stepr.goTo(step2);
			stepr.goTo(step3);

			expect(stepr.goBack()).toBe(true);
			expect(stepr.current._v).toEqual(step2);
		});
	});

	describe('goToVisited', () => {
		it('returns false if step not visited', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			expect(stepr.goToVisited('step2')).toBe(false);
		});

		it('returns true if already at step', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			expect(stepr.goToVisited('step1')).toBe(true);
		});

		it('goes to visited step and trims stack', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			stepr.goTo(step2);
			stepr.goTo(step3);
			stepr.goToVisited('step2');

			expect(stepr.current._v).toEqual(step2);
			expect(stepr._stack).toEqual(['step1', 'step2']);
		});
	});

	describe('reset', () => {
		it('resets to initial state', () => {
			const stepr = createStepr<TTestStep>({ initialStep: step1 });
			stepr.goTo(step2);
			stepr.goTo(step3);
			stepr.onStepVisited(() => {});

			stepr.reset();

			expect(stepr.current._v).toEqual(step1);
			expect(stepr._stack).toEqual(['step1']);
			expect(stepr._visited).toEqual({ step1: step1 });
			expect(stepr._stepVisitedListeners).toEqual([]);
		});
	});
});

type TTestStep =
	| { type: 'step1'; value: string }
	| { type: 'step2'; value: string }
	| { type: 'step3'; value: string };
