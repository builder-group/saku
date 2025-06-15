import { type components } from './types/github-api-v1-1-4.gen';

export * as githubApiV1 from './types/github-api-v1-1-4.gen';

export type TGithubUser =
	| components['schemas']['private-user']
	| components['schemas']['public-user'];
