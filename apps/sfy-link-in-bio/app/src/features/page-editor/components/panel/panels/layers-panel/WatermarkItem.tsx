import { Icon, Text, Tooltip } from '@shopify/polaris';
import React from 'react';
import { PolarisDeleteIcon, StampIcon } from '@/components';
import { useCurrentPlan } from '@/hooks';
import { cn } from '@/lib';
import { TPageEditor } from '../../../../lib';

export const WatermarkItem: React.FC<TWatermarkItemProps> = (props) => {
	const { editor, className } = props;
	const currentPlan = useCurrentPlan();

	const handleHideWatermark = React.useCallback(() => {
		const rootNode = editor.getRootNode();
		rootNode._v.watermarkVisible = false;
		rootNode._notify();
	}, [editor]);

	return (
		<div
			className={cn(
				'group flex h-8 w-full items-center gap-2 rounded-lg px-2 opacity-60 hover:bg-neutral-50',
				className
			)}
		>
			<StampIcon className="h-5 w-5 shrink-0" />
			<Text as="p" variant="bodyMd">
				Watermark
			</Text>
			<div className="ml-auto flex gap-1">
				{currentPlan.key === 'awesome' ? (
					<button
						className="cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500"
						onClick={handleHideWatermark}
					>
						<Icon source={PolarisDeleteIcon} />
					</button>
				) : (
					<Tooltip
						content="Watermark removal is only available on Awesome plan and above"
						width="wide"
						preferredPosition="below"
					>
						<button
							className="cursor-not-allowed rounded-lg p-0.5 opacity-50"
							disabled
							type="button"
						>
							<Icon source={PolarisDeleteIcon} />
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	);
};

interface TWatermarkItemProps {
	editor: TPageEditor;
	className?: string;
}
