import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

const baseUrl = 'https://app.chatwoot.com';

export const chatwootConfig = {
	websiteToken: validateEnvVar(
		{
			envKey: 'VITE_CHATWOOT_TOKEN',
			// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
			value: import.meta.env.VITE_CHATWOOT_TOKEN,
			validator: vValidator(v.string())
		},
		{}
	),
	baseUrl,
	sdkUrl: `${baseUrl}/packs/js/sdk.js`,
	// https://www.chatwoot.com/hc/user-guide/articles/1677587234-how-to-send-additional-user-information-to-chatwoot-using-sdk#sdk-settings
	settings: {
		hideMessageBubble: false,
		showUnreadMessagesDialog: false,
		position: 'right',
		locale: 'en',
		useBrowserLanguage: false,
		type: 'standard',
		darkMode: 'auto',
		baseDomain: 'saku.so',

		welcomeTitle: 'How can I help you today?',
		welcomeDescription: "I'm here to answer your questions or hear your feedback.",
		availableMessage: "I'm online and ready to chat!",
		unavailableMessage: "I'm currently offline.",

		enableFileUpload: true,
		enableEmojiPicker: true,
		enableEndConversation: true
	}
};
