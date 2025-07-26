import { Form, useActionData, useLoaderData } from 'react-router';
import {
	Button,
	Card,
	FormLayout,
	AppProvider as PolarisAppProvider,
	Page as PolarisPage,
	Text,
	TextField
} from '@shopify/polaris';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import polarisTranslations from '@shopify/polaris/locales/en.json';
import React from 'react';
import { shopify } from '@/environment/.server';
import { TActionFunction, TLoaderFunction } from '@/types';
import { loginErrorMessage, TLoginErrorMessage } from './error.server';

const Page: React.FC = () => {
	const loaderData = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const [shop, setShop] = React.useState('');
	const { errors } = actionData ?? loaderData;

	return (
		<PolarisAppProvider i18n={loaderData.polarisTranslations}>
			<PolarisPage>
				<Card>
					<Form method="post">
						<FormLayout>
							<Text variant="headingMd" as="h2">
								Log in
							</Text>
							<TextField
								type="text"
								name="shop"
								label="Shop domain"
								helpText="example.myshopify.com"
								value={shop}
								onChange={setShop}
								autoComplete="on"
								error={errors.shop}
							/>
							<Button submit>Log in</Button>
						</FormLayout>
					</Form>
				</Card>
			</PolarisPage>
		</PolarisAppProvider>
	);
};

export default Page;

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const loader: TLoaderFunction<{
	errors: TLoginErrorMessage;
	polarisTranslations: typeof polarisTranslations;
}> = async ({ request }) => {
	const loginResult = await shopify.login(request);

	return { errors: loginErrorMessage(loginResult), polarisTranslations };
};

export const action: TActionFunction<{ errors: TLoginErrorMessage }> = async ({ request }) => {
	const loginResult = await shopify.login(request);

	return { errors: loginErrorMessage(loginResult), polarisTranslations };
};
