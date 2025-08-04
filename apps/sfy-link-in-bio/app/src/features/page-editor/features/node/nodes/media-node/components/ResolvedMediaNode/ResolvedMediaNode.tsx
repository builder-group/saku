import React from 'react';
import { TResolvedMediaNode } from '../../../../../../types';
import { TResolvedNodeProps } from '../../../../types';
import { ImageContent } from './ImageContent';
import { Skeleton } from './Skeleton';

export const ResolvedMediaNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedMediaNode>
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
ResolvedMediaNode.displayName = 'ResolvedMediaNode';
