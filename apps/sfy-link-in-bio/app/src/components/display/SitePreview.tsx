import React from 'react';
import { cn } from '../../lib';

export const SitePreview: React.FC<TSitePreviewProps> = (props) => {
	const { url, className, ...divProps } = props;

	return (
		<div
			className={cn('relative flex h-72 items-center justify-center overflow-hidden', className)}
			{...divProps}
		>
			{/* Desktop Preview */}
			<div className="absolute top-0 left-0 w-full max-w-lg">
				<div className="rounded-xl bg-gray-800 p-2 pb-5 shadow-xl">
					{/* Browser Chrome */}
					<div className="flex h-7 items-center rounded-t-lg bg-gray-100 px-2">
						{/* Traffic Lights */}
						<div className="mr-4 flex gap-1.5">
							<div className="h-2.5 w-2.5 rounded-full bg-red-500" />
							<div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
							<div className="h-2.5 w-2.5 rounded-full bg-green-500" />
						</div>
						{/* Address Bar */}
						<div className="flex h-4 flex-1 items-center justify-center rounded bg-white">
							<a
								className="max-w-xs truncate px-2 text-xs text-gray-500 hover:underline"
								href={url}
								target="_blank"
							>
								{url}
							</a>
						</div>
					</div>

					{/* Browser Content */}
					<div className="relative h-72 overflow-hidden rounded-b-lg bg-white">
						<iframe
							src={`${url}?preview=true`}
							title="Desktop Preview"
							className="h-full w-full origin-top-left scale-45 border-0"
							style={{
								width: '222%',
								height: '222%'
							}}
							loading="lazy"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						/>
					</div>
				</div>
			</div>

			{/* Mobile Preview */}
			<div className="absolute top-12 right-0 w-44">
				<div className="rounded-3xl border-4 border-gray-800 bg-gray-800 p-1 shadow-xl">
					{/* Screen */}
					<div className="relative h-80 overflow-hidden rounded-2xl bg-white">
						<iframe
							src={`${url}?preview=true`}
							title="Mobile Preview"
							className="h-full w-full origin-top-left scale-42 border-0"
							style={{
								width: '238%',
								height: '238%'
							}}
							loading="lazy"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						/>
					</div>

					{/* Home Indicator */}
					<div className="flex justify-center pt-2">
						<div className="h-1 w-8 rounded-full bg-gray-300" />
					</div>
				</div>
			</div>
		</div>
	);
};

interface TSitePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
	url: string;
}
