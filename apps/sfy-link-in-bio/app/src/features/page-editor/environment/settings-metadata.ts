import { bitwiseFlag, BitwiseFlag } from '@blgc/utils';

export enum ESettingsCondition {
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member -- ok here
	Debug = 1 << 0 // 1
}

export const settingsMetadataMap = {
	general: {
		type: 'general',
		label: 'General',
		condition: bitwiseFlag()
	} satisfies TSettingsMetadata,
	design: {
		type: 'design',
		label: 'Design',
		condition: bitwiseFlag()
	} satisfies TSettingsMetadata,
	metadata: {
		type: 'metadata',
		label: 'Metadata',
		condition: bitwiseFlag()
	} satisfies TSettingsMetadata,
	assets: {
		type: 'assets',
		label: 'Assets',
		condition: bitwiseFlag()
	} satisfies TSettingsMetadata,
	integrations: {
		type: 'integrations',
		label: 'Integrations',
		condition: bitwiseFlag()
	} satisfies TSettingsMetadata,
	advanced: {
		type: 'advanced',
		label: 'Advanced',
		condition: bitwiseFlag()
	} satisfies TSettingsMetadata
};

export const settingsMetadata = Object.values(settingsMetadataMap);

export type TSettingsSectionType = keyof typeof settingsMetadataMap;

export interface TSettingsMetadata {
	type: string;
	label: string;
	condition: BitwiseFlag<ESettingsCondition>;
}
