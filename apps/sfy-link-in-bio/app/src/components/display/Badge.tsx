import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib';

export const Badge = React.forwardRef<HTMLSpanElement, TBadgeProps>(
	({ className, variant, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'span';

		return <Comp ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
	}
);
Badge.displayName = 'Badge';

export interface TBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
}

const badgeVariants = cva(
	'inline-flex items-center gap-1 rounded-[0.5rem] px-2 py-[0.125rem] text-xs font-[550] transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-[rgba(0,0,0,0.06)] text-[rgba(97,97,97,1)]',
				secondary: 'bg-[rgba(0,0,0,0.06)] text-[rgba(97,97,97,1)]',
				success: 'bg-[rgba(175,254,191,1)] text-[rgba(1,75,64,1)]',
				successStrong: 'bg-[rgba(4,123,93,1)] text-[rgba(250,255,251,1)]',
				warning: 'bg-[rgba(255,214,164,1)] text-[rgba(94,66,0,1)]',
				warningStrong: 'bg-[rgba(255,184,0,1)] text-[rgba(37,26,0,1)]',
				caution: 'bg-[rgba(255,235,120,1)] text-[rgba(79,71,0,1)]',
				cautionStrong: 'bg-[rgba(255,230,0,1)] text-[rgba(51,46,0,1)]',
				critical: 'bg-[rgba(254,209,215,1)] text-[rgba(142,11,33,1)]',
				criticalStrong: 'bg-[rgba(199,10,36,1)] text-[rgba(255,250,251,1)]',
				info: 'bg-[rgba(213,235,255,1)] text-[rgba(0,58,90,1)]',
				infoStrong: 'bg-[rgba(145,208,255,1)] text-[rgba(0,33,51,1)]',
				magic: 'bg-[rgba(233,229,255,1)] text-[rgba(87,0,209,1)]',
				new: 'bg-[rgba(0,0,0,0.06)] text-[rgba(97,97,97,1)] font-[700]',
				readOnly: 'bg-transparent text-[rgba(97,97,97,1)]',
				enabled: 'bg-[rgba(0,0,0,0.06)] text-[rgba(48,48,48,1)]'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);
