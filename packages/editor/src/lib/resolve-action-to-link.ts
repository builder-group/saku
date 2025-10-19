import { TAction } from '../types';

export function resolveActionToLink(action: TAction): { href?: string; target?: string } {
	switch (action.type) {
		case 'link': {
			return {
				href: action.url,
				target: action.target
			};
		}
		case 'email': {
			if (action.url != null) {
				return { href: action.url };
			}

			const params = new URLSearchParams();
			if (action.subject != null) {
				params.set('subject', action.subject);
			}
			if (action.body != null) {
				params.set('body', action.body);
			}

			return {
				href: `mailto:${action.email}${params.toString().length > 0 ? `?${params.toString()}` : ''}`
			};
		}
		case 'phone': {
			if (action.url != null) {
				return { href: action.url };
			}
			return { href: `tel:${action.phone}` };
		}
		case 'social': {
			if (action.url != null) {
				return { href: action.url, target: '_blank' };
			}
			return { href: `https://${action.provider}.com/${action.handle}`, target: '_blank' };
		}
	}
}
