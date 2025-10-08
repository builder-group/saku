export const externalSiteProviderMap = {
	linkpop: {
		name: 'LinkPop',
		url: 'https://linkpop.com'
	},
	saku: {
		name: 'Saku',
		url: 'https://saku.so'
	}
} as const;

export type TExternalSiteProvider = keyof typeof externalSiteProviderMap;
