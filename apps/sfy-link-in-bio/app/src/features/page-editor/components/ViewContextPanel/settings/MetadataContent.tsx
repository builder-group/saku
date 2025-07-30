import { TFlatPageNode } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import {
	EditorSiteResolveContext,
	resolvePageNodeWithoutChildren,
	TPageEditor
} from '../../../lib';
import { TextStyleField } from '../../NodeEditor/fields';
import { PanelHeader } from '../../PanelHeader';

export const MetadataContent: React.FC<TMetadataContentProps> = (props) => {
	const { editor } = props;

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const resolvedRootNode = useCompute(
		rootNode,
		(node) => resolvePageNodeWithoutChildren(node, { site: new EditorSiteResolveContext(editor) }),
		[editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="flex h-full flex-col">
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Metadata
				</Text>
			</PanelHeader>
			<div className="flex-1 overflow-auto">
				<div className="space-y-3 p-4">
					<TextStyleField<TFlatPageNode, never, string>
						label="Title"
						node={rootNode}
						nodeValueMapper={(value) => value.content?.metadata?.title}
						nodeValueSetter={(node, value) => {
							node._v.content.metadata.title = value;
							node._notify();
						}}
						autoComplete="off"
						placeholder={resolvedRootNode?.content?.metadata?.title}
					/>

					<TextStyleField<TFlatPageNode, never, string>
						label="Description"
						node={rootNode}
						nodeValueMapper={(value) => value.content?.metadata?.description}
						nodeValueSetter={(node, value) => {
							node._v.content.metadata.description = value;
							node._notify();
						}}
						autoComplete="off"
						placeholder={resolvedRootNode?.content?.metadata?.description}
					/>
				</div>
			</div>
		</div>
	);
};

interface TMetadataContentProps {
	editor: TPageEditor;
}
