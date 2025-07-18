import { Hr, Link, Tailwind, Text } from '@react-email/components';
import React from 'react';

export const MarketingFooter: React.FC = () => {
	return (
		<Tailwind>
			<Hr className="mx-0 my-6 w-full border border-neutral-200" />
			<Text className="text-[12px] leading-6 text-neutral-500">
				We send out product update emails once a month – no spam, no nonsense. Don't want to get
				these emails?{' '}
				<Link className="text-neutral-700 underline" href="https://app.saku.co/account/settings">
					Unsubscribe here.
				</Link>
			</Text>
		</Tailwind>
	);
};
