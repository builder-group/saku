import { shortId } from '@blgc/utils';
import { createStepr, type TStepr } from '@/lib/ui';

export function createOnboardingContext(callbackUrl: string): TOnboardingContext {
	return {
		_callbackUrl: callbackUrl,
		id: shortId(),
		stepr: createStepr<TOnboardingStep>({ initialStep: { type: 'welcome' } })
	};
}

export interface TOnboardingContext {
	_callbackUrl: string;
	id: string;
	stepr: TStepr<TOnboardingStep>;
}

export type TOnboardingStep =
	| { type: 'welcome' }
	| { type: 'site-creation-options'; selectedOption?: TSiteCreationOption }
	| { type: 'import-linkpop'; handle?: string }
	| { type: 'linkpop-preview'; url?: string }
	| { type: 'templates'; selectedTemplate?: TTemplate };

export type TSiteCreationOption = 'create-new' | 'import-linkpop';

export type TTemplate = 'blank';
