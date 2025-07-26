import { Button, Card, FormLayout, Page as PolarisPage, Text, TextField } from '@shopify/polaris';
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
