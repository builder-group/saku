import { TAboutNode, TClassicAboutNodeBundle, THeroAboutNodeBundle } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import { ClassicBundleStyleEditor, HeroBundleStyleEditor } from '../bundles';

export const AboutNodeStyleEditor: React.FC<TNodeEditorComponentProps<TAboutNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'classic':
			return (
				<ClassicBundleStyleEditor
					nodeState={nodeState as TNodeState<TClassicAboutNodeBundle>}
					{...rest}
				/>
			);
		case 'hero':
			return (
				<HeroBundleStyleEditor
					nodeState={nodeState as TNodeState<THeroAboutNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
