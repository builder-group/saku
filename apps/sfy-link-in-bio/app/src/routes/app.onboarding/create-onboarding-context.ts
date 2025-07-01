import { Err, Ok, shortId, type TResult } from '@blgc/utils';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { coreApiClient } from '@/environment';
import type { TSite } from '@/features/page-editor';
import { createStepr, type TStepr } from '@/lib/ui';

export function createOnboardingContext(
	config: TCreateOnboardingContextConfig
): TOnboardingContext {
	const { callbackUrl, shopify } = config;

	return {
		_callbackUrl: callbackUrl,
		id: shortId(),
		shopify,
		stepr: createStepr<TOnboardingStep>({ initialStep: { type: 'welcome' } }),

		continueFromWelcome() {
			this.stepr.goTo({ type: 'site-creation-options' });
		},

		continueFromSiteCreationOptions(option: TSiteCreationOption) {
			// Store the selection
			this.stepr.current.set({
				type: 'site-creation-options',
				selectedOption: option
			});

			switch (option) {
				case 'create-new':
					this.stepr.goTo({ type: 'templates' });
					break;
				case 'linkpop':
					this.stepr.goTo({ type: 'linkpop-url' });
					break;
			}
		},

		continueFromLinkpopUrl(handle: string) {
			// Store the handle
			this.stepr.current.set({
				type: 'linkpop-url',
				handle
			});

			const fullUrl = `https://linkpop.com/${handle.trim()}`;
			this.stepr.goTo({ type: 'linkpop-preview', url: fullUrl });
		},

		async continueFromLinkpopPreview(): Promise<TResult<void, string>> {
			// TODO: Import the actual LinkPop site
			// For now, use blank preset as placeholder
			const currentStep = this.stepr.current.get();
			if (currentStep.type !== 'linkpop-preview') {
				return Err('Invalid step');
			}

			// TODO: Fetch and parse LinkPop content
			// const linkpopSite = await fetchLinkpopSite(currentStep.url);
			// return this.continueToEditor(linkpopSite);

			return Err('LinkPop import not yet implemented');
		},

		async continueFromTemplates(preset: TSite): Promise<TResult<void, string>> {
			const idToken = await this.shopify.idToken();

			const result = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle: 'bio',
					displayName: 'My Bio Page',
					content: preset as any
				},
				{
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);

			if (result.isErr()) {
				return Err('Failed to create your bio page. Please try again.');
			}

			return Ok(undefined);
		},

		goBack() {
			this.stepr.goBack();
		}
	};
}

export interface TOnboardingContext {
	_callbackUrl: string;
	id: string;
	shopify: ShopifyGlobal;
	stepr: TStepr<TOnboardingStep>;

	continueFromWelcome: () => void;
	continueFromSiteCreationOptions: (option: TSiteCreationOption) => void;
	continueFromLinkpopUrl: (handle: string) => void;
	continueFromLinkpopPreview: () => Promise<TResult<void, string>>;
	continueFromTemplates: (preset: TSite) => Promise<TResult<void, string>>;
	goBack: () => void;
}

export interface TCreateOnboardingContextConfig {
	callbackUrl: string;
	shopify: ShopifyGlobal;
}

export type TOnboardingStep =
	| { type: 'welcome' }
	| { type: 'site-creation-options'; selectedOption?: TSiteCreationOption }
	| { type: 'linkpop-url'; handle?: string }
	| { type: 'linkpop-preview'; url?: string }
	| { type: 'templates'; selectedTemplate?: TTemplate };

export type TSiteCreationOption = 'create-new' | 'linkpop';

export type TTemplate = 'blank';
