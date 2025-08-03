import {
	inheritStyle,
	isInheritedStyle,
	resolveStyleReference,
	TStyleReference
} from '@repo/editor';
import { Text, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Knob, LinkIcon, LinkOffIcon } from '@/components';

export const ToggleStyleField = <GNodeValue, GParentNodeValue>(
	props: TToggleStyleFieldProps<GNodeValue, GParentNodeValue>
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

	const currentValue = useCompute(node, ({ value }) => nodeValueMapper(value));
	const parentValue = useCompute(parentNode, ({ value: parent }) =>
		parent != null ? parentValueMapper?.(parent) : undefined
	);
	const isValueInherited = React.useMemo(() => isInheritedStyle(currentValue), [currentValue]);
	const selected = React.useMemo(() => {
		const resolvedValue = resolveStyleReference(currentValue, parentValue);
		return resolvedValue === true;
	}, [currentValue, parentValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggle = React.useCallback(() => {
		if (isValueInherited) {
			return;
		}

		nodeValueSetter(node, !currentValue);
	}, [node, nodeValueSetter, isValueInherited, currentValue]);

	const handleToggleInheritance = React.useCallback(() => {
		if (parentValue == null) {
			return;
		}

		// Unsyncing: Set to parent value or false
		if (isValueInherited) {
			nodeValueSetter(node, parentValue === true);
		}
		// Syncing: Set to inherit
		else {
			nodeValueSetter(
				node,
				inheritStyle() as GParentNodeValue extends never
					? boolean | undefined
					: TStyleReference<boolean>
			);
		}
	}, [node, nodeValueSetter, isValueInherited, parentValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<Knob
			ariaLabel={ariaLabel || `Toggle ${label}`}
			selected={selected}
			onClick={handleToggle}
			disabled={isValueInherited}
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
						title={isValueInherited ? 'Unlink from parent' : 'Link to parent'}
					>
						{isValueInherited ? (
							<LinkOffIcon className="h-3 w-3" />
						) : (
							<LinkIcon className="h-3 w-3" />
						)}
					</button>
				)}
			</div>
			<div className="space-y-1">
				{isValueInherited ? (
					<Tooltip
						content={
							<span>
								This toggle is inherited from the parent. Click the unlink icon (
								<LinkOffIcon className="inline h-3 w-3" />) to set a custom value.
							</span>
						}
						preferredPosition="below"
						hoverDelay={500}
					>
						{InputComponent}
					</Tooltip>
				) : (
					InputComponent
				)}
			</div>
		</div>
	);
};

export interface TToggleStyleFieldProps<GNodeValue, GParentNodeValue> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TStyleReference<boolean> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends never ? boolean | undefined : TStyleReference<boolean>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => boolean | undefined;
	ariaLabel?: string;
}
