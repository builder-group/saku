import { shortId, sleep } from '@blgc/utils';
import { TFlatSite, TTheme } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { RequestError } from 'feature-fetch';
import { Err, Ok, TResult } from 'tuple-result';
import { coreApiClient } from '@/environment';
import { applyThemeToSite } from '@/features/page-editor';
import { createShopifyTokenMiddleware, createStepr, Crisp, type TStepr } from '@/lib';
import { externalSiteProviderMap, TExternalSiteProvider } from './external-site-provider';

export function createOnboardingContext(
	config: TCreateOnboardingContextConfig
): TOnboardingContext {
	const { shopify, shopId, primaryDomain, defaultHandle, presets, crisp } = config;

	return {
		id: shortId(),
		shopify,
		shopId,
		primaryDomain,
		defaultHandle,
		stepr: createStepr<TOnboardingStep>({ initialStep: { type: 'welcome' } }),
		presets: presets.reduce(
			(acc, preset) => {
				acc[preset.id] = preset;
				return acc;
			},
			{} as Record<string, TSitePreset>
		),

		mount() {
			crisp?.resetSession();
			crisp?.startThread(`onboarding_${this.id}`);
		},

		continueFromWelcome() {
			crisp?.showMessageAsOperator(
				'text',
				"👋 Let's get your bio page set up in 2 minutes. I'm here if you need help."
			);

			// Note: Skip explicit account connection since it feels unnecessary and was only required for Shopify Sales Channel compliance
			// this.stepr.goTo({ type: 'account-connection' });

			// Skip handle step if default handle is available to reduce onboarding friction
			// and most users will use the default anyway
			if (defaultHandle.isAvailable) {
				this.stepr.current.set({
					type: 'handle',
					handle: defaultHandle.handle,
					shouldOverrideRedirect: false
				});
				this.stepr.goTo({ type: 'site-creation-options' });
			} else {
				this.stepr.goTo({ type: 'handle' });
			}
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
					message: 'Failed to check handle availability.',
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
						type: 'theme'
					});
					break;
				}
				case 'linkpop': {
					this.stepr.goTo({ type: 'linkpop-url' });
					break;
				}
				case 'saku': {
					this.stepr.goTo({ type: 'saku-url' });
					break;
				}
			}
		},

		async continueFromExternalSiteUrl(provider, url) {
			const [isParseOk, parseErr, parseResponse] = await coreApiClient.get(
				'/v1/site/parse/external',
				{
					queryParams: {
						url: url.trim()
					},
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);
			if (!isParseOk) {
				const status = parseErr instanceof RequestError ? parseErr.status : undefined;
				switch (status) {
					case 404:
						return Err({
							message: `Could not find ${externalSiteProviderMap[provider].name} page. Please check the handle and try again.`,
							isNotFound: true
						});
					default:
						return Err({
							message: `Failed to parse ${externalSiteProviderMap[provider].name} page.`,
							isNotFound: false
						});
				}
			}

			switch (parseResponse.data.provider) {
				case 'linkpop': {
					this.stepr.goTo({ type: 'linkpop-url', handle: parseResponse.data.handle });
					break;
				}
				case 'saku': {
					this.stepr.current.set({
						type: 'saku-url',
						workspaceHandle: parseResponse.data.workspaceHandle,
						siteHandle: parseResponse.data.siteHandle
					});
					break;
				}
			}
			this.stepr.goTo({
				type: 'site-preview',
				url: url.trim(),
				site: parseResponse.data.content as unknown as TFlatSite
			});
			return Ok(undefined);
		},

		async continueFromSitePreview() {
			const currentStep = this.stepr.current.get();
			if (currentStep.type !== 'site-preview') {
				return Err('Invalid step');
			}

			// Get the handle and override flag from the handle step
			const { handle = 'bio', shouldOverrideRedirect = false } =
				this.stepr.getVisited('handle') ?? {};

			const [isCreateOk] = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle,
					displayName: 'My Bio Page',
					content: currentStep.site as unknown as Record<string, unknown>,
					createRedirect: true,
					overrideRedirect: shouldOverrideRedirect,
					uploadAssets: true
				},
				{
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);
			if (!isCreateOk) {
				return Err('Failed to create your bio page.');
			}

			return Ok(undefined);
		},

		async continueFromTheme(selectedTheme) {
			this.stepr.current.set({
				type: 'theme',
				selectedTheme
			});

			const preset = this.presets['blank'];
			if (preset == null) {
				return Err('Could not find blank preset');
			}
			const siteContent = applyThemeToSite(preset.content, selectedTheme);

			// Get the handle and override flag from the handle step
			const {
				handle = this.defaultHandle.handle,
				shouldOverrideRedirect = this.defaultHandle.isAvailable
			} = this.stepr.getVisited('handle') ?? {};

			const result = await coreApiClient.post(
				'/v1/shopify/site',
				{
					handle,
					displayName: 'My Bio Page',
					content: siteContent as unknown as Record<string, unknown>,
					createRedirect: true,
					overrideRedirect: shouldOverrideRedirect,
					uploadAssets: false
				},
				{
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);
			if (result.isErr()) {
				return Err('Failed to create your bio page.');
			}

			return Ok(undefined);
		},

		async complete() {
			setTimeout(() => {
				crisp?.showMessageAsOperator('text', '🎉 Your bio page is live!');
				crisp?.showMessageAsOperator('picker', {
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
				const unsubscribe = crisp?.onMessageReceived(async (data) => {
					if (data.origin !== 'update' || data.type !== 'picker') {
						return;
					}
					await sleep(1000);
					crisp?.showMessageAsOperator('text', 'Got it! Reach out anytime if you need help.');
					unsubscribe?.();
				});
			}, 3000);
		},

		goBack() {
			this.stepr.goBack();
		}
	};
}

export interface TCreateOnboardingContextConfig {
	shopify: ShopifyGlobal;
	shopId: string;
	primaryDomain: string;
	defaultHandle: { handle: string; isAvailable: boolean };
	presets: TSitePreset[];
	crisp?: Crisp;
}

export interface TOnboardingContext {
	id: string;
	shopify: ShopifyGlobal;
	shopId: string;
	primaryDomain: string;
	defaultHandle: { handle: string; isAvailable: boolean };
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
	continueFromExternalSiteUrl: (
		provider: TExternalSiteProvider,
		url: string
	) => Promise<TResult<void, TExternalSiteUrlStepError>>;
	continueFromSitePreview: () => Promise<TResult<void, string>>;
	continueFromTheme: (selectedTheme: TTheme) => Promise<TResult<void, string>>;
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
	| { type: 'saku-url'; workspaceHandle?: string; siteHandle?: string }
	| { type: 'site-preview'; url?: string; site?: TFlatSite }
	| {
			type: 'theme';
			selectedTheme?: TTheme;
	  };

export type TSiteCreationOption = 'create-new' | 'linkpop' | 'saku';

export type TTemplate = 'blank';

export interface THandleStepError {
	message: string;
	canOverrideRedirect: boolean;
}

export interface TExternalSiteUrlStepError {
	message: string;
	isNotFound: boolean;
}

export interface TSitePreset {
	id: string;
	label: string;
	content: TFlatSite;
}
