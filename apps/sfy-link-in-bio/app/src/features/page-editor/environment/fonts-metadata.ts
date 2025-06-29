export const fontsMetadataMap = {
	inter: {
		name: 'Inter',
		family: 'Inter, sans-serif',
		category: 'sans-serif',
		googleFont: 'Inter:wght@400;500;600;700'
	} satisfies TFontMetadata,
	roboto: {
		name: 'Roboto',
		family: 'Roboto, sans-serif',
		category: 'sans-serif',
		googleFont: 'Roboto:wght@400;500;700'
	} satisfies TFontMetadata,
	openSans: {
		name: 'Open Sans',
		family: '"Open Sans", sans-serif',
		category: 'sans-serif',
		googleFont: 'Open+Sans:wght@400;600;700'
	} satisfies TFontMetadata,
	lato: {
		name: 'Lato',
		family: 'Lato, sans-serif',
		category: 'sans-serif',
		googleFont: 'Lato:wght@400;700'
	} satisfies TFontMetadata,
	montserrat: {
		name: 'Montserrat',
		family: 'Montserrat, sans-serif',
		category: 'sans-serif',
		googleFont: 'Montserrat:wght@400;600;700'
	} satisfies TFontMetadata,
	poppins: {
		name: 'Poppins',
		family: 'Poppins, sans-serif',
		category: 'sans-serif',
		googleFont: 'Poppins:wght@400;500;600;700'
	} satisfies TFontMetadata,
	playfairDisplay: {
		name: 'Playfair Display',
		family: '"Playfair Display", serif',
		category: 'serif',
		googleFont: 'Playfair+Display:wght@400;700'
	} satisfies TFontMetadata,
	merriweather: {
		name: 'Merriweather',
		family: 'Merriweather, serif',
		category: 'serif',
		googleFont: 'Merriweather:wght@400;700'
	} satisfies TFontMetadata,
	b612: {
		name: 'B612',
		family: 'B612, sans-serif',
		category: 'sans-serif',
		googleFont: 'B612:wght@400;700'
	} satisfies TFontMetadata,
	biorhyme: {
		name: 'BioRhyme',
		family: 'BioRhyme, serif',
		category: 'serif',
		googleFont: 'BioRhyme:wght@400;700'
	} satisfies TFontMetadata,
	cairo: {
		name: 'Cairo',
		family: 'Cairo, sans-serif',
		category: 'sans-serif',
		googleFont: 'Cairo:wght@400;600;700'
	} satisfies TFontMetadata,
	karla: {
		name: 'Karla',
		family: 'Karla, sans-serif',
		category: 'sans-serif',
		googleFont: 'Karla:wght@400;700'
	} satisfies TFontMetadata,
	lora: {
		name: 'Lora',
		family: 'Lora, serif',
		category: 'serif',
		googleFont: 'Lora:wght@400;700'
	} satisfies TFontMetadata,
	mulish: {
		name: 'Mulish',
		family: 'Mulish, sans-serif',
		category: 'sans-serif',
		googleFont: 'Mulish:wght@400;600;700'
	} satisfies TFontMetadata,
	vollkorn: {
		name: 'Vollkorn',
		family: 'Vollkorn, serif',
		category: 'serif',
		googleFont: 'Vollkorn:wght@400;700'
	} satisfies TFontMetadata,
	system: {
		name: 'System Default',
		family: 'system-ui, -apple-system, sans-serif',
		category: 'system',
		googleFont: null
	} satisfies TFontMetadata
};

export const fontsMetadata = Object.values(fontsMetadataMap);

export const fontFamilyToMetadata = Object.entries(fontsMetadataMap).reduce(
	(acc, [key, metadata]) => {
		acc[metadata.family] = Object.assign(metadata, { key });
		return acc;
	},
	{} as Record<string, TFontMetadata & { key: string }>
);

// Font options for dropdowns
export const fontOptions = Object.values(fontsMetadataMap).map((metadata) => ({
	label: metadata.name,
	value: metadata.family
}));

export type TFontType = keyof typeof fontsMetadataMap;

export interface TFontMetadata {
	name: string;
	family: string;
	category: 'sans-serif' | 'serif' | 'system';
	googleFont: string | null;
}
