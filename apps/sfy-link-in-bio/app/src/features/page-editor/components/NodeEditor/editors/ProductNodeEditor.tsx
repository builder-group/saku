import { notEmpty } from '@blgc/utils';
import { TImageAsset, TProductNode } from '@repo/editor';
import { Button, IndexTable, Text, useIndexResourceState } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { isProduct } from '../../../../../lib';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const ProductNodeEditor: React.FC<TNodeEditorComponentProps<TProductNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const canChangeProduct = React.useMemo(() => content.product != null, [content.product]);

	const tableRows = React.useMemo<TProductTableRow[]>(() => {
		if (content.product == null) {
			return [];
		}

		const rows: TProductTableRow[] = [
			{
				id: content.product.id,
				type: 'Product',
				title: content.product.title,
				price: '',
				image:
					content.product.media?.[0]?.storage.type === 'url'
						? content.product.media[0].storage.url
						: undefined
			}
		];

		for (const variant of content.product.variants) {
			rows.push({
				id: variant.id,
				type: 'Variant' as const,
				title: content.product.title,
				variantTitle: variant.title,
				price: `${variant.price.amount} ${variant.price.currencyCode}`,
				image: variant.image?.storage.type === 'url' ? variant.image.storage.url : undefined
			});
		}

		return rows;
	}, [content.product]);

	const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
		tableRows as Record<string, any>[]
	);

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
	}, [nodeState, editor]);

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
							<div className="max-h-64 overflow-x-auto overflow-y-auto rounded-md border border-gray-200 bg-white">
								<div className="h-full w-full overflow-hidden">
									<IndexTable
										resourceName={{ singular: 'item', plural: 'items' }}
										itemCount={tableRows.length}
										selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
										condensed
										onSelectionChange={handleSelectionChange}
										headings={[{ title: '' }]}
									>
										{/* Product row (no subheader) */}
										{tableRows[0] != null && (
											<IndexTable.Row
												id={tableRows[0].id}
												key={tableRows[0].id}
												selected={selectedResources.includes(tableRows[0].id)}
												position={0}
											>
												<div className="flex w-full flex-row items-center gap-3 px-4 py-2">
													{tableRows[0].image ? (
														<img
															src={tableRows[0].image}
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
																{tableRows[0].title}
															</Text>
															<Text as="span" variant="bodyMd" alignment="end">
																{tableRows[0].price}
															</Text>
														</div>
													</div>
												</div>
											</IndexTable.Row>
										)}

										{/* Variants subheader and rows */}
										{tableRows.length > 1 && (
											<>
												<IndexTable.Row
													rowType="subheader"
													id="variants-subheader"
													position={1}
													selected={false}
												>
													<IndexTable.Cell
														colSpan={1}
														scope="colgroup"
														as="th"
														id="variants-subheader"
													>
														Variants
													</IndexTable.Cell>
												</IndexTable.Row>
												{tableRows.slice(1).map((row, index) => (
													<IndexTable.Row
														id={row.id}
														key={row.id}
														selected={selectedResources.includes(row.id)}
														position={2 + index}
													>
														<div className="flex w-full flex-row items-center gap-3 px-4 py-2">
															{row.image ? (
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
											</>
										)}
									</IndexTable>
								</div>
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

interface TProductTableRow {
	id: string;
	type: 'Product' | 'Variant';
	title: string;
	price: string;
	image?: string;
	variantTitle?: string;
}
