import {
	aboutNodeMetadata,
	createThemeOverrideTokens,
	linkNodeMetadata,
	TClassicAboutNodeBundle,
	TLinkNode,
	TTheme
} from '@repo/editor';
import { TNodeState, TPageEditor } from '../../../../lib';

export function applyTheme(theme: TTheme, editor: TPageEditor) {
	const prevThemeKey = editor.tokenMap._v['theme.key']?.value;

	// Reset LinkPop node styles to ensure they are all linked to the design tokens
	if (prevThemeKey === 'linkpop') {
		for (const node of Object.values(editor.nodeMap)) {
			switch (node.type) {
				case 'about': {
					(node as TNodeState<TClassicAboutNodeBundle>)._v.image =
						aboutNodeMetadata.bundleMap.classic.image;
					node._notify();
					break;
				}
				case 'link': {
					(node as TNodeState<TLinkNode>)._v.appearance =
						linkNodeMetadata.bundleMap.classic.appearance;
					node._notify();
					break;
				}
				default:
				// do nothing
			}
		}
	}

	// Apply theme override tokens
	const themeOverrideTokens = createThemeOverrideTokens(theme);
	themeOverrideTokens.forEach((token) => {
		editor.tokenMap._v[token.key] = token;
	});
	editor.tokenMap._notify();

	// Register fonts
	editor.registerFont({
		family: theme.typography.display.fontFamily,
		weight: theme.typography.display.fontWeight
	});
	editor.registerFont({
		family: theme.typography.body.fontFamily,
		weight: theme.typography.body.fontWeight
	});
}
