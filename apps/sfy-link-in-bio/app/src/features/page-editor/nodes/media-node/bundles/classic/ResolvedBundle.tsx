import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedSingleMediaNodeContentMixin } from '../../../../mixins';
import { TResolvedClassicMediaNodeBundle } from '../../types';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const {
			node: { autoLayout, appearance, fill, stroke, shadow, animation, image },
			media
		} = props;

		return (
			<div
				ref={ref}
				className="relative overflow-hidden"
				style={{
					...autoLayout.styles,
					...appearance.styles,
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles,
					...animation?.styles
				}}
			>
				<img
					src={media.src}
					alt={media.altText}
					className="h-auto w-full object-cover"
					draggable={false}
					style={image.styles}
				/>
			</div>
		);
	}
);
ResolvedClassicBundle.displayName = 'ResolvedClassicBundle';

interface TResolvedClassicBundleProps {
	node: TResolvedClassicMediaNodeBundle;
	media: NonNullable<TResolvedSingleMediaNodeContentMixin['value']['media']>;
	cx: TResolvedNodeProps<TResolvedClassicMediaNodeBundle>['cx'];
}
