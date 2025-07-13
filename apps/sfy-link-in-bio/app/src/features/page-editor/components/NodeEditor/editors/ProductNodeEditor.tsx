import { notEmpty } from '@blgc/utils';
import { TImageAsset, TProductNode } from '@repo/editor';
import { Button, IndexTable, Scrollable, Text, useIndexResourceState } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { capitalizeFirstLetter, isProduct, mutateWithReferenceUpdate } from '@/lib';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const ProductNodeEditor: React.FC<TNodeEditorComponentProps<TProductNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const canChangeProduct = React.useMemo(() => content.product != null, [content.product]);

	const variantRows = React.useMemo<TProductVariantRow[]>(() => {
		if (content.product == null) {
			return [];
		}

		return content.product.variants.map((variant) => ({
			id: variant.id,
			title: content.product?.title as string,
			variantTitle: variant.title,
			price: `${variant.price.amount} ${variant.price.currencyCode}`,
			image: variant.image?.storage.type === 'url' ? variant.image.storage.url : undefined
		}));
	}, [content.product]);

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
		const results = await editor.shopify.resourcePicker({ type: 'product' });
		const product = results?.[0];
		if (!isProduct(product)) {
			editor.shopify.toast.show('No products selected');
			return;
		}

		clearSelection();

		nodeState._v.content.product = {
			id: product.id,
			title: product.title,
			media: product.images
				.map((img) => {
					const hash = editor.registerImage(img.originalSrc);
					if (hash == null) {
						return null;
					}

					return {
						type: 'image',
						hash,
						contentType: 'image/png',
						storage: { type: 'url', url: img.originalSrc },
						altText: img.altText
					} as TImageAsset;
				})
				.filter(notEmpty),
			options: product.options.map((opt) => ({ name: opt.name, values: opt.values })),
			variants: product.variants
				.map((variant) => {
					if (variant.id == null || variant.title == null || variant.price == null) {
						return null;
					}

					let image: TImageAsset | undefined;
					if (variant.image?.originalSrc != null) {
						const hash = editor.registerImage(variant.image.originalSrc);
						if (hash != null) {
							image = {
								type: 'image',
								hash,
								contentType: 'image/png',
								storage: { type: 'url', url: variant.image.originalSrc },
								altText: variant.image.altText
							};
						}
					}

					return {
						id: variant.id,
						title: variant.title,
						price: {
							amount: variant.price,
							currencyCode: 'USD'
						},
						image,
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
													<div className="flex w-full flex-row items-center gap-3 p-2">
														{content.product.media?.[0]?.storage.type === 'url' ? (
															<img
																src={content.product.media[0].storage.url}
																alt=""
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
													</div>
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
													<div className="flex w-full flex-row items-center gap-3 p-2">
														{row.image != null ? (
															<img
																src={row.image}
																alt=""
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
													</div>
												</IndexTable.Row>
											))}
										</IndexTable>
									</div>
								</Scrollable>
							</div>
						) : (
							<Button onClick={handleSelectProduct} variant="primary">
								Select
							</Button>
						)}
					</div>
				</div>
			</AccordionSection>

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				Style
			</AccordionSection>
		</>
	);
};

interface TProductVariantRow {
	id: string;
	title: string;
	price: string;
	image?: string;
	variantTitle?: string;
}
