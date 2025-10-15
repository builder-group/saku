import { TClassicMediaNodeBundle, TMediaNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import { ClassicBundleStyleEditor } from '../bundles';

export const MediaNodeStyleEditor: React.FC<TNodeEditorComponentProps<TMediaNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'classic':
			return (
				<ClassicBundleStyleEditor
					nodeState={nodeState as TNodeState<TClassicMediaNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
