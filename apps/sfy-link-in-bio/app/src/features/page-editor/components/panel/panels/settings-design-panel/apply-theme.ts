import {
	aboutNodeMetadata,
	createTokensFromTheme,
	hexToRgba,
	isRgba,
	linkNodeMetadata,
	TAboutNode,
	TLinkNode,
	TMixinToken,
	TTheme
} from '@repo/editor';
import { createState } from 'feature-state';
import { TNodeState, TPageEditor } from '../../../../lib';

export function applyTheme(theme: TTheme, editor: TPageEditor) {
	const prevThemeKey = editor.variableTokenMap._v['theme.key']?.value;

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

	// Apply tokens for elements (cards, text, buttons)
	const tokens = createTokensFromTheme(theme);
	const toNotifyMixinKeys = new Set<TMixinToken['mixinKey']>();
	let notifyVariableTokenMap = false;
	tokens.forEach((token) => {
		switch (token.type) {
			case 'mixin': {
				if (editor.mixinTokenMap[token.mixinKey] == null) {
					editor.mixinTokenMap[token.mixinKey] = createState({});
				}
				// @ts-expect-error - we ensure object exists above
				editor.mixinTokenMap[token.mixinKey]._v[token.key] = token;
				toNotifyMixinKeys.add(token.mixinKey);
				break;
			}
			case 'variable': {
				editor.variableTokenMap._v[token.key] = token;
				notifyVariableTokenMap = true;
				break;
			}
		}
	});
	toNotifyMixinKeys.forEach((key) => {
		editor.mixinTokenMap[key]?._notify();
	});
	if (notifyVariableTokenMap) {
		editor.variableTokenMap?._notify();
	}

	// Register fonts
	editor.registerFontFamily(theme.typography.heading.fontFamily);
	editor.registerFontFamily(theme.typography.text.fontFamily);

	// Apply page background directly to the root node
	const rootNode = editor.getRootNode();
	rootNode.set((node) => ({
		...node,
		autoLayout: {
			...node.autoLayout,
			verticalGap: theme.gap ?? 24
		},
		fill: {
			paint: {
				type: 'solid',
				color: isRgba(theme.color.base200) ? theme.color.base200 : hexToRgba(theme.color.base200)
			},
			opacity: 1
		}
	}));
}
