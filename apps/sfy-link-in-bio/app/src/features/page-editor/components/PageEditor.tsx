import { useListener } from 'feature-react';
import React from 'react';
import { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { useBoundingRectObserver } from '@/hooks';
import { ResizablePanelGroup } from '../../../components';
import { TPageEditor } from '../lib';
import { EditorView } from './panel';

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
		// Single panel modification seems to be the only reliable way to force recompute - tested balanced approach.
		// Balanced changes get rounded away during validation, single panel change passes areEqual reliably but violates 100% rule.
		// See setLayout logic: https://github.com/bvaughn/react-resizable-panels/blob/f65a4815c73d43ae884c0465d59da76991f4d14e/packages/react-resizable-panels/src/PanelGroup.ts#L184
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

	// Force panel layout recompute when views change to prevent flex-1 layout issues.
	// Without this, dynamic views wouldn't recalculate their layout and stay at flex-1.
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
				// TODO: Fix panel storage explosion issue
				// Currently react-resizable-panels stores each unique panel combination separately.
				// This means nav-panel has different sizes in different views when it should be consistent.
				// Example: nav-panel is 3.52% in settings but might be different in layers view.
				// We need custom storage that groups panels logically (nav=nav, settings-content=all settings panels).
				// autoSaveId={'page-editor'}
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
