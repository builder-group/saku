import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Knob, LinkIcon, LinkOffIcon } from '@/components';
import { TStyleProperty } from '../../../types';

export const ToggleStyleField = <GNode, GParentNode>(
	props: TToggleStyleFieldProps<GNode, GParentNode>
) => {
	const {
		label,
		node,
		parentNode,
		nodeValueMapper,
		parentValueMapper,
		nodeValueSetter,
		ariaLabel
	} = props;

	const currentValue = useCompute(node, nodeValueMapper);
	const parentValue = useCompute(parentNode, (parent) => parentValueMapper?.(parent));
	const isInherited = React.useMemo(() => currentValue === 'inherit', [currentValue]);
	const selected = React.useMemo(() => {
		if (isInherited) {
			return parentValue === true;
		} else {
			return currentValue === true;
		}
	}, [currentValue, parentValue, isInherited]);

	const handleToggle = React.useCallback(() => {
		if (isInherited) return;

		node.set((prev) => nodeValueSetter(prev, !currentValue));
	}, [node, nodeValueSetter, isInherited, currentValue]);

	const handleToggleInheritance = React.useCallback(() => {
		// Unsyncing: Set to parent value or false
		if (currentValue === 'inherit') {
			node.set((prev) => nodeValueSetter(prev, parentValue === true));
		}
		// Syncing: Set to inherit
		else {
			node.set((prev) => nodeValueSetter(prev, 'inherit'));
		}
	}, [node, nodeValueSetter, currentValue, parentValue]);

	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between">
				<Text as="span" variant="bodySm" tone="subdued">
					{label}
				</Text>
				{parentValue != null && (
					<button
						type="button"
						onClick={handleToggleInheritance}
						className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={isInherited ? 'Unlink from parent' : 'Link to parent'}
					>
						{isInherited ? <LinkOffIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
					</button>
				)}
			</div>
			<div className="flex items-center justify-between">
				<Knob
					ariaLabel={ariaLabel || `Toggle ${label}`}
					selected={selected}
					onClick={handleToggle}
					disabled={isInherited}
				/>
			</div>
		</div>
	);
};

export interface TToggleStyleFieldProps<GNode, GParentNode> {
	label: string;
	node: TState<GNode, []>;
	parentNode: TState<GParentNode, []>;
	nodeValueMapper: (node: GNode) => TStyleProperty<boolean> | undefined;
	nodeValueSetter: (node: GNode, value: TStyleProperty<boolean> | undefined) => GNode;
	parentValueMapper?: (parent: GParentNode) => boolean | undefined;
	ariaLabel?: string;
}
