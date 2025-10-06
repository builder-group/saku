export const settingsMetadataMap = {
	general: {
		type: 'general',
		label: 'General'
	} satisfies TSettingsMetadata,
	design: {
		type: 'design',
		label: 'Design'
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
