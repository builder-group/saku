import { TClassicFlatPageNodeBundle, TFlatPageNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import { ClassicBundleStyleEditor } from '../bundles';

export const PageNodeStyleEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'classic':
			return (
				<ClassicBundleStyleEditor
					nodeState={nodeState as TNodeState<TClassicFlatPageNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
