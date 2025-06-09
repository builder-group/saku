import reactInternal from '@blgc/config/eslint/react-internal';

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("eslint").Linter.Config}
 */
export default [
	...reactInternal,
	{
		languageOptions: {
			globals: {
				shopify: 'readonly'
			}
		},
		ignores: ['build/**', 'dist/**', '.shopify/**', 'node_modules/**']
	}
];
