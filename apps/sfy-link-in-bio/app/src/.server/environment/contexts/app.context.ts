import { type coreApiV1 } from '@repo/types/api';
import { createContext } from 'react-router';
import { shopify } from '..';

export const AppContext = createContext<TAppContext>();

export interface TAppContext {
	workspace: coreApiV1.components['schemas']['WorkspaceDto'];
	shopify: { sessionToken: string; admin: Awaited<ReturnType<typeof shopify.authenticate.admin>> };
}
