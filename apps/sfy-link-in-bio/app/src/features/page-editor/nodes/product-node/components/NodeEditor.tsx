import { notEmpty } from '@blgc/utils';
import { TProductNode } from '@repo/editor';
import { Button, IndexTable, Scrollable, Text, useIndexResourceState } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, DeleteIcon, ProductAddIcon } from '@/components';
import { capitalizeFirstLetter, isProduct, mutateWithReferenceUpdate } from '@/lib';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	FillStyleMixinEditor,
	LayoutStyleMixinEditor,
	TypographyStyleMixinEditor
} from '../../../mixins';

export const ProductNodeEditor: React.FC<TNodeEditorComponentProps<TProductNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const canChangeProduct = React.useMemo(() => content.product != null, [content.product]);
	const productImages = React.useMemo(
		() =>
			content.product?.images
				.map((image) => {
					const asset = editor.getImageAsset(image);
					if (asset == null || asset.storage.type !== 'url') {
						return null;
					}
					return {
						url: asset.storage.url,
						fileName: asset.fileName
					};
				})
				.filter(notEmpty) ?? [],
		[content.product, editor]
	);

	const variantRows = React.useMemo<TProductVariantRow[]>(
		() =>
			content.product?.variants
				.map((variant) => {
					if (content.product == null) {
						return null;
					}

					let image: { url: string; fileName?: string } | undefined;
					if (variant.image != null) {
						const asset = editor.getImageAsset(variant.image);
						if (asset != null && asset.storage.type === 'url') {
							image = { url: asset.storage.url, fileName: asset.fileName };
						}
					}

					return {
						id: variant.id,
						title: content.product.title,
						variantTitle: variant.title,
						price: `${variant.price.amount} ${variant.price.currencyCode}`,
						image
					};
				})
				.filter(notEmpty) ?? [],
		[content.product, editor]
	);

	const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
		useIndexResourceState(variantRows as Record<string, any>[]);

	const resourceName = React.useMemo(() => ({ singular: 'variant', plural: 'variants' }), []);
	const bulkActions = React.useMemo(
		() => [
			{
				icon: DeleteIcon,
				destructive: true,
				content: `Delete ${selectedResources.length > 1 ? `${selectedResources.length} ${resourceName.plural}` : resourceName.singular}`,
				disabled: variantRows.length === 1 || selectedResources.length >= variantRows.length,
				onAction: () => {
					if (nodeState._v.content.product == null) {
						return;
					}

					nodeState._v.content.product = mutateWithReferenceUpdate(
						nodeState._v.content.product,
						(draft) => {
							draft.variants = draft.variants.filter(
								(variant) => !selectedResources.includes(variant.id)
							);
						}
					);
					nodeState._notify();

					clearSelection();
				}
			}
		],
		[clearSelection, nodeState, selectedResources, resourceName, variantRows.length]
	);

	const variantsSubheaderSelected = React.useMemo(() => {
		if (selectedResources.length === variantRows.length && variantRows.length > 0) {
			return true;
		}
		if (selectedResources.length > 0) {
			return 'indeterminate';
		}
		return false;
	}, [selectedResources, variantRows.length]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleSelectProduct = React.useCallback(async () => {
		const results = await editor.shopify.resourcePicker({
			type: 'product',
			filter: {
				hidden: false,
				draft: false,
				archived: false
			}
		});
		const product = results?.[0];
		if (!isProduct(product)) {
			return;
		}

		clearSelection();

		nodeState._v.content.product = {
			id: product.id,
			title: product.title,
			images: product.images
				.map((image) => editor.registerImage(image.originalSrc))
				.filter(notEmpty),
			options: product.options.map((opt) => ({ name: opt.name, values: opt.values })),
			variants: product.variants
				.map((variant) => {
					if (variant.id == null || variant.title == null || variant.price == null) {
						return null;
					}

					return {
						id: variant.id,
						title: variant.title,
						price: {
							amount: variant.price,
							currencyCode: 'USD'
						},
						image:
							variant.image?.originalSrc != null
								? (editor.registerImage(variant.image.originalSrc) ?? undefined)
								: undefined,
						selectedOptions:
							variant.selectedOptions
								?.map((opt, idx) => {
									const name = product.options?.[idx]?.name;
									const value = opt.value;
									if (name == null || value == null) {
										return null;
									}
									return { name, value };
								})
								.filter(notEmpty) ?? []
					};
				})
				.filter(notEmpty)
		};
		nodeState._notify();
	}, [clearSelection, nodeState, editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
				<div className="space-y-4">
					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<Text as="span" variant="bodySm" tone="subdued">
								Product
							</Text>
							{canChangeProduct && (
								<Button variant="plain" size="micro" onClick={handleSelectProduct}>
									Change Product
								</Button>
							)}
						</div>

						{content.product != null ? (
							<div className="rounded-md border border-gray-200 bg-white">
								<Scrollable
									// Note: Using style because "Scrollable" doesn't consider Tailwind classes
									style={{ maxHeight: 256 }}
								>
									<div className="h-full w-full overflow-hidden">
										<IndexTable
											resourceName={resourceName}
											itemCount={variantRows.length}
											selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
											onSelectionChange={handleSelectionChange}
											headings={[{ title: '' }]}
											bulkActions={bulkActions}
										>
											{/* Product subheader at position 0 */}
											<IndexTable.Row
												rowType="subheader"
												id="product-subheader"
												position={0}
												disabled={true}
											>
												<IndexTable.Cell
													colSpan={1}
													scope="colgroup"
													as="th"
													id="product-subheader"
												>
													Product
												</IndexTable.Cell>
											</IndexTable.Row>
											{/* Product row as a disabled IndexTable.Row at position 1 */}
											{content.product && (
												<IndexTable.Row
													id={content.product.id}
													key={content.product.id}
													selected={false}
													position={1}
													disabled={true}
												>
													<IndexTable.Cell className="flex w-full flex-row items-center gap-3 p-2">
														{productImages[0] != null ? (
															<img
																src={productImages[0].url}
																alt={productImages[0].fileName}
																className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100 object-cover"
															/>
														) : (
															<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
																N/A
															</div>
														)}
														<div className="flex flex-1 flex-col justify-center">
															<div className="flex flex-row items-center justify-between">
																<Text as="span" variant="bodyMd" fontWeight="semibold">
																	{content.product.title}
																</Text>
															</div>
														</div>
													</IndexTable.Cell>
												</IndexTable.Row>
											)}
											{/* Subheader for variants at position 2 */}
											{variantRows.length > 0 && (
												<IndexTable.Row
													rowType="subheader"
													id="variants-subheader"
													position={2}
													selectionRange={[0, variantRows.length]}
													selected={variantsSubheaderSelected}
												>
													<IndexTable.Cell
														colSpan={1}
														scope="colgroup"
														as="th"
														id="variants-subheader"
													>
														{variantRows.length > 1
															? capitalizeFirstLetter(resourceName.plural)
															: capitalizeFirstLetter(resourceName.singular)}
													</IndexTable.Cell>
												</IndexTable.Row>
											)}
											{/* Variant rows at positions 3+ */}
											{variantRows.map((row, index) => (
												<IndexTable.Row
													id={row.id}
													key={row.id}
													selected={selectedResources.includes(row.id)}
													position={3 + index}
												>
													<IndexTable.Cell className="flex w-full flex-row items-center gap-3 p-2">
														{row.image != null ? (
															<img
																src={row.image.url}
																alt={row.image.fileName}
																className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100 object-cover"
															/>
														) : (
															<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
																N/A
															</div>
														)}
														<div className="flex flex-1 flex-col justify-center">
															<div className="flex flex-row items-center justify-between">
																<Text as="span" variant="bodyMd" fontWeight="semibold">
																	{row.title}
																</Text>
																<Text as="span" variant="bodyMd" alignment="end">
																	{row.price}
																</Text>
															</div>
															{row.variantTitle != null && (
																<Text as="span" variant="bodySm" tone="subdued">
																	{row.variantTitle}
																</Text>
															)}
														</div>
													</IndexTable.Cell>
												</IndexTable.Row>
											))}
										</IndexTable>
									</div>
								</Scrollable>
							</div>
						) : (
							<Button onClick={handleSelectProduct} variant="secondary" icon={ProductAddIcon}>
								Select Product
							</Button>
						)}
					</div>
				</div>
			</AccordionSection>

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<LayoutStyleMixinEditor nodeState={nodeState} parentNodeState={parentNodeState} />
				<div className="h-px bg-gray-200" />
				<AppearanceStyleMixinEditor nodeState={nodeState} parentNodeState={parentNodeState} />
				<div className="h-px bg-gray-200" />
				<TypographyStyleMixinEditor
					nodeState={nodeState}
					parentNodeState={parentNodeState}
					editor={editor}
				/>
				<div className="h-px bg-gray-200" />
				<FillStyleMixinEditor
					nodeState={nodeState}
					parentNodeState={parentNodeState}
					editor={editor}
				/>
			</AccordionSection>
		</>
	);
};

interface TProductVariantRow {
	id: string;
	title: string;
	price: string;
	image?: {
		url: string;
		fileName?: string;
	};
	variantTitle?: string;
}
