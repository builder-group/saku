import { deepCopy } from '@blgc/utils';
import {
	inherit,
	isInherited,
	resolveReference,
	TMergeMixins,
	TStrokeStyleMixin,
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
	MappedColorInput,
	MappedTextInput,
	MinusIcon,
	PlusIcon
} from '@/components';
import { useMapStateReference } from '../../hooks';
import { TPageEditor } from '../../lib';

export const StrokeStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TStrokeStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const resolvedStroke = useCombinedCompute(
		[state, parentState ?? createState(undefined)],
		([{ value }, { value: parentValue }]) => {
			return resolveReference(value.stroke, parentValue?.childMixins?.stroke);
		}
	);

	const isInheritedStroke = useCompute(state, ({ value }) => {
		return isInherited(value.stroke);
	});

	const colorState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.stroke,
		getPropertyReference: (value) => value?.color,
		setProperty: (value) => {
			if (state._v.stroke != null && !isInherited(state._v.stroke)) {
				state._v.stroke.color = value;
				state._notify();
			}
		}
	});
	const widthState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.stroke,
		getPropertyReference: (value) => value?.width,
		setProperty: (value) => {
			if (state._v.stroke != null && !isInherited(state._v.stroke)) {
				state._v.stroke.width = value;
				state._notify();
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		const parentStroke = parentState?._v.childMixins?.stroke;
		state._v.stroke = parentStroke ?? {
			color: { r: 0, g: 0, b: 0, a: 1 },
			width: 1
		};
		state._notify();
	}, [state, parentState]);

	const handleRemoveStroke = React.useCallback(() => {
		state._v.stroke = null;
		state._notify();
	}, [state]);

	const handleToggleInheritance = React.useCallback(() => {
		state._v.stroke = isInheritedStroke
			? (deepCopy(parentState?._v.childMixins?.stroke) ?? null)
			: inherit();
		state._notify();
	}, [isInheritedStroke, parentState, state]);

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
							title={isInheritedStroke ? 'Unlink from parent' : 'Link to parent'}
						>
							{isInheritedStroke ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Stroke
						</Text>
						{isInheritedStroke && (
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

				{/* Add/Remove stroke buttons */}
				{resolvedStroke != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveStroke} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddStroke} variant="plain" size="micro" />
				)}
			</div>

			{resolvedStroke != null && (
				<div className="grid grid-cols-2 gap-3">
					<MappedColorInput
						label="Color"
						autoComplete="off"
						state={colorState}
						parentState={parentState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							colorState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.stroke?.color}
						onInheritChange={() => {
							handleToggleInheritance();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance
					/>
					<MappedTextInput
						label="Width"
						type="number"
						autoComplete="off"
						min={0}
						max={20}
						step={1}
						state={widthState}
						parentState={parentState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							widthState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.stroke?.width}
						onInheritChange={() => {
							handleToggleInheritance();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance
					/>
				</div>
			)}
		</div>
	);
};

interface TStrokeStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TStrokeStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TStrokeStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}
