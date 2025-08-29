import { useListener } from 'feature-react';
import React from 'react';
import { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { useBoundingRectObserver } from '@/hooks';
import { ResizablePanelGroup } from '../../../../components';
import { TPageEditor } from '../../lib';
import { EditorView } from './views';

export const PageEditor: React.FC<TPageEditorProps> = (props) => {
	const { editor } = props;

	const panelGroupRef = React.useRef<ImperativePanelGroupHandle>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const forcePanelGroupLayoutRecompute = React.useCallback(() => {
		const layout = panelGroupRef.current?.getLayout();
		if (!layout?.length) {
			return;
		}

		const modifiedLayout = [...layout];
		// @ts-expect-error -- we check the length above
		modifiedLayout[0] += 1e-6;
		panelGroupRef.current?.setLayout(modifiedLayout);
	}, []);

	// =========================================================================
	// Effects
	// =========================================================================

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

	// Force panel layout recompute when views change to prevent flex-1 layout issues
	// Without this, dynamic views wouldn't recalculate their layout and stay at flex-1
	// TODO: Find better solution without layout manipulation
	useListener(editor.activeSettingsSection, forcePanelGroupLayoutRecompute);
	useListener(editor.activeView, forcePanelGroupLayoutRecompute);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div ref={editor.editorRef} className="flex h-screen w-full flex-col">
			<ResizablePanelGroup
				ref={panelGroupRef}
				direction="horizontal"
				className="flex-1"
				// onLayout={(sizes) => {
				// 	logger.info('recompute layout', { sizes });
				// }}
			>
				<EditorView editor={editor} />
			</ResizablePanelGroup>
		</div>
	);
};

interface TPageEditorProps {
	editor: TPageEditor;
}
