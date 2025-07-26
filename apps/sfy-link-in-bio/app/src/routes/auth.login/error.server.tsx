import { LoginErrorType, type LoginError } from '@shopify/shopify-app-react-router/server';

export function loginErrorMessage(loginErrors: LoginError): TLoginErrorMessage {
	if (loginErrors?.shop === LoginErrorType.MissingShop) {
		return { shop: 'Please enter your shop domain to log in' };
	}

	if (loginErrors?.shop === LoginErrorType.InvalidShop) {
		return { shop: 'Please enter a valid shop domain to log in' };
	}

	return {};
}

export interface TLoginErrorMessage {
	shop?: string;
}
