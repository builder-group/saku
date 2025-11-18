import { Icon, Text, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import {
	AccordionSection,
	JsonPreview,
	PolarisChevronDownIcon,
	PolarisChevronUpIcon,
	PolarisDeleteIcon,
	PolarisDuplicateIcon
} from '@/components';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeContentEditor } from '../../../../node';

export const ContentTab: React.FC<TContentTabProps> = (props) => {
	const { nodeState, editor } = props;

	return (
		<>
			<LayerActionsSection nodeState={nodeState} editor={editor} />
			<NodeContentEditor
				nodeState={nodeState}
				editor={editor}
				className="border-b border-neutral-200"
			/>
			{editor.isDebug() && <DebugSection nodeState={nodeState} />}
		</>
	);
};

interface TContentTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}

const DebugSection: React.FC<TDebugSectionProps> = (props) => {
	const { nodeState } = props;
	const value = useCompute(nodeState, ({ value }) => value);

	return (
		<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
			<div className="space-y-1 px-4">
				<Text as="span" variant="bodySm" tone="subdued">
					JSON
				</Text>
				<JsonPreview data={value} />
			</div>
		</AccordionSection>
	);
};

interface TDebugSectionProps {
	nodeState: TNodeState;
}

const LayerActionsSection: React.FC<TLayerActionsSectionProps> = (props) => {
	const { nodeState, editor } = props;

	const nodeId = useCompute(nodeState, ({ value: node }) => node.id);
	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);
	const { siblings, currentIndex, canMoveUp, canMoveDown } = useCompute(
		parentNodeState,
		({ value: parentNode }) => {
			const index = parentNode.children.indexOf(nodeId);

			return {
				siblings: parentNode.children,
				currentIndex: index,
				canMoveUp: index > 0,
				canMoveDown: index >= 0 && index < parentNode.children.length - 1
			};
		},
		[nodeId]
	);

	const handleDelete = React.useCallback(() => {
		editor.removeNode(nodeId);
	}, [editor, nodeId]);

	const handleDuplicate = React.useCallback(() => {
		const copiedNodeId = editor.copyNode(nodeId);
		if (copiedNodeId != null) {
			editor.selectNode(copiedNodeId);
		}
	}, [editor, nodeId]);

	const handleMoveUp = React.useCallback(() => {
		if (!canMoveUp) {
			return;
		}
		const previousSiblingId = siblings[currentIndex - 1];
		if (previousSiblingId != null) {
			editor.swapNodes(nodeId, previousSiblingId);
		}
	}, [editor, nodeId, canMoveUp, currentIndex, siblings]);

	const handleMoveDown = React.useCallback(() => {
		if (!canMoveDown) {
			return;
		}
		const nextSiblingId = siblings[currentIndex + 1];
		if (nextSiblingId != null) {
			editor.swapNodes(nodeId, nextSiblingId);
		}
	}, [editor, nodeId, canMoveDown, currentIndex, siblings]);

	return (
		<div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2">
			<Text as="span" variant="bodySm" tone="subdued">
				Layer Actions
			</Text>
			<div className="flex gap-1">
				<Tooltip content="Move layer up" preferredPosition="below">
					<button
						type="button"
						onClick={handleMoveUp}
						disabled={!canMoveUp}
						className="cursor-pointer rounded-lg p-1 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-30"
						aria-label="Move layer up"
					>
						<Icon source={PolarisChevronUpIcon} />
					</button>
				</Tooltip>
				<Tooltip content="Move layer down" preferredPosition="below">
					<button
						type="button"
						onClick={handleMoveDown}
						disabled={!canMoveDown}
						className="cursor-pointer rounded-lg p-1 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-30"
						aria-label="Move layer down"
					>
						<Icon source={PolarisChevronDownIcon} />
					</button>
				</Tooltip>
				<Tooltip content="Duplicate layer" preferredPosition="below">
					<button
						type="button"
						onClick={handleDuplicate}
						className="cursor-pointer rounded-lg p-1 hover:bg-neutral-200"
						aria-label="Duplicate layer"
					>
						<Icon source={PolarisDuplicateIcon} />
					</button>
				</Tooltip>
				<Tooltip content="Delete layer" preferredPosition="below">
					<button
						type="button"
						onClick={handleDelete}
						className="cursor-pointer rounded-lg p-1 hover:bg-neutral-200 hover:text-red-500"
						aria-label="Delete layer"
					>
						<Icon source={PolarisDeleteIcon} />
					</button>
				</Tooltip>
			</div>
		</div>
	);
};

interface TLayerActionsSectionProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
