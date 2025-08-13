import { Err, Ok, shortId, sleep, type TResult } from '@blgc/utils';
import { TFlatSite } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { Crisp } from 'crisp-sdk-web';
import { coreApiClient } from '@/environment';
import { createShopifyTokenMiddleware, createStepr, type TStepr } from '@/lib';

export function createOnboardingContext(
	config: TCreateOnboardingContextConfig
): TOnboardingContext {
	const { shopify, shopId, presets } = config;

	return {
		id: shortId(),
		shopify,
		shopId,
		stepr: createStepr<TOnboardingStep>({ initialStep: { type: 'welcome' } }),
		presets: presets.reduce(
			(acc, preset) => {
				acc[preset.id] = preset;
				return acc;
			},
			{} as Record<string, TSitePreset>
		),

		mount() {
			// Once Crisp is loaded, reset the session to start with fresh chat history
			Crisp.session.onLoaded(() => {
				Crisp.session.reset();
				Crisp.session.setData({
					session_type: 'onboarding'
				});
				Crisp.session.offLoaded();
			});
		},

		continueFromWelcome() {
			Crisp.session.pushEvent('onboarding_started');
			Crisp.message.showText(
				"👋 Let's get your bio page set up in 2 minutes. I'm here if you need help."
			);

			// Note: Skip explicit account connection since it feels unnecessary and was only required for Shopify Sales Channel compliance
			// this.stepr.goTo({ type: 'account-connection' });
			this.stepr.goTo({ type: 'handle' });
		},

		continueFromAccountConnection() {
			this.stepr.current.set({
				type: 'account-connection'
			});

			// This is just a UI compliance step for Shopify requirements.
			// The workspace and workspace account are already created during OAuth.

			this.stepr.goTo({ type: 'handle' });
		},

		async continueFromHandle(handle, options = {}) {
			const { override = false } = options;
			const trimmedHandle = handle.trim();

			// Check if the handle is available
			const availabilityResult = await coreApiClient.get('/v1/shopify/redirect/availability', {
				queryParams: {
					path: `/${trimmedHandle}`
				},
				requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
			});
			if (availabilityResult.isErr()) {
				return Err({
					message: 'Failed to check handle availability. Please try again.',
					canOverrideRedirect: false
				});
			}

			const { isAvailable, conflictReason, conflictType } = availabilityResult.value.data;

			// Handle is not available and not overriding an existing redirect
			if (!isAvailable && (!override || conflictType !== 'existing_redirect')) {
				return Err({
					message: conflictReason ?? 'This handle is not available. Please try a different one.',
					canOverrideRedirect: conflictType === 'existing_redirect'
				});
			}

			this.stepr.current.set({
				type: 'handle',
				handle: trimmedHandle,
				shouldOverrideRedirect: override
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
				case 'create-new': {
					this.stepr.goTo({
						type: 'templates'
					});
					break;
				}
				case 'linkpop': {
					this.stepr.goTo({ type: 'linkpop-url' });
					break;
				}
			}
		},

		async continueFromLinkpopUrl(handle) {
			const fullUrl = `https://linkpop.com/${handle.trim()}`;

			const result = await coreApiClient.get('/v1/site/parse/external', {
				queryParams: {
					url: fullUrl
				},
				requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
			});
			if (result.isErr()) {
				// Check if it's a LinkPop parsing error
				if (
					result.error.code === '#ERR_LINKPOP_DATA_NOT_FOUND' ||
					result.error.code === '#ERR_EXTERNAL_HTML'
				) {
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
				site: result.value.data.content as unknown as TFlatSite
			});

			return Ok(undefined);
		},

		async continueFromLinkpopPreview() {
			const currentStep = this.stepr.current.get();
			if (currentStep.type !== 'linkpop-preview' || currentStep.site == null) {
				return Err('Invalid step');
			}

			// Get the handle and override flag from the handle step
			const { handle = 'bio', shouldOverrideRedirect = false } =
				this.stepr.getVisited('handle') ?? {};

			const createResult = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle,
					displayName: 'My Bio Page',
					content: currentStep.site as any,
					createRedirect: true,
					overrideRedirect: shouldOverrideRedirect
				},
				{
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
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

			const preset = this.presets[selectedTemplate];
			if (preset == null) {
				return Err('Invalid template');
			}

			// Get the handle and override flag from the handle step
			const { handle = 'bio', shouldOverrideRedirect = false } =
				this.stepr.getVisited('handle') ?? {};

			const result = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle,
					displayName: 'My Bio Page',
					content: preset.content as any,
					createRedirect: true,
					overrideRedirect: shouldOverrideRedirect
				},
				{
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);

			if (result.isErr()) {
				return Err('Failed to create your bio page. Please try again.');
			}

			return Ok(undefined);
		},

		async complete() {
			Crisp.session.pushEvent('onboarding_completed');

			// Sleep while opening the page editor
			await sleep(3000);

			Crisp.message.showText('🎉 Your bio page is live!');
			Crisp.message.showPicker({
				id: 'post_onboarding_goals',
				text: 'What would you like to do next?',
				choices: [
					{
						value: 'customize',
						label: 'Customize design',
						selected: false
					},
					{
						value: 'products',
						label: 'Add products',
						selected: false
					},
					{
						value: 'analytics',
						label: 'Track performance',
						selected: false
					},
					{
						value: 'other',
						label: 'Something else',
						selected: false
					}
				]
			});

			// Listen for picker interaction and show simple follow-up
			Crisp.message.onMessageReceived(async (data: any) => {
				if (
					data.origin !== 'update' ||
					data.type !== 'picker' ||
					data.content.id !== 'post_onboarding_goals'
				) {
					return;
				}

				await sleep(1000);

				Crisp.message.showText('Got it! Reach out anytime if you need help.');

				// Unregister the handler after it's used
				Crisp.message.offMessageReceived();
			});
		},

		goBack() {
			this.stepr.goBack();
		}
	};
}

export interface TCreateOnboardingContextConfig {
	shopify: ShopifyGlobal;
	shopId: string;
	presets: TSitePreset[];
}

export interface TOnboardingContext {
	id: string;
	shopify: ShopifyGlobal;
	shopId: string;
	stepr: TStepr<TOnboardingStep>;
	presets: Record<string, TSitePreset>;

	mount: () => void;
	continueFromWelcome: () => void;
	continueFromAccountConnection: () => void;
	continueFromHandle: (
		handle: string,
		options?: { override?: boolean }
	) => Promise<TResult<void, THandleStepError>>;
	continueFromSiteCreationOptions: (option: TSiteCreationOption) => void;
	continueFromLinkpopUrl: (handle: string) => Promise<TResult<void, TLinkpopStepError>>;
	continueFromLinkpopPreview: () => Promise<TResult<void, string>>;
	continueFromTemplates: (selectedTemplate: TTemplate) => Promise<TResult<void, string>>;
	complete: () => Promise<void>;
	goBack: () => void;
}

export type TOnboardingStep =
	| { type: 'welcome' }
	| { type: 'account-connection' }
	| {
			type: 'handle';
			handle?: string;
			shouldOverrideRedirect?: boolean;
	  }
	| { type: 'site-creation-options'; selectedOption?: TSiteCreationOption }
	| { type: 'linkpop-url'; handle?: string }
	| { type: 'linkpop-preview'; url?: string; site?: TFlatSite }
	| {
			type: 'templates';
			selectedTemplate?: TTemplate;
	  };

export type TSiteCreationOption = 'create-new' | 'linkpop';

export type TTemplate = 'blank';

export interface THandleStepError {
	message: string;
	canOverrideRedirect: boolean;
}

export interface TLinkpopStepError {
	message: string;
	isNotFound: boolean;
}

export interface TSitePreset {
	id: string;
	label: string;
	content: TFlatSite;
}
