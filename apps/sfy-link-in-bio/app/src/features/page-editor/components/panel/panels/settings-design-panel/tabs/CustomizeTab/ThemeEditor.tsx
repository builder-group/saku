import { fontMetadata, TTheme } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { createState } from 'feature-state';
import React from 'react';
import { AccordionSection } from '@/components';
import { useMapState, useMemoCleanup } from '@/hooks';
import { TPageEditor } from '../../../../../../lib';
import { TokenPaintInput, TokenSelectInput, TokenTextInput } from '../../../../../input';
import { applyTheme } from '../../apply-theme';

export const ThemeEditor: React.FC<TThemeEditorProps> = (props) => {
	const { theme, editor } = props;

	const themeState = useMemoCleanup(() => {
		const state = createState(theme);
		const unsubscribe = state.listen(({ value }) => {
			applyTheme(value, editor);
		});
		return [state, () => unsubscribe()];
	}, [theme, editor]);
	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	// Color states
	const primaryPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.primary,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, primary: value }
			}));
		}
	});
	const primaryContentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.primaryContent,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, primaryContent: value }
			}));
		}
	});
	const secondaryPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.secondary,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, secondary: value }
			}));
		}
	});
	const secondaryContentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.secondaryContent,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, secondaryContent: value }
			}));
		}
	});
	const accentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.accent,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, accent: value }
			}));
		}
	});
	const accentContentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.accentContent,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, accentContent: value }
			}));
		}
	});
	const neutralPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.neutral,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, neutral: value }
			}));
		}
	});
	const neutralContentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.neutralContent,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, neutralContent: value }
			}));
		}
	});
	const base100PaintState = useMapState(themeState, {
		map: (theme) => theme.paint.base100,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, base100: value }
			}));
		}
	});
	const base100ContentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.base100Content,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, base100Content: value }
			}));
		}
	});
	const base200PaintState = useMapState(themeState, {
		map: (theme) => theme.paint.base200,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, base200: value }
			}));
		}
	});
	const base200ContentPaintState = useMapState(themeState, {
		map: (theme) => theme.paint.base200Content,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				paint: { ...theme.paint, base200Content: value }
			}));
		}
	});

	// Typography states
	const headingFontState = useMapState(themeState, {
		map: (theme) => theme.typography.heading.fontFamily,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				typography: {
					...theme.typography,
					heading: { ...theme.typography.heading, fontFamily: value }
				}
			}));
		}
	});
	const textFontState = useMapState(themeState, {
		map: (theme) => theme.typography.text.fontFamily,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				typography: {
					...theme.typography,
					text: { ...theme.typography.text, fontFamily: value }
				}
			}));
		}
	});

	// Spacing & Sizing states
	const gapState = useMapState(themeState, {
		map: (theme) => theme.gap,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				gap: value
			}));
		}
	});
	const textSizeState = useMapState(themeState, {
		map: (theme) => theme.size?.text ?? 1,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				size: { ...theme.size, text: value }
			}));
		}
	});
	const boxSizeState = useMapState(themeState, {
		map: (theme) => theme.size?.box ?? 1,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				size: { ...theme.size, box: value }
			}));
		}
	});
	const boxRadiusState = useMapState(themeState, {
		map: (theme) => theme.radius.box,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				radius: { ...theme.radius, box: value }
			}));
		}
	});

	// Effects states
	const shadowBlurState = useMapState(themeState, {
		map: (theme) => theme.effects?.shadow?.blur ?? 0,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				effects: {
					...theme.effects,
					shadow: {
						...theme.effects?.shadow,
						blur: value,
						offsetX: theme.effects?.shadow?.offsetX ?? 0,
						offsetY: theme.effects?.shadow?.offsetY ?? 0,
						spread: theme.effects?.shadow?.spread ?? 0
					}
				}
			}));
		}
	});
	const shadowOffsetXState = useMapState(themeState, {
		map: (theme) => theme.effects?.shadow?.offsetX ?? 0,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				effects: {
					...theme.effects,
					shadow: {
						...theme.effects?.shadow,
						blur: theme.effects?.shadow?.blur ?? 0,
						offsetX: value,
						offsetY: theme.effects?.shadow?.offsetY ?? 0,
						spread: theme.effects?.shadow?.spread ?? 0
					}
				}
			}));
		}
	});
	const shadowOffsetYState = useMapState(themeState, {
		map: (theme) => theme.effects?.shadow?.offsetY ?? 0,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				effects: {
					...theme.effects,
					shadow: {
						...theme.effects?.shadow,
						blur: theme.effects?.shadow?.blur ?? 0,
						offsetX: theme.effects?.shadow?.offsetX ?? 0,
						offsetY: value,
						spread: theme.effects?.shadow?.spread ?? 0
					}
				}
			}));
		}
	});
	const shadowSpreadState = useMapState(themeState, {
		map: (theme) => theme.effects?.shadow?.spread ?? 0,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				effects: {
					...theme.effects,
					shadow: {
						...theme.effects?.shadow,
						blur: theme.effects?.shadow?.blur ?? 0,
						offsetX: theme.effects?.shadow?.offsetX ?? 0,
						offsetY: theme.effects?.shadow?.offsetY ?? 0,
						spread: value
					}
				}
			}));
		}
	});
	const strokeWidthState = useMapState(themeState, {
		map: (theme) => theme.effects?.stroke?.width ?? 0,
		sync: (baseState, value) => {
			baseState.set((theme) => ({
				...theme,
				effects: {
					...theme.effects,
					stroke: {
						...theme.effects?.stroke,
						width: value
					}
				}
			}));
		}
	});

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AccordionSection
				title="Colors"
				defaultOpen={true}
				collapsibleClassName="grid grid-cols-2 gap-3"
			>
				<TokenPaintInput
					label="Primary"
					state={primaryPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Primary Content"
					state={primaryContentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Secondary"
					state={secondaryPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Secondary Content"
					state={secondaryContentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Accent"
					state={accentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Accent Content"
					state={accentContentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Neutral"
					state={neutralPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Neutral Content"
					state={neutralContentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Surface"
					state={base100PaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Surface Content"
					state={base100ContentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid', 'image']}
				/>
				<TokenPaintInput
					label="Background"
					state={base200PaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid']}
				/>
				<TokenPaintInput
					label="Background Content"
					state={base200ContentPaintState}
					disabledTokenLink={true}
					editor={editor}
					allowedPaintTypes={['solid', 'image']}
				/>
			</AccordionSection>

			<AccordionSection
				title="Typography"
				defaultOpen={true}
				collapsibleClassName="grid grid-cols-2 gap-3"
			>
				<TokenSelectInput
					label="Heading Font"
					options={fontOptions}
					state={headingFontState}
					disabledTokenLink={true}
				/>
				<TokenSelectInput
					label="Text Font"
					options={fontOptions}
					state={textFontState}
					disabledTokenLink={true}
				/>
			</AccordionSection>

			<AccordionSection
				title="Spacing & Sizing"
				defaultOpen={true}
				collapsibleClassName="grid grid-cols-2 gap-3"
			>
				<TokenTextInput
					label="Gap"
					type="number"
					autoComplete="off"
					min={0}
					max={999}
					step={4}
					state={gapState}
					disabledTokenLink={true}
				/>
				<TokenTextInput
					label="Text Size"
					type="number"
					autoComplete="off"
					min={0.5}
					max={2}
					step={0.125}
					state={textSizeState}
					disabledTokenLink={true}
				/>
				<TokenTextInput
					label="Box Size"
					type="number"
					autoComplete="off"
					min={0.5}
					max={4}
					step={0.25}
					state={boxSizeState}
					disabledTokenLink={true}
				/>
				<TokenTextInput
					label="Box Radius"
					type="number"
					autoComplete="off"
					min={0}
					max={999}
					step={4}
					state={boxRadiusState}
					disabledTokenLink={true}
				/>
			</AccordionSection>

			<AccordionSection
				title="Effects"
				defaultOpen={true}
				collapsibleClassName="px-0 space-y-3 pt-0"
			>
				<div className="border-b border-neutral-200 bg-neutral-50 px-4 py-1">
					<Text as="span" variant="headingXs">
						Shadow
					</Text>
				</div>
				<div className="grid grid-cols-2 gap-3 px-4">
					<TokenTextInput
						label="Blur"
						type="number"
						autoComplete="off"
						min={0}
						max={96}
						step={4}
						state={shadowBlurState}
						disabledTokenLink={true}
					/>
					<TokenTextInput
						label="Spread"
						type="number"
						autoComplete="off"
						min={-48}
						max={48}
						step={4}
						state={shadowSpreadState}
						disabledTokenLink={true}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3 px-4">
					<TokenTextInput
						label="Offset X"
						type="number"
						autoComplete="off"
						min={-96}
						max={96}
						step={4}
						state={shadowOffsetXState}
						disabledTokenLink={true}
					/>
					<TokenTextInput
						label="Offset Y"
						type="number"
						autoComplete="off"
						min={-96}
						max={96}
						step={4}
						state={shadowOffsetYState}
						disabledTokenLink={true}
					/>
				</div>
				<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
					<Text as="span" variant="headingXs">
						Stroke
					</Text>
				</div>
				<div className="grid grid-cols-1 gap-3 px-4">
					<TokenTextInput
						label="Width"
						type="number"
						autoComplete="off"
						min={0}
						max={20}
						step={1}
						state={strokeWidthState}
						disabledTokenLink={true}
					/>
				</div>
			</AccordionSection>
		</>
	);
};

interface TThemeEditorProps {
	theme: TTheme;
	editor: TPageEditor;
}
