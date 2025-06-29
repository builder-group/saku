import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Knob, LinkIcon, LinkOffIcon } from '@/components';
import { TStyleProperty } from '../../../types';

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

	const currentValue = useCompute(node, nodeValueMapper);
	const parentValue =
		useCompute(parentNode, (parent) => (parent != null ? parentValueMapper?.(parent) : null)) ??
		undefined;
	const isInherited = React.useMemo(() => currentValue === 'inherit', [currentValue]);
	const selected = React.useMemo(() => {
		if (isInherited) {
			return parentValue === true;
		} else {
			return currentValue === true;
		}
	}, [currentValue, parentValue, isInherited]);

	const handleToggle = React.useCallback(() => {
		if (isInherited) {
			return;
		}

		nodeValueSetter(node, !currentValue);
	}, [node, nodeValueSetter, isInherited, currentValue]);

	const handleToggleInheritance = React.useCallback(() => {
		if (parentValue == null) {
			return;
		}

		// Unsyncing: Set to parent value or false
		if (currentValue === 'inherit') {
			nodeValueSetter(node, parentValue === true);
		}
		// Syncing: Set to inherit
		else {
			nodeValueSetter(
				node,
				'inherit' as GParentNodeValue extends unknown ? boolean : TStyleProperty<boolean>
			);
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

export interface TToggleStyleFieldProps<GNodeValue, GParentNodeValue> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TStyleProperty<boolean> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends unknown ? boolean | undefined : TStyleProperty<boolean>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => boolean | undefined;
	ariaLabel?: string;
}
