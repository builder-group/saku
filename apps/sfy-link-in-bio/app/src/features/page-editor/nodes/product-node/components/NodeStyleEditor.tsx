import { TClassicProductNodeBundle, TFeaturedProductNodeBundle, TProductNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import { ClassicBundleStyleEditor, FeaturedBundleStyleEditor } from '../bundles';

export const ProductNodeStyleEditor: React.FC<TNodeEditorComponentProps<TProductNode>> = (
	props
) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'classic':
			return (
				<ClassicBundleStyleEditor
					nodeState={nodeState as TNodeState<TClassicProductNodeBundle>}
					{...rest}
				/>
			);
		case 'featured':
			return (
				<FeaturedBundleStyleEditor
					nodeState={nodeState as TNodeState<TFeaturedProductNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
