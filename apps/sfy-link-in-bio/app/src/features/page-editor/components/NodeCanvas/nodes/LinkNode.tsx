import { useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { TLinkNode } from '../../../types';
import { StaticLinkNode } from './static';

export const LinkNode = React.forwardRef<HTMLDivElement, TLinkNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;
	const node = useFeatureState(nodeState);

	return <StaticLinkNode {...divProps} ref={ref} node={node} editor={editor} />;
});
LinkNode.displayName = 'LinkNode';

interface TLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
}
