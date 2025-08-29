import { useListener } from 'feature-react';
import React from 'react';
import { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { useBoundingRectObserver } from '@/hooks';
import { ResizablePanelGroup } from '../../../../components';
import { logger } from '../../../../environment';
import { TPageEditor } from '../../lib';
import { EditorView } from './views';

export const PageEditor: React.FC<TPageEditorProps> = (props) => {
	const { editor } = props;

	const panelGroupRef = React.useRef<ImperativePanelGroupHandle>(null);

	useBoundingRectObserver(
		editor.editorRef,
		editor.boundingRect._v,
		(rect) => {
			editor.boundingRect.set(rect);
			editor.isReady.set(true);
		},
		[editor]
	);

	React.useEffect(() => {
		editor.loadFonts();
	}, [editor]);

	// Force computation after settings section changed by alternating layout modifications
	// This ensures the panel group recalculates its layout and triggers any necessary re-renders
	useListener(
		editor.activeSettingsSection,
		() => {
			const layout = panelGroupRef.current?.getLayout();
			if (!layout?.length) {
				return;
			}

			const modifiedLayout = [...layout];
			// @ts-expect-error -- we check the length above
			modifiedLayout[0] += 1e-6;
			panelGroupRef.current?.setLayout(modifiedLayout);
		},
		[]
	);

	return (
		<div ref={editor.editorRef} className="flex h-screen w-full flex-col">
			<ResizablePanelGroup
				ref={panelGroupRef}
				direction="horizontal"
				className="flex-1"
				onLayout={(sizes) => {
					logger.info('recompute layout', { sizes });
				}}
			>
				<EditorView editor={editor} />
			</ResizablePanelGroup>
		</div>
	);
};

interface TPageEditorProps {
	editor: TPageEditor;
}
