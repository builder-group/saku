import { Text, TextField } from '@shopify/polaris';
import React from 'react';
import { Badge, ClipboardButton, PolarisChevronDownIcon } from '@/components';

export const BioUrlSection: React.FC<TBioUrlSectionProps> = (props) => {
	const { primaryUrl, platformUrl, title = 'Your Bio Link' } = props;

	const [selectedUrl, setSelectedUrl] = React.useState<'primary' | 'platform'>('primary');
	const currentUrl = React.useMemo(
		() => (selectedUrl === 'primary' ? primaryUrl : platformUrl),
		[selectedUrl, primaryUrl, platformUrl]
	);
	const currentLabel = React.useMemo(
		() => (selectedUrl === 'primary' ? 'Shopify' : 'Platform'),
		[selectedUrl]
	);

	const handleUrlTypeChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedUrl(e.target.value as 'primary' | 'platform');
	}, []);

	return (
		<s-section>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Text as="h2" variant="headingMd">
						{title}
					</Text>
					<div className="flex items-center gap-2">
						{/* Badge Dropdown */}
						<div className="relative" onClick={(e) => e.stopPropagation()}>
							<select
								value={selectedUrl}
								onChange={handleUrlTypeChange}
								className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							>
								<option value="primary">Shopify</option>
								<option value="platform">Platform</option>
							</select>
							<s-badge tone="neutral">
								<div className="flex items-center gap-1">
									<span className="truncate">{currentLabel}</span>
									<PolarisChevronDownIcon className="h-3 w-3 flex-shrink-0" />
								</div>
							</s-badge>
						</div>
						<Badge tone="magic">Main</Badge>
					</div>
				</div>

				<div className="relative max-w-md">
					<TextField label="" value={currentUrl} readOnly autoComplete="off" />
					<div className="absolute top-0 right-0 z-50 flex h-full items-center rounded-r-lg bg-[#F2F2F2] pr-2">
						<ClipboardButton textToCopy={currentUrl} size="micro" variant="tertiary" />
					</div>
				</div>
			</div>
		</s-section>
	);
};

interface TBioUrlSectionProps {
	primaryUrl: string;
	platformUrl: string;
	title?: string;
}
