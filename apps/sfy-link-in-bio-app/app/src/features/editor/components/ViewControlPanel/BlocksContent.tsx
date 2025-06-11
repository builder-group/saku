import { notEmpty } from '@blgc/utils';
import { Icon, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { DeleteIcon, DragHandleIcon, PlusCircleIcon } from '@/components';
import { blocksMetadataMap } from '../../environment/';
import { TEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';

export const BlocksContent: React.FC<TBlocksContentProps> = (props) => {
	const { editor } = props;

	const blocks = useCompute(editor.blocks, (blocks) => {
		return blocks.map((blockId) => editor.blockMap[blockId]).filter(notEmpty);
	});

	const handleDeleteBlock = React.useCallback(
		(blockId: string) => {
			editor.removeBlock(blockId);
		},
		[editor]
	);

	return (
		<>
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Blocks
				</Text>
			</PanelHeader>
			<div className="p-2.5">
				<div className="flex flex-col gap-2">
					{blocks.map((block) => {
						const metadata = blocksMetadataMap[block._v.type];

						return (
							<div
								key={block._v.id}
								className="group flex h-[30px] w-full cursor-pointer items-center rounded-lg px-2.5 hover:bg-gray-50"
							>
								<div className="flex w-full items-center gap-1.5">
									<div>
										<div className="group-hover:hidden">
											{metadata?.icon && <Icon source={metadata.icon} />}
										</div>
										<div className="hidden group-hover:block">
											<Icon source={DragHandleIcon} />
										</div>
									</div>
									<div className="grow">
										<Text as="p" variant="bodySm">
											{metadata?.label || block._v.type}
										</Text>
									</div>
									<div
										className="z-50 hidden cursor-pointer rounded-lg p-1 group-hover:block hover:text-red-500"
										onClick={() => handleDeleteBlock(block._v.id)}
									>
										<Icon source={DeleteIcon} />
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div className="mt-1.5 flex h-[34px] cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[#005BD3] hover:bg-gray-50">
					<div>
						<Icon source={PlusCircleIcon} />
					</div>
					<Text as="p" variant="bodyMd">
						Add block
					</Text>
				</div>
			</div>
		</>
	);
};

interface TBlocksContentProps {
	editor: TEditor;
}
