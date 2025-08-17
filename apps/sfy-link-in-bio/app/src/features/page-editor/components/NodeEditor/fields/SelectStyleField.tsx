import { inherit, isInherited, resolveReference, TReference } from '@repo/editor';
import { Select, SelectProps, Text, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

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
		className,
		...selectProps
	} = props;

	const currentValue = useCompute(node, ({ value }) => nodeValueMapper(value));
	const parentValue = useCompute(parentNode, ({ value: parent }) =>
		parent != null ? parentValueMapper?.(parent) : undefined
	);
	const isValueInherited = React.useMemo(() => isInherited(currentValue), [currentValue]);
	const displayValue = React.useMemo(() => {
		const resolvedValue = resolveReference(currentValue, parentValue);
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

			const convertedValue: TReference<GValue> | undefined =
				newValue === '' ? undefined : (newValue as GValue);

			nodeValueSetter(
				node,
				convertedValue as GParentNodeValue extends never ? GValue | undefined : TReference<GValue>
			);
		},
		[node, nodeValueSetter, isValueInherited]
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
				inherit() as GParentNodeValue extends never ? GValue | undefined : TReference<GValue>
			);
		}
	}, [node, nodeValueSetter, isValueInherited, parentValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<Select
			{...selectProps}
			label={label}
			labelHidden
			value={displayValue}
			onChange={handleChange}
			disabled={isValueInherited || selectProps.disabled}
		/>
	);

	return (
		<div className={cn('space-y-1', className)}>
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
								<s-badge>Inherited</s-badge>
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

export interface TSelectStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
	extends Omit<SelectProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TReference<GValue> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends never ? GValue | undefined : TReference<GValue>,
		test?: GParentNodeValue
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => GValue | undefined;
	className?: string;
}
