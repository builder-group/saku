import { hexToRgba } from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { styleTemplates, type TStyleTemplate } from '../../../../../environment';
import { createTokensFromStyleTemplate, TPageEditor } from '../../../../../lib';

export const TemplateTab: React.FC<TTemplateTabProps> = (props) => {
	const { editor } = props;

	const applyTemplate = React.useCallback(
		(styleTemplate: TStyleTemplate) => {
			// Apply tokens for elements (cards, text, buttons)
			const tokens = createTokensFromStyleTemplate(styleTemplate);
			tokens.forEach((token) => {
				if (token.type === 'mixin') {
					editor.mixinTokenMap[token.mixinKey]?.set((currentTokens: any) => ({
						...currentTokens,
						[token.key]: token
					}));
				}
			});

			// Apply page background directly to the root node
			const rootNode = editor.getRootNode();
			rootNode.set((node) => ({
				...node,
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(styleTemplate.colors.background)
					},
					opacity: 1
				}
			}));
		},
		[editor]
	);

	const renderTemplatePreview = React.useCallback((template: TStyleTemplate) => {
		const { colors, typography, spacing } = template;

		return (
			<div
				className="flex items-center justify-center rounded-lg border p-3"
				style={{
					backgroundColor: colors.background,
					borderColor: 'rgba(0,0,0,0.1)',
					minHeight: '80px'
				}}
			>
				{/* Card preview */}
				<div
					className="flex flex-wrap items-center justify-center gap-2 rounded p-2"
					style={{
						backgroundColor: colors.surface,
						borderRadius: `${spacing.borderRadius}px`,
						border: `1px solid ${colors.secondary}`,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}
				>
					{/* Typography preview */}
					<h2
						style={{
							color: colors.text,
							fontFamily: typography.fontFamily,
							fontSize: '20px',
							fontWeight: typography.fontWeight,
							lineHeight: 1,
							margin: 0
						}}
					>
						Aa
					</h2>

					{/* Button preview */}
					<div
						className="rounded px-3 py-1 text-sm font-medium"
						style={{
							backgroundColor: colors.primary,
							color: colors.surface,
							fontFamily: typography.fontFamily,
							fontWeight: typography.fontWeight,
							borderRadius: `${spacing.borderRadius}px`
						}}
					>
						Button
					</div>
				</div>
			</div>
		);
	}, []);

	return (
		<div className="grid grid-cols-2 gap-3 p-4">
			{styleTemplates.map((template) => (
				<div
					key={template.key}
					className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 hover:shadow-sm"
					onClick={() => applyTemplate(template)}
				>
					{/* Header with colors, name, and apply badge */}
					<div className="mb-3 flex items-center gap-2">
						{/* Color palette grid */}
						<div
							className="grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
							style={{ backgroundColor: template.colors.background }}
						>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.primary }}
								title="Primary"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.secondary }}
								title="Secondary"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.surface }}
								title="Surface"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.primary }}
								title="Accent"
							/>
						</div>

						<Text as="p" variant="bodySm" fontWeight="medium">
							{template.name}
						</Text>
					</div>

					{/* Preview */}
					{renderTemplatePreview(template)}
				</div>
			))}
		</div>
	);
};

interface TTemplateTabProps {
	editor: TPageEditor;
}
