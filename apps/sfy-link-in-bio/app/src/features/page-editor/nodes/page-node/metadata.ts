import { tokenRef } from '@repo/editor';
import { TNodeMetadata } from '../../lib';

export const pageNodeMetadata: TNodeMetadata<'page'> = {
	type: 'page',
	internal: true,
	defaultData: {
		autoLayout: {
			horizontalPadding: 24,
			verticalPadding: 48,
			verticalGap: 24
		},
		appearance: {
			visible: true,
			opacity: 1
		},
		fill: tokenRef(),
		children: [],
		content: {
			type: 'default'
		},
		metadata: {}
	}
};
