import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedHeroAboutNodeBundle } from '../../types';

export const ResolvedHeroBundle: React.FC<TResolvedHeroBundleProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, textXl, text, image }
	} = props;

	return (
		<div
			className="relative overflow-hidden"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			Coming soon
		</div>
	);
};

interface TResolvedHeroBundleProps {
	node: TResolvedHeroAboutNodeBundle;
	cx: TResolvedNodeProps<TResolvedHeroAboutNodeBundle>['cx'];
}
