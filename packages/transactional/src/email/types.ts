import type React from 'react';

export type TEmailFC<GProps = {}> = React.FC<GProps> & {
	PreviewProps: GProps;
};
