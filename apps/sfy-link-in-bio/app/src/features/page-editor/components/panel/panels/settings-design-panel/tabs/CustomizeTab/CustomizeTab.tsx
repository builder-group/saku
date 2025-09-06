import { reconstructThemeFromTokens } from '@repo/editor';
import React from 'react';
import { TPageEditor } from '../../../../../../lib';
import { ThemeEditor } from './ThemeEditor';
import { ThemePlaceholder } from './ThemePlaceholder';

export const CustomizeTab: React.FC<TCustomizeTabProps> = (props) => {
	const { editor } = props;

	// Reconstruct current theme from tokens
	const currentTheme = React.useMemo(() => {
		const variableTokens = Object.values(editor.variableTokenMap._v);
		const result = reconstructThemeFromTokens(variableTokens);
		return result.isOk() ? result.value : null;
	}, [editor.variableTokenMap._v]);

	if (currentTheme == null) {
		return <ThemePlaceholder />;
	}

	return <ThemeEditor theme={currentTheme} editor={editor} />;
};

interface TCustomizeTabProps {
	editor: TPageEditor;
}
