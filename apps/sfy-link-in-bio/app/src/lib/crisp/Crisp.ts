import { Err, Ok, TResult } from 'tuple-result';
import { crispConfig, logger } from '../../environment';
import { AppError } from '../AppError';

// https://github.com/crisp-im/crisp-sdk-web
// Note: Custom wrapper instead of official SDK due to:
// - Limited support for multiple event listeners
// - Missing method to check if support members are online
// - Need for better TypeScript integration and type safety
export class Crisp {
	private static _injected = false;

	private _messageReceivedListeners: TMessageListener[] = [];
	private _messageSentListeners: TMessageListener[] = [];
	private _websiteAvailabilityListeners: TWebsiteAvailabilityListener[] = [];
	private _chatOpenedListeners: TChatEventListener[] = [];
	private _chatClosedListeners: TChatEventListener[] = [];

	private constructor() {
		// Private constructor - only accessible through create
	}

	public static create(config: TCrispConfig): TResult<Crisp, AppError> {
		if (typeof window === 'undefined') {
			return Err(new AppError('#ERR_WINDOW_UNDEFINED'));
		}

		// Assign $crisp singleton
		if (window.$crisp == null) {
			window.$crisp = [] as unknown as TCrispSdk;
		}

		const crisp = new Crisp();
		crisp.configure(config);

		// Inject Crisp if not already injected
		if (!crisp.isInjected()) {
			const injectResult = crisp.inject();
			if (injectResult.isErr()) {
				return Err(injectResult.error);
			}
		}

		// Poll every 500ms to check if Crisp is ready
		// because Crisp needs time to initialize the $crisp singleton
		const checkReady = () => {
			if (crisp.isInjected()) {
				config.onReady?.(crisp);
			} else {
				setTimeout(checkReady, 500);
			}
		};
		checkReady();

		return Ok(crisp);
	}

	public configure(config: TCrispConfig): void {
		window.CRISP_WEBSITE_ID = config.websiteId;
		window.CRISP_RUNTIME_CONFIG = {};

		if (config.tokenId != null) {
			window.CRISP_TOKEN_ID = config.tokenId;
		}

		if (config.sessionMerge != null) {
			window.CRISP_RUNTIME_CONFIG.session_merge = true;
		}

		if (config.locale != null) {
			window.CRISP_RUNTIME_CONFIG.locale = config.locale;
		}

		if (config.lockFullview != null) {
			window.CRISP_RUNTIME_CONFIG.lock_full_view = true;
		}

		if (config.lockMaximized != null) {
			window.CRISP_RUNTIME_CONFIG.lock_maximized = true;
		}

		if (config.cookieDomain != null) {
			window.CRISP_COOKIE_DOMAIN = config.cookieDomain;
		}

		if (config.cookieExpire != null) {
			window.CRISP_COOKIE_EXPIRE = config.cookieExpire;
		}

		if (config.safeMode != null) {
			window.$crisp.push(['safe', config.safeMode]);
		}
	}

	public inject(): TResult<void, AppError> {
		if (typeof window === 'undefined') {
			return Err(new AppError('#ERR_WINDOW_UNDEFINED'));
		}

		if (window.CRISP_WEBSITE_ID == null) {
			return Err(new AppError('#ERR_WEBSITE_ID_MISSING'));
		}

		const head = document.getElementsByTagName('head')[0];
		if (head == null) {
			return Err(new AppError('#ERR_HEAD_NOT_FOUND'));
		}

		const script = document.createElement('script');
		script.src = crispConfig.clientUrl;
		script.async = true;

		head.appendChild(script);

		Crisp._injected = true;
		return Ok(undefined);
	}

	public isInjected(): boolean {
		return Crisp._injected || (window.$crisp != null && typeof window.$crisp.is === 'function');
	}

	public configureUser(userData: TUserData): void {
		if (userData.email != null) {
			window.$crisp.push(['set', 'user:email', [userData.email]]);
		}

		if (userData.nickname != null) {
			window.$crisp.push(['set', 'user:nickname', [userData.nickname]]);
		}

		if (userData.phone != null) {
			window.$crisp.push(['set', 'user:phone', [userData.phone]]);
		}

		if (userData.avatar != null) {
			window.$crisp.push(['set', 'user:avatar', [userData.avatar]]);
		}

		if (userData.company != null) {
			const companyData: TUserCompanyData = {};

			if (userData.company.url != null) {
				companyData.url = userData.company.url;
			}

			if (userData.company.description != null) {
				companyData.description = userData.company.description;
			}

			if (userData.company.employment != null) {
				companyData.employment = [
					userData.company.employment.title,
					userData.company.employment.role
				];
			}

			if (userData.company.geolocation != null) {
				companyData.geolocation = [
					userData.company.geolocation.country,
					userData.company.geolocation.city
				];
			}

			window.$crisp.push(['set', 'user:company', [userData.company.name, companyData]]);
		}
	}

	public isSupportOnline(): boolean {
		return window.$crisp.is('website:available');
	}

	public openChat(done?: boolean): void {
		window.$crisp.push(['do', 'chat:open', [done]]);
	}

	public closeChat(): void {
		window.$crisp.push(['do', 'chat:close']);
	}

	public startThread(id: string): void {
		this.endThread();
		window.$crisp.push(['do', 'message:thread:start', [id]]);
	}

	public endThread(id?: string): void {
		window.$crisp.push(['do', 'message:thread:end', [id]]);
	}

	public resetSession(reload?: boolean): void {
		window.$crisp.push(['do', 'session:reset', [reload]]);
	}

	public setSessionData(key: string, value: string | boolean | number): void {
		window.$crisp.push(['set', 'session:data', [[[key, value]]]]);
	}

	public getSessionData<T extends string | boolean | number>(key: string): T {
		return window.$crisp.get('session:data', key);
	}

	// Send message as user (visitor) - appears in the conversation
	public sendMessageAsUser(type: 'text', content: string): void;
	public sendMessageAsUser(type: 'file', content: TFileContent): void;
	public sendMessageAsUser(type: 'animation', content: TAnimationContent): void;
	public sendMessageAsUser(type: 'audio', content: TAudioContent): void;
	public sendMessageAsUser(type: 'text' | 'file' | 'animation' | 'audio', content: unknown): void {
		switch (type) {
			case 'text':
				window.$crisp.push(['do', 'message:send', ['text', content as string]]);
				break;
			case 'file':
				window.$crisp.push(['do', 'message:send', ['file', content as TFileContent]]);
				break;
			case 'animation':
				window.$crisp.push(['do', 'message:send', ['animation', content as TAnimationContent]]);
				break;
			case 'audio':
				window.$crisp.push(['do', 'message:send', ['audio', content as TAudioContent]]);
				break;
		}
	}

	// Show message as operator (support) - local display only
	public showMessageAsOperator(type: 'text', content: string): void;
	public showMessageAsOperator(type: 'animation', content: TAnimationContent): void;
	public showMessageAsOperator(type: 'picker', content: TPickerContent): void;
	public showMessageAsOperator(type: 'field', content: TFieldContent): void;
	public showMessageAsOperator(type: 'carousel', content: TCarouselContent): void;
	public showMessageAsOperator(
		type: 'text' | 'animation' | 'picker' | 'field' | 'carousel',
		content: unknown
	): void {
		switch (type) {
			case 'text':
				window.$crisp.push(['do', 'message:show', ['text', content as string]]);
				break;
			case 'animation':
				window.$crisp.push(['do', 'message:show', ['animation', content as TAnimationContent]]);
				break;
			case 'picker':
				window.$crisp.push(['do', 'message:show', ['picker', content as TPickerContent]]);
				break;
			case 'field':
				window.$crisp.push(['do', 'message:show', ['field', content as TFieldContent]]);
				break;
			case 'carousel':
				window.$crisp.push(['do', 'message:show', ['carousel', content as TCarouselContent]]);
				break;
		}
	}

	public onMessageReceived(listener: TMessageListener): TUnregisterFunction {
		this._messageReceivedListeners.push(listener);

		// Set up the global message received listener if this is the first listener
		if (this._messageReceivedListeners.length === 1) {
			window.$crisp.push([
				'on',
				'message:received',
				(message: TMessageData) => {
					this._messageReceivedListeners.forEach((listener) => {
						try {
							listener(message);
						} catch (error) {
							logger.warn('Error in Crisp message received listener:', error);
						}
					});
				}
			]);
		}

		// Return unregister function
		return () => {
			const index = this._messageReceivedListeners.indexOf(listener);
			if (index !== -1) {
				this._messageReceivedListeners.splice(index, 1);
			}

			// Clean up global listener if no more listeners
			if (this._messageReceivedListeners.length === 0) {
				window.$crisp.push(['off', 'message:received']);
			}
		};
	}

	public onMessageSent(listener: TMessageListener): TUnregisterFunction {
		this._messageSentListeners.push(listener);

		// Set up the global message sent listener if this is the first listener
		if (this._messageSentListeners.length === 1) {
			window.$crisp.push([
				'on',
				'message:sent',
				(message: TMessageData) => {
					this._messageSentListeners.forEach((listener) => {
						try {
							listener(message);
						} catch (error) {
							logger.warn('Error in Crisp message sent listener:', error);
						}
					});
				}
			]);
		}

		// Return unregister function
		return () => {
			const index = this._messageSentListeners.indexOf(listener);
			if (index !== -1) {
				this._messageSentListeners.splice(index, 1);
			}

			// Clean up global listener if no more listeners
			if (this._messageSentListeners.length === 0) {
				window.$crisp.push(['off', 'message:sent']);
			}
		};
	}

	public onWebsiteAvailabilityChanged(listener: TWebsiteAvailabilityListener): TUnregisterFunction {
		this._websiteAvailabilityListeners.push(listener);

		// Set up the global website availability listener if this is the first listener
		if (this._websiteAvailabilityListeners.length === 1) {
			window.$crisp.push([
				'on',
				'website:availability:changed',
				(isAvailable: boolean) => {
					this._websiteAvailabilityListeners.forEach((listener) => {
						try {
							listener(isAvailable);
						} catch (error) {
							logger.warn('Error in Crisp website availability listener:', error);
						}
					});
				}
			]);
		}

		// Return unregister function
		return () => {
			const index = this._websiteAvailabilityListeners.indexOf(listener);
			if (index !== -1) {
				this._websiteAvailabilityListeners.splice(index, 1);
			}

			// Clean up global listener if no more listeners
			if (this._websiteAvailabilityListeners.length === 0) {
				window.$crisp.push(['off', 'website:availability:changed']);
			}
		};
	}

	public onChatOpened(listener: TChatEventListener): TUnregisterFunction {
		this._chatOpenedListeners.push(listener);

		// Set up the global chat opened listener if this is the first listener
		if (this._chatOpenedListeners.length === 1) {
			window.$crisp.push([
				'on',
				'chat:opened',
				() => {
					this._chatOpenedListeners.forEach((listener) => {
						try {
							listener();
						} catch (error) {
							logger.warn('Error in Crisp chat opened listener:', error);
						}
					});
				}
			]);
		}

		// Return unregister function
		return () => {
			const index = this._chatOpenedListeners.indexOf(listener);
			if (index !== -1) {
				this._chatOpenedListeners.splice(index, 1);
			}

			// Clean up global listener if no more listeners
			if (this._chatOpenedListeners.length === 0) {
				window.$crisp.push(['off', 'chat:opened']);
			}
		};
	}

	public onChatClosed(listener: TChatEventListener): TUnregisterFunction {
		this._chatClosedListeners.push(listener);

		// Set up the global chat closed listener if this is the first listener
		if (this._chatClosedListeners.length === 1) {
			window.$crisp.push([
				'on',
				'chat:closed',
				() => {
					this._chatClosedListeners.forEach((listener) => {
						try {
							listener();
						} catch (error) {
							logger.warn('Error in Crisp chat closed listener:', error);
						}
					});
				}
			]);
		}

		// Return unregister function
		return () => {
			const index = this._chatClosedListeners.indexOf(listener);
			if (index !== -1) {
				this._chatClosedListeners.splice(index, 1);
			}

			// Clean up global listener if no more listeners
			if (this._chatClosedListeners.length === 0) {
				window.$crisp.push(['off', 'chat:closed']);
			}
		};
	}

	public removeMessageSentListeners(): void {
		if (this._messageSentListeners.length > 0) {
			window.$crisp.push(['off', 'message:sent']);
			this._messageSentListeners = [];
		}
	}

	public removeMessageReceivedListeners(): void {
		if (this._messageReceivedListeners.length > 0) {
			window.$crisp.push(['off', 'message:received']);
			this._messageReceivedListeners = [];
		}
	}

	public removeChatOpenedListeners(): void {
		if (this._chatOpenedListeners.length > 0) {
			window.$crisp.push(['off', 'chat:opened']);
			this._chatOpenedListeners = [];
		}
	}

	public removeChatClosedListeners(): void {
		if (this._chatClosedListeners.length > 0) {
			window.$crisp.push(['off', 'chat:closed']);
			this._chatClosedListeners = [];
		}
	}

	public removeWebsiteAvailabilityListeners(): void {
		if (this._websiteAvailabilityListeners.length > 0) {
			window.$crisp.push(['off', 'website:availability:changed']);
			this._websiteAvailabilityListeners = [];
		}
	}
}

interface TCrispConfig {
	websiteId: string;
	tokenId?: string;
	sessionMerge?: boolean;
	locale?: string;
	lockFullview?: boolean;
	lockMaximized?: boolean;
	cookieDomain?: string;
	cookieExpire?: number;
	safeMode?: boolean;
	onReady?: (crisp: Crisp) => void;
}

interface TUserData {
	email?: string;
	nickname?: string;
	phone?: string;
	avatar?: string;
	company?: {
		name: string;
		url?: string;
		description?: string;
		employment?: {
			title: string;
			role: string;
		};
		geolocation?: {
			country: string;
			city: string;
		};
	};
}

type TMessageListener = (message: TMessageData) => void;
type TUnregisterFunction = () => void;
type TWebsiteAvailabilityListener = (isAvailable: boolean) => void;
type TChatEventListener = () => void;

declare global {
	var $crisp: TCrispSdk;
	var CRISP_WEBSITE_ID: string;
	var CRISP_TOKEN_ID: string;
	var CRISP_RUNTIME_CONFIG: {
		session_merge?: boolean;
		locale?: string;
		lock_full_view?: boolean;
		lock_maximized?: boolean;
		[key: string]: unknown;
	};
	var CRISP_COOKIE_DOMAIN: string;
	var CRISP_COOKIE_EXPIRE: number;
}

// https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/dollar-crisp/
interface TCrispSdk {
	push(action: TCrispAction): void;
	is(method: TCheckMethod): boolean;
	get(method: 'chat:unread:count'): number;
	get(method: 'message:text'): string | null;
	get(method: 'session:identifier'): string | null;
	get(method: 'user:email'): string | null;
	get(method: 'user:phone'): string | null;
	get(method: 'user:nickname'): string | null;
	get(method: 'user:avatar'): string | null;
	get(method: 'user:company'): string | null;
	get(method: 'session:data', key: string): any;
	get(method: 'session:data', key?: null): Record<string, any>;
	get(method: TGetMethod): any;
	help(): void;
}

type TCrispAction = TSetAction | TDoAction | TOnAction | TOffAction | TConfigAction | TSafeAction;

type TSetAction =
	| ['set', 'message:text', [string]]
	| ['set', 'session:segments', [string[], boolean?]]
	| ['set', 'session:data', [[string, string | boolean | number][]]]
	| ['set', 'session:event', [TSessionEvent[]]]
	| ['set', 'user:email', [string]]
	| ['set', 'user:phone', [string]]
	| ['set', 'user:nickname', [string]]
	| ['set', 'user:avatar', [string]]
	| ['set', 'user:company', [string, TUserCompanyData?]];

type TDoAction =
	| ['do', 'chat:open', [boolean?]]
	| ['do', 'chat:close']
	| ['do', 'chat:toggle']
	| ['do', 'chat:show']
	| ['do', 'chat:hide']
	| ['do', 'helpdesk:search']
	| ['do', 'helpdesk:article:open', [string, string, string?, string?]]
	| ['do', 'helpdesk:query', [string]]
	| ['do', 'overlay:open', [boolean?]]
	| ['do', 'overlay:close']
	| ['do', 'message:send', ['text', string]]
	| ['do', 'message:send', ['file', TFileContent]]
	| ['do', 'message:send', ['animation', TAnimationContent]]
	| ['do', 'message:send', ['audio', TAudioContent]]
	| ['do', 'message:show', ['text', string]]
	| ['do', 'message:show', ['animation', TAnimationContent]]
	| ['do', 'message:show', ['picker', TPickerContent]]
	| ['do', 'message:show', ['field', TFieldContent]]
	| ['do', 'message:show', ['carousel', TCarouselContent]]
	| ['do', 'message:read']
	| ['do', 'message:thread:start', [string]]
	| ['do', 'message:thread:end', [string?]]
	| ['do', 'session:reset', [boolean?]]
	| ['do', 'trigger:run', [string]];

type TOnAction =
	| ['on', 'session:loaded', (sessionId: string) => void]
	| ['on', 'chat:initiated', () => void]
	| ['on', 'chat:opened', () => void]
	| ['on', 'chat:closed', () => void]
	| ['on', 'message:sent', (message: TMessageData) => void]
	| ['on', 'message:received', (message: TMessageData) => void]
	| ['on', 'message:compose:sent', (compose: TComposeData) => void]
	| ['on', 'message:compose:received', (compose: TComposeData) => void]
	| ['on', 'user:email:changed', (email: string) => void]
	| ['on', 'user:phone:changed', (phone: string) => void]
	| ['on', 'user:nickname:changed', (nickname: string) => void]
	| ['on', 'user:avatar:changed', (avatar: string) => void]
	| ['on', 'website:availability:changed', (isAvailable: boolean) => void]
	| ['on', 'helpdesk:queried', (searchResults: any) => void];

type TOffAction =
	| ['off', 'session:loaded']
	| ['off', 'chat:initiated']
	| ['off', 'chat:opened']
	| ['off', 'chat:closed']
	| ['off', 'message:sent']
	| ['off', 'message:received']
	| ['off', 'message:compose:sent']
	| ['off', 'message:compose:received']
	| ['off', 'user:email:changed']
	| ['off', 'user:phone:changed']
	| ['off', 'user:nickname:changed']
	| ['off', 'user:avatar:changed']
	| ['off', 'website:availability:changed']
	| ['off', 'helpdesk:queried'];

type TConfigAction =
	| ['config', 'availability:tooltip', [boolean]]
	| ['config', 'hide:vacation', [boolean]]
	| ['config', 'hide:on:away', [boolean]]
	| ['config', 'hide:on:mobile', [boolean]]
	| ['config', 'show:operator:count', [boolean]]
	| ['config', 'position:reverse', [boolean]]
	| ['config', 'sound:mute', [boolean]]
	| ['config', 'color:theme', [TCrispColor]]
	| ['config', 'color:mode', [TColorMode]]
	| ['config', 'container:index', [number]];

type TSafeAction = ['safe', boolean];

type TCheckMethod =
	| 'chat:opened'
	| 'chat:closed'
	| 'chat:visible'
	| 'chat:hidden'
	| 'chat:small'
	| 'chat:large'
	| 'session:ongoing'
	| 'website:available'
	| 'overlay:opened'
	| 'overlay:closed';

type TGetMethod =
	| 'chat:unread:count'
	| 'message:text'
	| 'session:identifier'
	| 'user:email'
	| 'user:phone'
	| 'user:nickname'
	| 'user:avatar'
	| 'user:company';

interface TMessageData {
	content: string;
	fingerprint: number;
	from: string;
	inbox_id: string | null;
	is_me: boolean;
	origin: string;
	read: boolean;
	timestamp: number;
	type: TMessageType;
	user: {
		nickname: string;
		user_id: string;
	};
}

interface TUserCompanyData {
	url?: string;
	description?: string;
	employment?: [string, string]; // [title, role]
	geolocation?: [string, string]; // [country, city]
}

interface TSessionEvent {
	text: string;
	data?: any;
	color?: TEventColor;
}

interface TFileContent {
	name: string;
	url: string;
	type: string;
}

interface TAnimationContent {
	url: string;
	type: string;
}

interface TAudioContent {
	duration: number;
	url: string;
	type: string;
}

interface TPickerContent {
	id: string;
	text: string;
	choices: TPickerChoice[];
}

interface TPickerChoice {
	value: string;
	icon?: string;
	label: string;
	selected: boolean;
}

interface TFieldContent {
	id: string;
	text: string;
	explain?: string;
}

interface TCarouselContent {
	text: string;
	targets: TCarouselTarget[];
}

interface TCarouselTarget {
	title: string;
	description: string;
	actions: TCarouselAction[];
}

interface TCarouselAction {
	label: string;
	url: string;
}

type TComposeData = any;

type TCrispColor =
	| 'default'
	| 'amber'
	| 'black'
	| 'blue'
	| 'blue_grey'
	| 'light_blue'
	| 'brown'
	| 'cyan'
	| 'green'
	| 'light_green'
	| 'grey'
	| 'indigo'
	| 'orange'
	| 'deep_orange'
	| 'pink'
	| 'purple'
	| 'deep_purple'
	| 'red'
	| 'teal';

type TColorMode = 'light' | 'dark';

type TEventColor =
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'purple'
	| 'pink'
	| 'brown'
	| 'grey'
	| 'black';

type TMessageType = 'text' | 'file' | 'animation' | 'audio' | 'picker' | 'field' | 'carousel';
