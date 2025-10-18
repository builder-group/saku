import { TRichTextNodeBundle, TSectionTitleTextNodeBundle, TTextNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import { RichBundleStyleEditor, SectionTitleBundleStyleEditor } from '../bundles';

export const TextNodeStyleEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'rich':
			return (
				<RichBundleStyleEditor nodeState={nodeState as TNodeState<TRichTextNodeBundle>} {...rest} />
			);
		case 'section-title':
			return (
				<SectionTitleBundleStyleEditor
					nodeState={nodeState as TNodeState<TSectionTitleTextNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
