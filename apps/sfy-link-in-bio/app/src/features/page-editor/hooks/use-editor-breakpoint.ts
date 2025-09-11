import { useCompute } from 'feature-react';
import { isBreakpointActive, TBreakpoint } from '@/lib/ui/get-breakpoint';
import { TPageEditor } from '../lib';

export function useEditorBreakpoint(editor: TPageEditor, targetBreakpoint: TBreakpoint): boolean {
	return useCompute(editor.breakpoint, ({ value }) => isBreakpointActive(value, targetBreakpoint));
}
