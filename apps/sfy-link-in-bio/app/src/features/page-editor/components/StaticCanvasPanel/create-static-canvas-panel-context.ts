import { createState, TState } from 'feature-state';
import { TPageEditor } from '../../lib';

export function createStaticCanvasPanelContext(editor: TPageEditor): TStaticCanvasPanelContext {
	return {
		editor,
		viewMode: createState<TViewMode>('desktop'),
		switchViewMode(mode: TViewMode) {
			this.viewMode.set(mode);
		}
	};
}

export interface TStaticCanvasPanelContext {
	editor: TPageEditor;
	viewMode: TState<TViewMode, []>;
	switchViewMode: (mode: TViewMode) => void;
}

export type TViewMode = 'desktop' | 'mobile';
