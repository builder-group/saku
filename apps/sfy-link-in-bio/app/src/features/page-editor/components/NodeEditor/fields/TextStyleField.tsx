import { TStyleReference } from '@repo/editor';
import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';

export const TextStyleField = <GNodeValue, GParentNodeValue, GValue>(
	props: TTextStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
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
	const parentValue = useCompute(parentNode, (parent) =>
		parent != null ? parentValueMapper?.(parent) : undefined
	);
	const isInherited = React.useMemo(() => currentValue === 'inherit', [currentValue]);
	const displayValue = React.useMemo(() => {
		if (isInherited && parentValue != null) {
			return String(parentValue);
		} else if (currentValue != null && currentValue !== 'inherit') {
			return String(currentValue);
		}
		return '';
	}, [currentValue, parentValue, isInherited]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (isInherited) {
				return;
			}

			let convertedValue: TStyleReference<GValue> | undefined =
				newValue === '' ? undefined : (newValue as GValue);
			if (textFieldProps.type === 'number' && newValue !== '') {
				convertedValue = Number(newValue) as GValue;
			}

			nodeValueSetter(node, convertedValue);
		},
		[node, nodeValueSetter, textFieldProps.type, isInherited]
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

	// =========================================================================
	// UI
	// =========================================================================

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
						title={
							isInherited
								? `Unlink from parent (${parentValue})`
								: `Link to parent (${parentValue})`
						}
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

export interface TTextStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
	extends Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TStyleReference<GValue> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends unknown ? GValue | undefined : TStyleReference<GValue>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => GValue | undefined;
}
