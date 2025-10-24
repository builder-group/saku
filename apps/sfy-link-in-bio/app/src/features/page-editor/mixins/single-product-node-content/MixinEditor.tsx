import { notEmpty } from '@blgc/utils';
import { TRichContent, TSingleProductNodeContentMixin } from '@repo/editor';
import {
	Button,
	IndexTable,
	Scrollable,
	Text,
	TextField,
	useIndexResourceState
} from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { PolarisDeleteIcon, PolarisProductAddIcon, RichContentField } from '@/components';
import { capitalizeFirstLetter, cn, isProduct, mutateWithReferenceUpdate } from '@/lib';
import { TPageEditor } from '../../lib';

export const SingleProductNodeContentMixinEditor = (
	props: TSingleProductNodeContentMixinEditorProps
) => {
	const { state, editor, className } = props;

	const content = useFeatureState(state);

	const canChangeProduct = React.useMemo(() => content.product != null, [content.product]);

	const titleValue = React.useMemo(() => {
		return content.overrides.title ?? content.product?.title;
	}, [content.overrides.title, content.product?.title]);
	const descriptionValue = React.useMemo(() => {
		return (
			content.overrides.description ??
			content.product?.description ?? { type: 'html' as const, value: '' }
		);
	}, [content.overrides.description, content.product?.description]);
	const tagValue = React.useMemo(() => {
		return content.tag?.label ?? '';
	}, [content.tag?.label]);

	const canResetTitle = React.useMemo(
		() =>
			content.product?.title != null &&
			content.overrides.title != null &&
			content.overrides.title !== content.product.title,
		[content.overrides.title, content.product?.title]
	);
	const canResetDescription = React.useMemo(
		() =>
			content.product?.description != null &&
			content.overrides.description != null &&
			(content.overrides.description.type !== content.product.description.type ||
				content.overrides.description.value !== content.product.description.value),
		[content.overrides.description, content.product?.description]
	);

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
				icon: PolarisDeleteIcon,
				destructive: true,
				content: `Delete ${selectedResources.length > 1 ? `${selectedResources.length} ${resourceName.plural}` : resourceName.singular}`,
				disabled: variantRows.length === 1 || selectedResources.length >= variantRows.length,
				onAction: () => {
					if (state._v.product == null) {
						return;
					}

					state._v.product = mutateWithReferenceUpdate(state._v.product, (draft) => {
						draft.variants = draft.variants.filter(
							(variant) => !selectedResources.includes(variant.id)
						);
					});
					state._notify();

					clearSelection();
				}
			}
		],
		[clearSelection, state, selectedResources, resourceName, variantRows.length]
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

	const handleTitleChange = React.useCallback(
		(value: string) => {
			state._v.overrides.title = value;
			state._notify();
		},
		[state]
	);

	const handleTitleReset = React.useCallback(() => {
		state._v.overrides.title = undefined;
		state._notify();
	}, [state]);

	const handleDescriptionChange = React.useCallback(
		(value: TRichContent) => {
			state._v.overrides.description = value;
			state._notify();
		},
		[state]
	);

	const handleDescriptionReset = React.useCallback(() => {
		state._v.overrides.description = undefined;
		state._notify();
	}, [state]);

	const handleTagChange = React.useCallback(
		(value: string) => {
			if (value === '') {
				state._v.tag = undefined;
			} else {
				state._v.tag = { label: value };
			}
			state._notify();
		},
		[state]
	);

	const handleSelectProduct = React.useCallback(async () => {
		const results = await editor.shopify.resourcePicker({
			type: 'product',
			filter: {
				hidden: false,
				draft: false,
				archived: false
			}
			// TODO: add back in once its possible to do a new selection without the previous selection being hidden (and thus unselectable)
			// selectionIds:
			// 	content.product != null
			// 		? [
			// 				{
			// 					id: content.product.id,
			// 					variants: content.product.variants.map((variant) => ({ id: variant.id }))
			// 				}
			// 			]
			// 		: undefined
		});
		const product = results?.[0];
		if (!isProduct(product)) {
			return;
		}

		clearSelection();

		state._v.product = {
			id: product.id,
			title: product.title,
			description: { type: 'html', value: product.descriptionHtml },
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
		state._notify();
	}, [editor, clearSelection, state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Content
				</Text>
			</div>

			{/* Product */}
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
					<div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
						<Scrollable
							// Note: Using style because "Scrollable" doesn't consider Tailwind classes
							style={{ maxHeight: 256 }}
						>
							<div className="h-full w-full overflow-hidden">
								<style>
									{`
												.Polaris-IndexTable__TableRow.Polaris-IndexTable__TableRow--subheader,
												.Polaris-IndexTable__TableRow.Polaris-IndexTable__TableRow--subheader .Polaris-IndexTable__TableCell:first-child,
												.Polaris-IndexTable__TableRow.Polaris-IndexTable__TableRow--subheader .Polaris-IndexTable__TableCell--first,
												.Polaris-IndexTable__TableRow.Polaris-IndexTable__TableRow--subheader .Polaris-IndexTable__TableCell--first + .Polaris-IndexTable__TableCell,
												.Polaris-IndexTable__TableRow.Polaris-IndexTable__TableRow--subheader .Polaris-IndexTable__TableCell:last-child {
													border-top: 0 !important;
													border-bottom: 0 !important;
													border: 0 !important;
												}
											`}
								</style>
								<IndexTable
									resourceName={resourceName}
									itemCount={variantRows.length}
									selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
									onSelectionChange={handleSelectionChange}
									headings={[{ title: '', hidden: true }]}
									bulkActions={bulkActions}
									condensed // Condensed because non condensed has buggy sticky table header
								>
									{/* Product subheader at position 0 */}
									<IndexTable.Row
										rowType="subheader"
										id="product-subheader"
										position={0}
										disabled={true}
									>
										<IndexTable.Cell colSpan={1} scope="colgroup" as="th" id="product-subheader">
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
														className="h-10 w-10 shrink-0 rounded-md bg-neutral-100 object-cover"
													/>
												) : (
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs text-gray-400">
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
											<IndexTable.Cell colSpan={1} scope="colgroup" as="th" id="variants-subheader">
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
														className="h-10 w-10 shrink-0 rounded-md bg-neutral-100 object-cover"
													/>
												) : (
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs text-gray-400">
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
					<Button onClick={handleSelectProduct} variant="secondary" icon={PolarisProductAddIcon}>
						Select Product
					</Button>
				)}
			</div>

			{/* Title */}
			{content.product != null && (
				<div className="space-y-1">
					<div className="flex items-center justify-between">
						<Text as="span" variant="bodySm" tone="subdued">
							Title
						</Text>
						{canResetTitle && (
							<Button variant="plain" size="micro" onClick={handleTitleReset}>
								Reset
							</Button>
						)}
					</div>
					<TextField
						id="title-field"
						label="Title"
						labelHidden
						value={titleValue}
						onChange={handleTitleChange}
						autoComplete="off"
						placeholder="Product title"
					/>
				</div>
			)}

			{/* Description */}
			{content.product != null && (
				<div className="space-y-1">
					<div className="flex items-center justify-between">
						<Text as="span" variant="bodySm" tone="subdued">
							Description
						</Text>
						{canResetDescription && (
							<Button variant="plain" size="micro" onClick={handleDescriptionReset}>
								Reset
							</Button>
						)}
					</div>
					<RichContentField
						id="description-field"
						label="Description"
						labelHidden
						value={descriptionValue}
						onChange={handleDescriptionChange}
						autoComplete="off"
						placeholder="Product description"
						multiline={4}
					/>
				</div>
			)}

			{/* Tag */}
			{content.product != null && (
				<div className="space-y-1">
					<Text as="span" variant="bodySm" tone="subdued">
						Tag
					</Text>
					<TextField
						id="tag-field"
						label="Tag"
						labelHidden
						value={tagValue}
						onChange={handleTagChange}
						autoComplete="off"
						placeholder="e.g. New, Sale, Limited"
					/>
				</div>
			)}
		</div>
	);
};

interface TSingleProductNodeContentMixinEditorProps {
	state: TState<TSingleProductNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}

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
