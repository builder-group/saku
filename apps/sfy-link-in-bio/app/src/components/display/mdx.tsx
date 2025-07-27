import React from 'react';

export const mdxComponents: Record<string, React.ComponentType<any>> = {
	em: (props) => <i {...props} />
};
