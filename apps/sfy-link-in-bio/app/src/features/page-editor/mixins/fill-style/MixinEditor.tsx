import { deepCopy } from '@blgc/utils';
import {
	inherit,
	isInherited,
	resolveReference,
	TFillStyleMixin,
	TMergeMixins,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react';
import { createState, TState } from 'feature-state';
import React from 'react';
import {
	Badge,
	InheritanceActionOverlay,
	LinkIcon,
	LinkOffIcon,
	MappedPaintInput,
	MinusIcon,
	PlusIcon
} from '@/components';
import { useMapStateReference } from '../../hooks';
import { TPageEditor } from '../../lib';

export const FillStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TFillStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const resolvedFill = useCombinedCompute(
		[state, parentState ?? createState(undefined)],
		([{ value }, { value: parentValue }]) => {
			return resolveReference(value.fill, parentValue?.childMixins?.fill);
		}
	);

	const isInheritedFill = useCompute(state, ({ value }) => {
		return isInherited(value.fill);
	});

	const paintState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.fill,
		getPropertyReference: (value) => value?.paint,
		setProperty: (value) => {
			if (state._v.fill != null && !isInherited(state._v.fill)) {
				state._v.fill.paint = value;
				state._notify();
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		const parentFill = parentState?._v.childMixins?.fill;
		state._v.fill = parentFill ?? {
			paint: {
				type: 'solid',
				color: { r: 255, g: 255, b: 255, a: 1 }
			},
			opacity: 1
		};
		state._notify();
	}, [state, parentState]);

	const handleRemoveFill = React.useCallback(() => {
		state._v.fill = null;
		state._notify();
	}, [state]);

	const handleToggleInheritance = React.useCallback(() => {
		state._v.fill = isInheritedFill
			? (deepCopy(parentState?._v.childMixins?.fill) ?? null)
			: inherit();
		state._notify();
	}, [isInheritedFill, parentState, state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{/* Mixin-level inheritance button */}
					{parentState != null && (
						<button
							type="button"
							onClick={handleToggleInheritance}
							className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
							title={isInheritedFill ? 'Unlink from parent' : 'Link to parent'}
						>
							{isInheritedFill ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Fill
						</Text>
						{isInheritedFill && (
							<Badge className="group relative hover:w-32">
								Inherited
								<InheritanceActionOverlay
									variant={'full-overlay'}
									onUnlink={handleToggleInheritance}
									onNavigateToParent={() => editor.switchView('settings')}
								/>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove fill buttons */}
				{resolvedFill != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveFill} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddFill} variant="plain" size="micro" />
				)}
			</div>

			{resolvedFill != null && (
				<div>
					<MappedPaintInput
						label="Paint"
						autoComplete="off"
						state={paintState}
						parentState={parentState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							paintState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.fill?.paint}
						onInheritChange={() => {
							handleToggleInheritance();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance
						editor={editor}
					/>
				</div>
			)}
		</div>
	);
};

interface TFillStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TFillStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TFillStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}
