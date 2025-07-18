import { TFont } from '../types';

export const fontMetadataMap = {
	inter: {
		name: 'Inter',
		font: { family: 'Inter', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Inter:wght@400;500;600;700'
	} satisfies TFontMetadata,
	roboto: {
		name: 'Roboto',
		font: { family: 'Roboto', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Roboto:wght@400;500;700'
	} satisfies TFontMetadata,
	openSans: {
		name: 'Open Sans',
		font: { family: 'Open Sans', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Open+Sans:wght@400;600;700'
	} satisfies TFontMetadata,
	lato: {
		name: 'Lato',
		font: { family: 'Lato', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Lato:wght@400;700'
	} satisfies TFontMetadata,
	montserrat: {
		name: 'Montserrat',
		font: { family: 'Montserrat', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Montserrat:wght@400;600;700'
	} satisfies TFontMetadata,
	poppins: {
		name: 'Poppins',
		font: { family: 'Poppins', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Poppins:wght@400;500;600;700'
	} satisfies TFontMetadata,
	playfairDisplay: {
		name: 'Playfair Display',
		font: { family: 'Playfair Display', weight: 400, style: 'normal' },
		category: 'serif',
		googleFont: 'Playfair+Display:wght@400;700'
	} satisfies TFontMetadata,
	merriweather: {
		name: 'Merriweather',
		font: { family: 'Merriweather', weight: 400, style: 'normal' },
		category: 'serif',
		googleFont: 'Merriweather:wght@400;700'
	} satisfies TFontMetadata,
	b612: {
		name: 'B612',
		font: { family: 'B612', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'B612:wght@400;700'
	} satisfies TFontMetadata,
	biorhyme: {
		name: 'BioRhyme',
		font: { family: 'BioRhyme', weight: 400, style: 'normal' },
		category: 'serif',
		googleFont: 'BioRhyme:wght@400;700'
	} satisfies TFontMetadata,
	cairo: {
		name: 'Cairo',
		font: { family: 'Cairo', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Cairo:wght@400;600;700'
	} satisfies TFontMetadata,
	karla: {
		name: 'Karla',
		font: { family: 'Karla', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Karla:wght@400;700'
	} satisfies TFontMetadata,
	lora: {
		name: 'Lora',
		font: { family: 'Lora', weight: 400, style: 'normal' },
		category: 'serif',
		googleFont: 'Lora:wght@400;700'
	} satisfies TFontMetadata,
	mulish: {
		name: 'Mulish',
		font: { family: 'Mulish', weight: 400, style: 'normal' },
		category: 'sans-serif',
		googleFont: 'Mulish:wght@400;600;700'
	} satisfies TFontMetadata,
	vollkorn: {
		name: 'Vollkorn',
		font: { family: 'Vollkorn', weight: 400, style: 'normal' },
		category: 'serif',
		googleFont: 'Vollkorn:wght@400;700'
	} satisfies TFontMetadata,
	system: {
		name: 'System Default',
		font: { family: 'system-ui', weight: 400, style: 'normal' },
		category: 'system',
		googleFont: null
	} satisfies TFontMetadata
};

export const fontMetadata = Object.values(fontMetadataMap);

export function getFontMetadataByFamily(
	family: string
): (typeof fontMetadataMap)[keyof typeof fontMetadataMap] | null {
	return Object.values(fontMetadataMap).find((metadata) => metadata.font.family === family) ?? null;
}

export type TFontType = keyof typeof fontMetadataMap;

export interface TFontMetadata {
	name: string;
	font: TFont;
	category: 'sans-serif' | 'serif' | 'system';
	googleFont: string | null;
}
