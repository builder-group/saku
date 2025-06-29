export const settingsMetadataMap = {
	appearance: {
		type: 'appearance',
		label: 'Appearance'
	} satisfies TSettingsMetadata
};

export const settingsMetadata = Object.values(settingsMetadataMap);

export type TSettingsSectionType = keyof typeof settingsMetadataMap;

export interface TSettingsMetadata {
	type: string;
	label: string;
}
