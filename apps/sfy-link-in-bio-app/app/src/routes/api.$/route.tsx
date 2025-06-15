import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { app } from './app.server';

export const loader: LoaderFunction = async ({ request }) => {
	return app.request(request);
};

export const action: ActionFunction = async ({ request }) => {
	return app.request(request);
};
