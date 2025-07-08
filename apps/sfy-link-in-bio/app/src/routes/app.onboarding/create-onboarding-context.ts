import { Err, Ok, shortId, type TResult } from '@blgc/utils';
import { TSite } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { coreApiClient } from '@/environment';
import { blankPreset } from '@/features/page-editor';
import { createStepr, type TStepr } from '@/lib/ui';

export function createOnboardingContext(
	config: TCreateOnboardingContextConfig
): TOnboardingContext {
	const { shopify, shopId } = config;

	return {
		id: shortId(),
		shopify,
		shopId,
		stepr: createStepr<TOnboardingStep>({ initialStep: { type: 'welcome' } }),

		continueFromWelcome() {
			this.stepr.goTo({ type: 'handle' });
		},

		async continueFromHandle(handle: string) {
			const idToken = await this.shopify.idToken();
			const trimmedHandle = handle.trim();

			// Check if the handle is available
			const availabilityResult = await coreApiClient.get('/v1/shopify/redirect/availability', {
				queryParams: {
					path: `/${trimmedHandle}`
				},
				headers: {
					Authorization: `Bearer ${idToken}`
				}
			});
			if (availabilityResult.isErr()) {
				return Err('Failed to check handle availability. Please try again.');
			}

			const { isAvailable, conflictReason } = availabilityResult.value.data;
			if (!isAvailable) {
				return Err(conflictReason ?? 'This handle is not available. Please try a different one.');
			}

			// Store the handle in the step
			this.stepr.current.set({
				type: 'handle',
				handle: trimmedHandle
			});

			this.stepr.goTo({ type: 'site-creation-options' });

			return Ok(undefined);
		},

		continueFromSiteCreationOptions(option) {
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

		async continueFromLinkpopUrl(handle) {
			this.stepr.current.set({
				type: 'linkpop-url',
				handle
			});

			const fullUrl = `https://linkpop.com/${handle.trim()}`;
			const idToken = await this.shopify.idToken();

			const result = await coreApiClient.get('/v1/site/parse/external', {
				queryParams: {
					url: fullUrl
				},
				headers: {
					Authorization: `Bearer ${idToken}`
				}
			});
			if (result.isErr()) {
				// Check if it's a LinkPop parsing error
				if (result.error.code === '#ERR_LINKPOP_DATA_NOT_FOUND') {
					// Go directly to templates with a message about the fallback
					this.stepr.goTo({
						type: 'templates',
						selectedTemplate: 'blank',
						fallbackReason: 'linkpop_parse_error'
					});
					return Ok(undefined);
				}
				return Err('Failed to parse your LinkPop page. Please try again.');
			}

			this.stepr.goTo({
				type: 'linkpop-preview',
				url: fullUrl,
				site: result.value.data.data as unknown as TSite
			});

			return Ok(undefined);
		},

		async continueFromLinkpopPreview() {
			const currentStep = this.stepr.current.get();
			if (currentStep.type !== 'linkpop-preview' || currentStep.site == null) {
				return Err('Invalid step');
			}

			const idToken = await this.shopify.idToken();

			// Get the handle from the handle step
			const handleStep = this.stepr.getVisited('handle') as {
				type: 'handle';
				handle?: string;
			} | null;
			const handle = handleStep?.handle ?? 'bio';

			const createResult = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle,
					displayName: 'My Bio Page',
					content: currentStep.site as any
				},
				{
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);
			if (createResult.isErr()) {
				return Err('Failed to create your bio page. Please try again.');
			}

			return Ok(undefined);
		},

		async continueFromTemplates(selectedTemplate) {
			this.stepr.current.set({
				type: 'templates',
				selectedTemplate
			});

			let preset: TSite;
			switch (selectedTemplate) {
				case 'blank':
					preset = blankPreset;
					break;
				default:
					preset = blankPreset;
			}

			const idToken = await this.shopify.idToken();

			// Get the handle from the handle step
			const handleStep = this.stepr.getVisited('handle') as {
				type: 'handle';
				handle?: string;
			} | null;
			const handle = handleStep?.handle ?? 'bio';

			const result = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle,
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
	id: string;
	shopify: ShopifyGlobal;
	shopId: string;
	stepr: TStepr<TOnboardingStep>;

	continueFromWelcome: () => void;
	continueFromHandle: (handle: string) => Promise<TResult<void, string>>;
	continueFromSiteCreationOptions: (option: TSiteCreationOption) => void;
	continueFromLinkpopUrl: (handle: string) => Promise<TResult<void, string>>;
	continueFromLinkpopPreview: () => Promise<TResult<void, string>>;
	continueFromTemplates: (selectedTemplate: TTemplate) => Promise<TResult<void, string>>;
	goBack: () => void;
}

export interface TCreateOnboardingContextConfig {
	shopify: ShopifyGlobal;
	shopId: string;
}

export type TOnboardingStep =
	| { type: 'welcome' }
	| { type: 'handle'; handle?: string }
	| { type: 'site-creation-options'; selectedOption?: TSiteCreationOption }
	| { type: 'linkpop-url'; handle?: string }
	| { type: 'linkpop-preview'; url?: string; site?: TSite }
	| { type: 'templates'; selectedTemplate?: TTemplate; fallbackReason?: 'linkpop_parse_error' };

export type TSiteCreationOption = 'create-new' | 'linkpop';

export type TTemplate = 'blank';
