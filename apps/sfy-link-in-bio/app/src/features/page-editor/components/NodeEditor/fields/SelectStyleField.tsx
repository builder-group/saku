import { Select, SelectProps, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { TStyleProperty } from '../../../types';

export const SelectStyleField = <GNodeValue, GParentNodeValue, GValue>(
	props: TSelectStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
) => {
	const {
		label,
		node,
		parentNode,
		nodeValueMapper,
		parentValueMapper,
		nodeValueSetter,
		...selectProps
	} = props;

	const currentValue = useCompute(node, nodeValueMapper);
	const parentValue =
		useCompute(parentNode, (parent) => (parent != null ? parentValueMapper?.(parent) : null)) ??
		undefined;
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
			if (isInherited) {
				return;
			}

			const convertedValue: TStyleProperty<GValue> | undefined =
				newValue === '' ? undefined : (newValue as GValue);

			nodeValueSetter(node, convertedValue);
		},
		[node, nodeValueSetter, isInherited]
	);

	const handleToggleInheritance = React.useCallback(() => {
		if (parentValue == null) {
			return;
		}

		// Unsyncing: Set to parent value or undefined
		if (currentValue === 'inherit') {
			nodeValueSetter(node, parentValue);
		}
		// Syncing: Set to inherit
		else {
			nodeValueSetter(node, 'inherit' as GValue);
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
						className="flex items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={isInherited ? 'Unlink from parent' : 'Link to parent'}
					>
						{isInherited ? <LinkOffIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
					</button>
				)}
			</div>
			<Select
				{...selectProps}
				label={label}
				labelHidden
				value={displayValue}
				onChange={handleChange}
				disabled={isInherited || selectProps.disabled}
			/>
		</div>
	);
};

export interface TSelectStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
	extends Omit<SelectProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TStyleProperty<GValue> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends unknown ? GValue | undefined : TStyleProperty<GValue>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => GValue | undefined;
}
