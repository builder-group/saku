import { TImageAsset } from '@repo/editor';
import { Text, Thumbnail } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { AccordionSection, ResizablePanel } from '@/components';
import { prettifyFileSize } from '@/lib';
import { resolveAsset, TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { Placeholder } from './Placeholder';

export const SettingsAssetsPanel: React.FC<TSettingsAssetsPanelProps> = (props) => {
	const { editor, order } = props;

	const { fontAssets, imageAssets, hasAssets } = React.useMemo(() => {
		const fontAssets: {
			id: string;
			fontFamily: string;
			contentType: string;
			fileName: string;
			displayFileSize?: string;
			src?: string;
		}[] = [];

		const imageAssets: {
			id: string;
			fileName: string;
			contentType: string;
			dimensions: TImageAsset['dimensions'];
			altText: string;
			displayFileSize?: string;
			src?: string;
		}[] = [];

		for (const asset of Object.values(editor.assetsMap)) {
			const resolvedAsset =
				resolveAsset(asset.hash, {
					getAsset: (hash) => editor.assetsMap[hash] ?? null
				}) ?? undefined;

			const fileName = asset.fileName ?? 'Untitled';
			const displayFileSize = asset.size != null ? prettifyFileSize(asset.size) : undefined;

			switch (asset.type) {
				case 'font': {
					fontAssets.push({
						id: asset.id,
						fontFamily: asset.font.family,
						contentType: asset.contentType,
						fileName,
						displayFileSize,
						src: resolvedAsset?.src
					});
					break;
				}
				case 'image': {
					imageAssets.push({
						id: asset.id,
						fileName,
						contentType: asset.contentType,
						dimensions: asset.dimensions,
						altText: asset.altText ?? fileName ?? 'Image',
						displayFileSize,
						src: resolvedAsset?.src
					});
					break;
				}
				default:
				// do nothing
			}
		}

		return { fontAssets, imageAssets, hasAssets: fontAssets.length > 0 || imageAssets.length > 0 };
	}, [editor.assetsMap]);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			const width = rect.right - rect.left;
			if (width <= 0) {
				// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
				return {
					minSize: 20,
					defaultSize: 27,
					maxSize: 35
				};
			}

			const toPercent = (pixels: number) => (pixels / width) * 100;

			return {
				minSize: toPercent(300), // ~ 20
				defaultSize: toPercent(405), // ~ 27
				maxSize: toPercent(525) // ~ 35
			};
		},
		[],
		{
			isEqual(a, b) {
				return (
					a.minSize === b.minSize && a.defaultSize === b.defaultSize && a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-assets-panel"
			order={order}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						Assets
					</Text>
				</PanelHeader>
				<div className="flex-1 overflow-auto">
					{!hasAssets && <Placeholder />}

					{/* Font Assets */}
					{fontAssets.length > 0 && (
						<AccordionSection
							title={`Fonts (${fontAssets.length})`}
							defaultOpen={true}
							collapsibleClassName="px-0 space-y-3"
						>
							{fontAssets.map((asset, index) => (
								<React.Fragment key={asset.id}>
									<div className="flex items-center gap-2 px-2">
										<div
											className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50"
											style={{ fontFamily: asset.fontFamily }}
										>
											<Text as="span" variant="bodyMd" tone="subdued">
												T
											</Text>
										</div>
										<div className="flex min-w-0 flex-1 flex-col">
											<Text as="span" variant="bodyMd" fontWeight="medium" truncate>
												{asset.fontFamily}
											</Text>
											<Text as="span" variant="bodySm" tone="subdued" truncate>
												{asset.contentType} • {asset.fileName}
											</Text>
										</div>
										<div className="ml-4">
											<s-badge tone="info">Font</s-badge>
										</div>
									</div>
									{index < fontAssets.length - 1 && <div className="h-px bg-neutral-200" />}
								</React.Fragment>
							))}
						</AccordionSection>
					)}

					{/* Image Assets */}
					{imageAssets.length > 0 && (
						<AccordionSection
							title={`Images (${imageAssets.length})`}
							defaultOpen={true}
							collapsibleClassName="px-0 space-y-3"
						>
							{imageAssets.map((asset, index) => (
								<React.Fragment key={asset.id}>
									<div className="flex items-center gap-2 px-2">
										<Thumbnail source={asset.src ?? ''} alt={asset.altText} size="small" />
										<div className="flex min-w-0 flex-1 flex-col">
											<Text as="span" variant="bodyMd" fontWeight="medium" truncate>
												{asset.fileName}
											</Text>
											<Text as="span" variant="bodySm" tone="subdued" truncate>
												{asset.contentType}
												{asset.dimensions != null &&
													` • ${asset.dimensions.width}×${asset.dimensions.height}`}
											</Text>
										</div>
										<div className="ml-4">
											<s-badge tone="success">Image</s-badge>
										</div>
									</div>
									{index < imageAssets.length - 1 && <div className="h-px bg-neutral-200" />}
								</React.Fragment>
							))}
						</AccordionSection>
					)}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsAssetsPanelProps {
	editor: TPageEditor;
	order: number;
}
