import {
	inherit,
	isInherited,
	TAppearanceStyleMixin,
	TFlatNode,
	TMergeMixins,
	TReference,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { HideIcon, MappedTextInput, ViewIcon } from '@/components';
import { TNodeState } from '../../lib';

export const AppearanceStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TAppearanceStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleVisibility = React.useCallback(() => {
		nodeState._v.appearance.visible = !nodeState._v.appearance.visible;
		nodeState._notify();
	}, [nodeState]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Appearance
				</Text>

				{nodeState._v.appearance.visible ? (
					<Button icon={ViewIcon} onClick={handleToggleVisibility} variant="plain" size="micro" />
				) : (
					<Button icon={HideIcon} onClick={handleToggleVisibility} variant="plain" size="micro" />
				)}
			</div>
			<div className="grid grid-cols-2 gap-3">
				<MappedTextInput
					label="Opacity"
					type="number"
					autoComplete="off"
					min={0}
					max={100}
					step={5}
					state={nodeState}
					parentState={parentNodeState}
					mapValue={(value) =>
						isInherited(value.appearance.opacity) ? inherit() : value.appearance.opacity * 100
					}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.appearance.opacity = value / 100;
							nodeState._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins.appearance.opacity * 100}
					onInheritChange={(shouldInherit, parentValue) => {
						nodeState._v.appearance.opacity = shouldInherit
							? inherit()
							: (parentValue as TReference<number>);

						nodeState._notify();
					}}
					disableFieldInheritance={parentNodeState == null}
				/>
				<MappedTextInput
					label="Border Radius"
					type="number"
					autoComplete="off"
					min={0}
					max={999}
					step={4}
					state={nodeState}
					parentState={parentNodeState}
					mapValue={(value) => value.appearance.borderRadius}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.appearance.borderRadius = value;
							nodeState._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins.appearance.borderRadius}
					onInheritChange={(shouldInherit, parentValue) => {
						nodeState._v.appearance.borderRadius = shouldInherit
							? inherit()
							: (parentValue as TReference<number>);
						nodeState._notify();
					}}
					disableFieldInheritance={parentNodeState == null}
				/>
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TAppearanceStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TAppearanceStyleMixin>]>;
		}
	>;
}
