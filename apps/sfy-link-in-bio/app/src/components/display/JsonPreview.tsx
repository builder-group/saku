import React from 'react';
import { ClipboardButton } from '../input';

interface TJsonPreviewProps {
	data: unknown;
	className?: string;
}

export const JsonPreview: React.FC<TJsonPreviewProps> = ({ data, className = '' }) => {
	const jsonString = JSON.stringify(data, null, 2);

	return (
		<div className={`relative ${className}`}>
			<pre className="max-h-96 overflow-auto rounded bg-neutral-50 p-3 text-xs">{jsonString}</pre>
			<div className="absolute top-2 right-2">
				<ClipboardButton textToCopy={jsonString} size="micro" variant="tertiary" />
			</div>
		</div>
	);
};
