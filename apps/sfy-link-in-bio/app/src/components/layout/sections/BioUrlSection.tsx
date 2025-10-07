import { Text, TextField } from '@shopify/polaris';
import React from 'react';
import { PolarisChevronDownIcon } from '@/components/display';
import { ClipboardButton } from '@/components/input';

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
						<s-badge tone="success">Main</s-badge>
					</div>
				</div>

				<TextField
					label=""
					value={currentUrl}
					readOnly
					autoComplete="off"
					connectedRight={<ClipboardButton textToCopy={currentUrl} />}
				/>
			</div>
		</s-section>
	);
};

interface TBioUrlSectionProps {
	primaryUrl: string;
	platformUrl: string;
	title?: string;
}
