import React from 'react';
import { mdxComponents } from '@/components';
import Content from './content.mdx';

const Page: React.FC = () => {
	return (
		<div className="prose">
			<Content components={mdxComponents} />
		</div>
	);
};

export default Page;
