import { useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import type { TAboutNode } from '../../../types';
import { StaticAboutNode } from './static';

export const AboutNode = React.forwardRef<HTMLDivElement, TAboutNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;
	const node = useFeatureState(nodeState);

	return <StaticAboutNode {...divProps} ref={ref} node={node} editor={editor} />;
});
AboutNode.displayName = 'AboutNode';

interface TAboutNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TAboutNode>;
	editor: TPageEditor;
}
