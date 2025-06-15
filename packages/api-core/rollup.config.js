const { libraryPreset, getPkgJson } = require('rollup-presets');
const replace = require('@rollup/plugin-replace');

/**
 * @type {import('rollup').RollupOptions[]}
 */
module.exports = async () => {
	const pkgJson = await getPkgJson();

	return libraryPreset(
		/**
		 * @type {import('rollup-presets').TLibraryPresetOptions}
		 */
		{
			plugins: {
				last: [
					replace({
						values: {
							'process.env.npm_package_version': JSON.stringify(pkgJson.version)
						}
					})
				]
			}
		}
	);
};
