import React from 'react';
import { TResolvedMediaNode } from '../../../../../types';
import { TStaticNodeProps } from '../../types';
import { ImageContent } from './ImageContent';
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
			{(() => {
				switch (media?.type) {
					case 'image':
						return <ImageContent media={media} style={style} cx={cx} />;
					default:
						return <Skeleton style={style} />;
				}
			})()}
		</div>
	);
});
StaticMediaNode.displayName = 'StaticMediaNode';
