import { deepCopy } from '@blgc/utils';
import {
	inherit,
	isInherited,
	resolveReference,
	TMergeMixins,
	TRgba,
	TShadowStyleMixin,
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

export const ShadowStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TShadowStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor, disabledSpread = false } = props;

	const resolvedShadow = useCombinedCompute(
		[state, parentState ?? createState(undefined)],
		([{ value }, { value: parentValue }]) => {
			return resolveReference(value.shadow, parentValue?.childMixins?.shadow);
		}
	);

	const isInheritedShadow = useCompute(state, ({ value }) => {
		return isInherited(value.shadow);
	});

	const colorState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.shadow,
		getPropertyReference: (value) => value?.color,
		setProperty: (value, notifyOptions) => {
			if (state._v.shadow != null && !isInherited(state._v.shadow)) {
				(
					state._v.shadow as {
						color: TRgba;
					}
				).color = value;
				state._notify(notifyOptions);
			}
		}
	});
	const blurState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.shadow,
		getPropertyReference: (value) => value?.blur,
		setProperty: (value, notifyOptions) => {
			if (state._v.shadow != null && !isInherited(state._v.shadow)) {
				(
					state._v.shadow as {
						blur: number;
					}
				).blur = value;
				state._notify(notifyOptions);
			}
		}
	});
	const spreadState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.shadow,
		getPropertyReference: (value) => value?.spread,
		setProperty: (value, notifyOptions) => {
			if (state._v.shadow != null && !isInherited(state._v.shadow)) {
				(
					state._v.shadow as {
						spread: number;
					}
				).spread = value;
				state._notify(notifyOptions);
			}
		}
	});
	const offsetXState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.shadow,
		getPropertyReference: (value) => value?.offsetX,
		setProperty: (value, notifyOptions) => {
			if (state._v.shadow != null && !isInherited(state._v.shadow)) {
				(
					state._v.shadow as {
						offsetX: number;
					}
				).offsetX = value;
				state._notify(notifyOptions);
			}
		}
	});
	const offsetYState = useMapStateReference(state, {
		getTopLevelReference: (value) => value.shadow,
		getPropertyReference: (value) => value?.offsetY,
		setProperty: (value, notifyOptions) => {
			if (state._v.shadow != null && !isInherited(state._v.shadow)) {
				(
					state._v.shadow as {
						offsetY: number;
					}
				).offsetY = value;
				state._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddShadow = React.useCallback(() => {
		const parentShadow = parentState?._v.childMixins?.shadow;
		state._v.shadow = parentShadow ?? {
			color: { r: 0, g: 0, b: 0, a: 0.1 },
			offsetX: 0,
			offsetY: 4,
			blur: 6,
			spread: disabledSpread ? 0 : -1
		};
		state._notify();
	}, [state, parentState, disabledSpread]);

	const handleRemoveShadow = React.useCallback(() => {
		state._v.shadow = null;
		state._notify();
	}, [state]);

	const handleToggleInheritance = React.useCallback(() => {
		state._v.shadow = isInheritedShadow
			? (deepCopy(parentState?._v.childMixins?.shadow) ?? null)
			: inherit();
		state._notify();
	}, [isInheritedShadow, parentState, state]);

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
							title={isInheritedShadow ? 'Unlink from parent' : 'Link to parent'}
						>
							{isInheritedShadow ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Shadow
						</Text>
						{isInheritedShadow && (
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

				{/* Add/Remove shadow buttons */}
				{resolvedShadow != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveShadow} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddShadow} variant="plain" size="micro" />
				)}
			</div>

			{resolvedShadow != null && (
				<div className="space-y-3">
					<MappedColorInput
						label="Color"
						autoComplete="off"
						state={colorState}
						parentState={parentState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							colorState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.shadow?.color}
						onInheritChange={() => {
							handleToggleInheritance();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance
					/>
					<div className="grid grid-cols-2 gap-3">
						<MappedTextInput
							label="Blur"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={blurState}
							parentState={parentState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								blurState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.blur}
							onInheritChange={() => {
								handleToggleInheritance();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
							disableFieldInheritance
						/>
						<MappedTextInput
							label="Spread"
							type="number"
							autoComplete="off"
							min={-48}
							max={48}
							step={4}
							state={spreadState}
							parentState={parentState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								spreadState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.spread}
							onInheritChange={() => {
								handleToggleInheritance();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
							disableFieldInheritance
							disabled={disabledSpread}
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<MappedTextInput
							label="Offset X"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={offsetXState}
							parentState={parentState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								offsetXState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.offsetX}
							onInheritChange={() => {
								handleToggleInheritance();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
							disableFieldInheritance
						/>
						<MappedTextInput
							label="Offset Y"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={offsetYState}
							parentState={parentState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								offsetYState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.offsetY}
							onInheritChange={() => {
								handleToggleInheritance();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
							disableFieldInheritance
						/>
					</div>
				</div>
			)}
		</div>
	);
};

interface TShadowStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TShadowStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TShadowStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
	disabledSpread?: boolean;
}
