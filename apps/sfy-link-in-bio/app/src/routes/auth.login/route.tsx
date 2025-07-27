import { AppProvider } from '@shopify/shopify-app-react-router/react';
import React from 'react';
import { Form, useActionData, useLoaderData } from 'react-router';
import { shopify } from '@/environment/.server';
import { TActionFunction, TLoaderFunction } from '@/types';
import { loginErrorMessage, TLoginErrorMessage } from './error.server';

const Page: React.FC = () => {
	const loaderData = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const [shop, setShop] = React.useState('');
	const { errors } = actionData ?? loaderData;

	return (
		<AppProvider embedded={false}>
			<s-page>
				<Form method="post">
					<s-section heading="Log in">
						<s-text-field
							name="shop"
							label="Shop domain"
							details="example.myshopify.com"
							value={shop}
							onChange={(e) => setShop(e.currentTarget.value)}
							autocomplete="on"
							error={errors.shop}
						></s-text-field>
						<s-button type="submit">Log in</s-button>
					</s-section>
				</Form>
			</s-page>
		</AppProvider>
	);
};

export default Page;

export const loader: TLoaderFunction<{
	errors: TLoginErrorMessage;
}> = async ({ request }) => {
	const loginResult = await shopify.login(request);

	return { errors: loginErrorMessage(loginResult) };
};

export const action: TActionFunction<{ errors: TLoginErrorMessage }> = async ({ request }) => {
	const loginResult = await shopify.login(request);

	return { errors: loginErrorMessage(loginResult) };
};
