import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedSectionTitleTextNodeBundle } from '../../types';

export const ResolvedSectionTitleBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedSectionTitleBundleProps
>((props, ref) => {
	const {
		node: { content, autoLayout, appearance, textXl }
	} = props;

	return (
		<div
			ref={ref}
			style={{
				...autoLayout.styles,
				...appearance.styles
			}}
			className="flex min-h-16 items-center justify-center"
		>
			TODO
		</div>
	);
});
ResolvedSectionTitleBundle.displayName = 'ResolvedSectionTitleBundle';

interface TResolvedSectionTitleBundleProps {
	node: TResolvedSectionTitleTextNodeBundle;
	cx: TResolvedNodeProps<TResolvedSectionTitleTextNodeBundle>['cx'];
}
