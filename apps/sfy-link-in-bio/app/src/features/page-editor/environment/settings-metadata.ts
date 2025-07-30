export const settingsMetadataMap = {
	appearance: {
		type: 'appearance',
		label: 'Appearance'
	} satisfies TSettingsMetadata,
	metadata: {
		type: 'metadata',
		label: 'Metadata'
	} satisfies TSettingsMetadata,
	assets: {
		type: 'assets',
		label: 'Assets'
	} satisfies TSettingsMetadata,
	integrations: {
		type: 'integrations',
		label: 'Integrations'
	} satisfies TSettingsMetadata
};

export const settingsMetadata = Object.values(settingsMetadataMap);

export type TSettingsSectionType = keyof typeof settingsMetadataMap;

export interface TSettingsMetadata {
	type: string;
	label: string;
}
