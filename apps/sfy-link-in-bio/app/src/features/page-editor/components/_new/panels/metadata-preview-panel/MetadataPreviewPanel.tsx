import { Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { ResizablePanel } from '@/components';
import { EditorSiteResolveContext, TPageEditor } from '../../../../lib';
import { resolvePageMetadata } from '../../../../nodes';
import { PanelHeader } from '../../../PanelHeader';
import { DefaultOGPreview, FacebookOGPreview, LinkedInOGPreview, XOGPreview } from './previews';
import { tabs } from './tabs';

export const MetadataPreviewPanel: React.FC<TMetadataPreviewPanelProps> = (props) => {
	const { editor, order } = props;

	const [tabIndex, setTabIndex] = React.useState(0);

	const metadata = useCompute(
		editor.getRootNode(),
		({ value }) => resolvePageMetadata(value, { site: new EditorSiteResolveContext(editor) }),
		[editor]
	);

	const hostname = React.useMemo(() => {
		try {
			const url = new URL(editor.site.url);
			return url.hostname;
		} catch {
			return 'saku.com';
		}
	}, [editor.site.url]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTabChange = React.useCallback((tabIndex: number) => {
		setTabIndex(tabIndex);
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	const renderPreview = React.useCallback(() => {
		const previewProps = {
			title: metadata.title,
			description: metadata.description,
			image: metadata.image,
			hostname
		};

		switch (tabIndex) {
			case 0:
				return <DefaultOGPreview {...previewProps} />;
			case 1:
				return <FacebookOGPreview {...previewProps} />;
			case 2:
				return <LinkedInOGPreview {...previewProps} />;
			case 3:
				return <XOGPreview {...previewProps} />;
			default:
				return <DefaultOGPreview {...previewProps} />;
		}
	}, [metadata, tabIndex, hostname]);

	return (
		<ResizablePanel id="metadata-preview-panel" order={order} className="relative">
			<div className="flex h-full min-w-96 flex-col bg-white">
				<PanelHeader>
					{/* Offset 8px Tab padding which can't be removed */}
					<div className="-ml-2">
						<Tabs tabs={tabs} selected={tabIndex} onSelect={handleTabChange} />
					</div>
				</PanelHeader>
				<div className="flex-1 overflow-auto p-4">
					<div className="max-w-md">{renderPreview()}</div>
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TMetadataPreviewPanelProps {
	editor: TPageEditor;
	order: number;
}
