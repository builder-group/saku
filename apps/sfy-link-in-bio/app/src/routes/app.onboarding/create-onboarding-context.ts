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

		async continueFromHandle(handle, options = {}) {
			const { override = false } = options;
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
				return Err({
					message: 'Failed to check handle availability. Please try again.',
					canOverride: false
				});
			}

			const { isAvailable, conflictReason, conflictType } = availabilityResult.value.data;

			// Handle is not available and not overriding an existing redirect
			if (!isAvailable && (!override || conflictType !== 'existing_redirect')) {
				return Err({
					message: conflictReason ?? 'This handle is not available. Please try a different one.',
					canOverride: conflictType === 'existing_redirect',
					conflictType
				});
			}

			this.stepr.current.set({
				type: 'handle',
				handle: trimmedHandle,
				override
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
			const idToken = await this.shopify.idToken();
			const fullUrl = `https://linkpop.com/${handle.trim()}`;

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
					return Err({
						message: 'Could not find your LinkPop page. Please check the handle and try again.',
						isNotFound: true
					});
				}
				return Err({
					message: 'Failed to parse your LinkPop page. Please try again.',
					isNotFound: false
				});
			}

			// Store the handle
			this.stepr.current.set({
				type: 'linkpop-url',
				handle: handle.trim()
			});

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
	continueFromHandle: (
		handle: string,
		options?: { override?: boolean }
	) => Promise<TResult<void, THandleStepError>>;
	continueFromSiteCreationOptions: (option: TSiteCreationOption) => void;
	continueFromLinkpopUrl: (handle: string) => Promise<TResult<void, TLinkpopStepError>>;
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
	| { type: 'handle'; handle?: string; override?: boolean }
	| { type: 'site-creation-options'; selectedOption?: TSiteCreationOption }
	| { type: 'linkpop-url'; handle?: string }
	| { type: 'linkpop-preview'; url?: string; site?: TSite }
	| { type: 'templates'; selectedTemplate?: TTemplate };

export type TSiteCreationOption = 'create-new' | 'linkpop';

export type TTemplate = 'blank';

export interface THandleStepError {
	message: string;
	canOverride: boolean;
	conflictType?: 'reserved_path' | 'existing_redirect' | null;
}

export interface TLinkpopStepError {
	message: string;
	isNotFound: boolean;
}
