import {
	inheritStyle,
	isInheritedStyle,
	resolveStyleReference,
	TStyleReference
} from '@repo/editor';
import { Badge, Text, TextField, TextFieldProps, Tooltip } from '@shopify/polaris';
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
		min,
		max,
		...textFieldProps
	} = props;

	const currentValue = useCompute(node, nodeValueMapper);
	const parentValue = useCompute(parentNode, (parent) =>
		parent != null ? parentValueMapper?.(parent) : undefined
	);
	const isValueInherited = React.useMemo(() => isInheritedStyle(currentValue), [currentValue]);
	const displayValue = React.useMemo(() => {
		const resolvedValue = resolveStyleReference(currentValue, parentValue);
		return resolvedValue != null ? String(resolvedValue) : '';
	}, [currentValue, parentValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (isValueInherited) {
				return;
			}

			let convertedValue: TStyleReference<GValue> | undefined =
				newValue === '' ? undefined : (newValue as GValue);
			if (textFieldProps.type === 'number' && newValue !== '') {
				let num = Number(newValue);
				if (typeof min === 'number' && num < min) num = min;
				if (typeof max === 'number' && num > max) num = max;
				convertedValue = num as GValue;
			}

			nodeValueSetter(
				node,
				convertedValue as GParentNodeValue extends never
					? GValue | undefined
					: TStyleReference<GValue>
			);
		},
		[node, nodeValueSetter, textFieldProps.type, isValueInherited, min, max]
	);

	const handleToggleInheritance = React.useCallback(() => {
		if (parentValue == null) {
			return;
		}

		// Unsyncing: Set to parent value or undefined
		if (isValueInherited) {
			nodeValueSetter(node, parentValue);
		}
		// Syncing: Set to inherit
		else {
			nodeValueSetter(
				node,
				inheritStyle() as GParentNodeValue extends never
					? GValue | undefined
					: TStyleReference<GValue>
			);
		}
	}, [node, nodeValueSetter, isValueInherited, parentValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<TextField
			{...textFieldProps}
			label={label}
			labelHidden
			value={displayValue}
			onChange={handleChange}
			readOnly={isValueInherited}
			{...(textFieldProps.type === 'number' ? { min, max } : {})}
		/>
	);

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
							isValueInherited
								? `Unlink from parent (${parentValue})`
								: `Link to parent (${parentValue})`
						}
					>
						{isValueInherited ? (
							<LinkOffIcon className="h-3 w-3" />
						) : (
							<LinkIcon className="h-3 w-3" />
						)}
					</button>
				)}
			</div>
			<div className="relative">
				{isValueInherited ? (
					<Tooltip
						content={
							<span>
								This field is inherited from the parent. Click the unlink icon (
								<LinkOffIcon className="inline h-3 w-3" />) to set a custom value.
							</span>
						}
						preferredPosition="below"
						hoverDelay={500}
					>
						<div className="relative">
							{InputComponent}
							<div className="pointer-events-none absolute inset-y-0 right-0 z-50 flex items-center rounded-r-lg bg-[#F2F2F2] pr-1">
								<Badge size="small">Inherited</Badge>
							</div>
						</div>
					</Tooltip>
				) : (
					InputComponent
				)}
			</div>
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
		value: GParentNodeValue extends never ? GValue | undefined : TStyleReference<GValue>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => GValue | undefined;
	min?: number;
	max?: number;
}
