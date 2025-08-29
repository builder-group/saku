import { createState, TState } from 'feature-state';
import { logger } from '@/environment';
import { EditorSiteResolveContext, TPageEditor } from '../../../../lib';
import { resolvePageNode } from '../../../../nodes';
import { TResolvedNode } from '../../../../types';

export function createPreviewPanelContext(editor: TPageEditor): TPreviewPanelContext {
	const resolvedPageNodeResult = resolvePageNode(editor.getRootNode()._v, {
		site: new EditorSiteResolveContext(editor)
	});
	if (resolvedPageNodeResult.isErr()) {
		editor.shopify.toast.show('Failed to resolve page node');
		logger.warn('Failed to resolve page node', {
			error: resolvedPageNodeResult.error
		});
	}

	return {
		editor,
		previewedNode: createState<TResolvedNode | null>(
			resolvedPageNodeResult.isOk() ? resolvedPageNodeResult.value : null
		),
		viewMode: createState<TPreviewPanelViewMode>('desktop'),
		switchViewMode(mode: TPreviewPanelViewMode) {
			this.viewMode.set(mode);
		}
	};
}

export interface TPreviewPanelContext {
	editor: TPageEditor;
	previewedNode: TState<TResolvedNode | null, []>;
	viewMode: TState<TPreviewPanelViewMode, []>;
	switchViewMode: (mode: TPreviewPanelViewMode) => void;
}

export type TPreviewPanelViewMode = 'desktop' | 'mobile';
