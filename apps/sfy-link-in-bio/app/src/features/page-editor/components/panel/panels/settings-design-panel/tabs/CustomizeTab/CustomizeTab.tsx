import { reconstructThemeFromTokens } from '@repo/editor';
import React from 'react';
import { logger } from '@/environment';
import { TPageEditor } from '../../../../../../lib';
import { ThemeEditor } from './ThemeEditor';
import { ThemeUnavailable } from './ThemeUnavailable';

export const CustomizeTab: React.FC<TCustomizeTabProps> = (props) => {
	const { editor } = props;

	const currentTheme = React.useMemo(() => {
		const variableTokens = Object.values(editor.tokenMap._v);
		const [isReconstructedThemeOk, reconstructedThemeErr, reconstructedTheme] =
			reconstructThemeFromTokens(variableTokens);
		if (!isReconstructedThemeOk) {
			logger.error('Failed to reconstruct theme from tokens', reconstructedThemeErr);
			return null;
		}
		return reconstructedTheme;
	}, [editor]);

	if (currentTheme == null) {
		return <ThemeUnavailable />;
	}

	return <ThemeEditor theme={currentTheme} editor={editor} />;
};

interface TCustomizeTabProps {
	editor: TPageEditor;
}
