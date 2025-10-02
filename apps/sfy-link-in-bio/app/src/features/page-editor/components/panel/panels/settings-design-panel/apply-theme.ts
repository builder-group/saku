import {
	aboutNodeMetadata,
	createThemeOverrideTokens,
	linkNodeMetadata,
	TAboutNode,
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
					(node as TNodeState<TAboutNode>)._v.textXl = aboutNodeMetadata.default.textXl;
					(node as TNodeState<TAboutNode>)._v.text = aboutNodeMetadata.default.text;
					(node as TNodeState<TAboutNode>)._v.image = aboutNodeMetadata.default.image;
					node._notify();
					break;
				}
				case 'link': {
					(node as TNodeState<TLinkNode>)._v.appearance = linkNodeMetadata.default.appearance;
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
		family: theme.typography.heading.fontFamily,
		weight: theme.typography.heading.fontWeight
	});
	editor.registerFont({
		family: theme.typography.text.fontFamily,
		weight: theme.typography.text.fontWeight
	});
}
