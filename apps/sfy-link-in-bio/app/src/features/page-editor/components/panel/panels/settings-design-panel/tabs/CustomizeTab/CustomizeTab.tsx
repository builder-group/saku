import { reconstructThemeFromTokens } from '@repo/editor';
import React from 'react';
import { TPageEditor } from '../../../../../../lib';
import { ThemeEditor } from './ThemeEditor';
import { ThemePlaceholder } from './ThemePlaceholder';

export const CustomizeTab: React.FC<TCustomizeTabProps> = (props) => {
	const { editor } = props;

	const currentTheme = React.useMemo(() => {
		const variableTokens = Object.values(editor.tokenMap._v);
		const result = reconstructThemeFromTokens(variableTokens);
		return result.isOk() ? result.value : null;
	}, [editor]);

	if (currentTheme == null) {
		return <ThemePlaceholder />;
	}

	return <ThemeEditor theme={currentTheme} editor={editor} />;
};

interface TCustomizeTabProps {
	editor: TPageEditor;
}
