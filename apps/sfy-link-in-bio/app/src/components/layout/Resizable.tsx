/**
 * -----------------------------------------------------------------------------
 * This file includes code derived from the project shadcn-ui/ui by \@shadcn.
 * Project Repository: https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/new-york/ui/resizable.tsx
 *
 * Date of Import: 11 September 2025
 * -----------------------------------------------------------------------------
 * The code included in this file is licensed under the MIT License,
 * as per the original project by \@shadcn.
 * For the license text, see: https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
 * -----------------------------------------------------------------------------
 */
'use client';

import { Group, Panel, Separator } from 'react-resizable-panels';
import { PolarisDragHandleIcon } from '@/components';
import { cn } from '@/lib';

const ResizablePanelGroup = ({
	className,
	orientation,
	...props
}: React.ComponentProps<typeof Group>) => (
	<Group
		className={cn(
			'group/resizable flex h-full w-full data-[orientation=vertical]:flex-col',
			className
		)}
		data-orientation={orientation}
		orientation={orientation}
		{...props}
	/>
);

const ResizablePanel = Panel;

const ResizableHandle = ({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof Separator> & {
	withHandle?: boolean;
}) => (
	<Separator
		className={cn(
			'bg-border focus-visible:ring-ring relative z-50 flex w-px items-center justify-center group-data-[orientation=vertical]/resizable:h-px group-data-[orientation=vertical]/resizable:w-full after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 group-data-[orientation=vertical]/resizable:after:left-0 group-data-[orientation=vertical]/resizable:after:h-1 group-data-[orientation=vertical]/resizable:after:w-full group-data-[orientation=vertical]/resizable:after:translate-x-0 group-data-[orientation=vertical]/resizable:after:-translate-y-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none group-data-[orientation=vertical]/resizable:[&>div]:rotate-90',
			className
		)}
		{...props}
	>
		{withHandle && (
			<div className="z-10 flex h-6 w-4 items-center justify-center rounded-sm bg-inherit md:h-4 md:w-3">
				<PolarisDragHandleIcon className="h-3 w-3 md:h-2.5 md:w-2.5" />
			</div>
		)}
	</Separator>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
