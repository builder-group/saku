import { TFlatNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { EditorSiteResolveContext, nodeRegistry, TNodeProps } from '../../lib';
import { resolveAppearanceStyleMixin } from '../../mixins';

export const Node: React.FC<TNodeProps<TFlatNode>> = (props) => {
	const { nodeState, editor } = props;

	useBoundingRectObserver(
		nodeState.ref,
		nodeState.boundingRect._v,
		(rect) => {
			nodeState.boundingRect.set(rect);
		},
		[nodeState]
	);

	const isVisible = useCompute(nodeState, ({ value }) => {
		return resolveAppearanceStyleMixin(value.appearance, {
			node: { site: new EditorSiteResolveContext(editor) },
			mixinTokenSet: editor.mixinTokenMap.appearance?._v,
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: editor.variableTokenMap._v
		}).unwrap().visible;
	});

	const NodeComponent = React.useMemo(
		() => nodeRegistry[nodeState.type] as React.ComponentType<TNodeProps<TFlatNode>>,
		[nodeState.type]
	);

	if (!isVisible) {
		return null;
	}

	return <NodeComponent ref={nodeState.ref} nodeState={nodeState} editor={editor} />;
};
