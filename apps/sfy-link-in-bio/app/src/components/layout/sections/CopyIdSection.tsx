import { Text, TextField } from '@shopify/polaris';
import React from 'react';
import { ClipboardButton } from '@/components/input';

export const CopyIdSection: React.FC<TCopyIdSectionProps> = (props) => {
	const { id, title, description, helpText } = props;

	return (
		<div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
			<div className="space-y-5 p-5 sm:p-8">
				<div className="space-y-3">
					<div>
						<Text as="h2" variant="headingMd">
							{title}
						</Text>
					</div>
					{description != null && (
						<div>
							<Text as="p" variant="bodySm" tone="subdued">
								{description}
							</Text>
						</div>
					)}
				</div>

				<div className="relative max-w-md">
					<TextField label="" value={id} readOnly autoComplete="off" />
					<div className="absolute top-0 right-2 z-50 flex h-full items-center">
						<ClipboardButton textToCopy={id} variant="plain" />
					</div>
				</div>
			</div>

			{helpText != null && (
				<div className="border-t border-gray-300 bg-gray-50 px-5 py-4 sm:px-8">
					<Text as="p" variant="bodySm" tone="subdued">
						{helpText}
					</Text>
				</div>
			)}
		</div>
	);
};

interface TCopyIdSectionProps {
	id: string;
	title: string;
	description?: string;
	helpText?: string;
}
