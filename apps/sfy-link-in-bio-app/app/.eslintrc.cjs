/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	root: true,
	extends: [require.resolve('@blgc/config/eslint/remix')],
	globals: {
		shopify: 'readonly'
	}
};

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("eslint").Linter.Config}
 */
module.exports = [
	...require('@blgc/config/eslint/remix'),
	{
		globals: {
			shopify: 'readonly'
		}
	}
];
