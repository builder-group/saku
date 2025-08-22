import { Tooltip } from '@shopify/polaris';
import React from 'react';
import { ArrowRightIcon, Badge, LinkOffIcon } from '../display';

export const InheritedButton: React.FC<TProps> = (props) => {
	const { onClick } = props;

	return (
		<Tooltip
			content={
				<span>
					This field is inherited from the parent. Click the unlink icon (
					<LinkOffIcon className="inline h-3 w-3" />) to set a custom value.
				</span>
			}
			preferredPosition="below"
			hoverDelay={500}
		>
			{onClick != null ? (
				<Badge asChild>
					<button
						type="button"
						onClick={onClick}
						className="group pointer-events-auto cursor-pointer"
					>
						Inherited
						<ArrowRightIcon className="hidden h-3 w-3 group-hover:block" />
					</button>
				</Badge>
			) : (
				<Badge>Inherited</Badge>
			)}
		</Tooltip>
	);
};

interface TProps {
	onClick?: () => void;
}
