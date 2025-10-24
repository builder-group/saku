import { TRichContent } from '@repo/editor';
import { TextField, TextFieldProps } from '@shopify/polaris';
import React from 'react';
import { Badge, PolarisChevronDownIcon } from '@/components';

export const RichContentField: React.FC<TRichContentFieldProps> = (props) => {
	const { value, onChange, ...textFieldProps } = props;

	const formatLabel = React.useMemo(() => {
		switch (value.type) {
			case 'html':
				return 'HTML';
			case 'markdown':
				return 'Markdown';
			case 'text':
				return 'Plain Text';
		}
	}, [value.type]);

	const handleTextChange = React.useCallback(
		(newValue: string) => {
			onChange({ ...value, value: newValue });
		},
		[value, onChange]
	);

	const handleFormatChange = React.useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const newType = e.target.value as TRichContent['type'];
			onChange({ type: newType, value: value.value });
		},
		[value, onChange]
	);

	return (
		<div className="relative">
			<TextField {...textFieldProps} value={value.value} onChange={handleTextChange} />
			<div className="absolute right-2 bottom-2 z-20" onClick={(e) => e.stopPropagation()}>
				<div className="relative">
					<select
						value={value.type}
						onChange={handleFormatChange}
						className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					>
						<option value="text">Plain Text</option>
						<option value="markdown">Markdown</option>
						<option value="html">HTML</option>
					</select>
					<Badge tone="neutral">
						<div className="flex items-center gap-1">
							<span className="truncate text-xs">{formatLabel}</span>
							<PolarisChevronDownIcon className="h-3 w-3 shrink-0" />
						</div>
					</Badge>
				</div>
			</div>
		</div>
	);
};

interface TRichContentFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
	value: TRichContent;
	onChange: (value: TRichContent) => void;
}
