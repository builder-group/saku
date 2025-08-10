import { cn } from '@/lib';

export const PortalPulse: React.FC<TPortalPulseProps> = (props) => {
	const { isActive = true, className, pulseClassName, children, ...divProps } = props;

	return (
		<div className={cn('relative', className)} {...divProps}>
			{/* Portal-like pulsing effect */}
			<div
				className={cn('absolute inset-0', pulseClassName)}
				style={{
					animation: isActive ? 'portalPulse 1.5s ease-in-out infinite' : 'none'
				}}
			/>
			<style>{`
				@keyframes portalPulse {
					0%, 100% {
						box-shadow: inset 0 0 10px #E6F7FF;
					}
					25% {
						box-shadow: inset 0 0 17px #F2E6FF;
					}
					50% {
						box-shadow: inset 0 0 25px #FFE6F0;
					}
					75% {
						box-shadow: inset 0 0 17px #F2E6FF;
					}
				}
			`}</style>
			{/* Content */}
			<div className="relative z-10">{children}</div>
		</div>
	);
};

interface TPortalPulseProps extends React.HTMLAttributes<HTMLDivElement> {
	isActive?: boolean;
	pulseClassName?: string;
}
