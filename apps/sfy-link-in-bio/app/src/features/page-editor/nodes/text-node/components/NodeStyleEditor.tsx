import { TRichTextNodeBundle, TTextNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import { RichtBundleStyleEditor } from '../bundles';

export const TextNodeStyleEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'rich':
			return (
				<RichtBundleStyleEditor
					nodeState={nodeState as TNodeState<TRichTextNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
