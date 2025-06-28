import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { TStyleProperty } from '../../../types';

export const TextStyleField = <GNode, GParentNode, TValue>(
	props: TTextStyleFieldProps<GNode, GParentNode, TValue>
) => {
	const {
		label,
		node,
		parentNode,
		nodeValueMapper,
		parentValueMapper,
		nodeValueSetter,
		...textFieldProps
	} = props;

	const currentValue = useCompute(node, nodeValueMapper);
	const parentValue = useCompute(parentNode, (parent) => parentValueMapper?.(parent));
	const isInherited = React.useMemo(() => currentValue === 'inherit', [currentValue]);
	const displayValue = React.useMemo(() => {
		if (isInherited) {
			return parentValue != null ? String(parentValue) : '';
		} else if (currentValue != null && currentValue !== 'inherit') {
			return String(currentValue);
		}
		return '';
	}, [currentValue, parentValue, isInherited]);

	const handleChange = React.useCallback(
		(newValue: string) => {
			// Convert to appropriate type based on the input
			let convertedValue: TValue | undefined = newValue === '' ? undefined : (newValue as TValue);

			// If it's a number field, convert to number
			if (textFieldProps.type === 'number' && newValue !== '') {
				convertedValue = Number(newValue) as TValue;
			}

			node.set((prev) => nodeValueSetter(prev, convertedValue));
		},
		[node, nodeValueSetter, textFieldProps.type]
	);

	const handleToggleInheritance = React.useCallback(() => {
		// Unsyncing: Set to parent value or undefined
		if (currentValue === 'inherit') {
			node.set((prev) => nodeValueSetter(prev, parentValue));
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
			<TextField
				{...textFieldProps}
				label={label}
				labelHidden
				value={displayValue}
				onChange={handleChange}
				readOnly={isInherited}
			/>
		</div>
	);
};

export interface TTextStyleFieldProps<GNode, GParentNode, TValue>
	extends Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	label: string;
	node: TState<GNode, []>;
	parentNode: TState<GParentNode, []>;
	nodeValueMapper: (node: GNode) => TStyleProperty<TValue> | undefined;
	nodeValueSetter: (node: GNode, value: TStyleProperty<TValue> | undefined) => GNode;
	parentValueMapper?: (parent: GParentNode) => TValue | undefined;
}
