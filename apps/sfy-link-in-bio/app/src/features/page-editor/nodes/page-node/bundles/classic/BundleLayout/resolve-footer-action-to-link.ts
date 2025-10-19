import { resolveActionToLink, TFooterAction } from '@repo/editor';
import { appConfig } from '@/environment';

export function resolveFooterActionToLink(action: TFooterAction): {
	href?: string;
	target?: string;
} {
	switch (action.type) {
		case 'footer-report': {
			return { href: `mailto:${appConfig.help.email}?subject=Report Violation` };
		}
		case 'footer-privacy': {
			return { href: appConfig.help.legal.privacy };
		}
		default:
			return resolveActionToLink(action);
	}
}
