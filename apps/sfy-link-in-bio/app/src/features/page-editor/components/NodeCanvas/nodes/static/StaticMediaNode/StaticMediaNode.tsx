import React from 'react';
import { TResolvedMediaNode } from '../../../../../types';
import { TStaticNodeProps } from '../../types';
import { Content } from './Content';
import { Skeleton } from './Skeleton';

export const StaticMediaNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedMediaNode>
>((props, ref) => {
	const {
		node: {
			content: { media },
			style
		},
		cx,
		...divProps
	} = props;

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{media != null ? <Content media={media} style={style} cx={cx} /> : <Skeleton style={style} />}
		</div>
	);
});
StaticMediaNode.displayName = 'StaticMediaNode';
