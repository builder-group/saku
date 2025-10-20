import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { PolarisPageIcon } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../../../lib';

export const PageItem: React.FC<TPageItemProps> = (props) => {
	const { editor, className } = props;

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const isSelected = useCompute(
		editor.selectedNodeId,
		({ value: selectedNodeId }) => selectedNodeId === rootNode._v.id
	);

	const handleSelectPage = React.useCallback(() => {
		editor.selectedNodeId.set(rootNode._v.id);
	}, [editor, rootNode]);

	return (
		<div
			className={cn(
				'group flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-neutral-50',
				{
					'bg-neutral-100': isSelected
				},
				className
			)}
			onClick={handleSelectPage}
			role="button"
			tabIndex={0}
			aria-selected={isSelected}
		>
			<PolarisPageIcon className="h-5 w-5" />
			<Text as="p" variant="bodyMd">
				Page
			</Text>
		</div>
	);
};

interface TPageItemProps {
	editor: TPageEditor;
	className?: string;
}
