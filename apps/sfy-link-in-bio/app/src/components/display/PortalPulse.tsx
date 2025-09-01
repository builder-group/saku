import { useFeatureState } from 'feature-react';
import { createState, TState } from 'feature-state';
import React from 'react';
import { cn } from '@/lib';

export const PortalPulse: React.FC<TPortalPulseProps> = (props) => {
	const { isActive: isActiveProp, className, style, ...divProps } = props;

	const isActiveState = React.useMemo(() => {
		return typeof isActiveProp === 'boolean' ? createState(isActiveProp) : isActiveProp;
	}, [isActiveProp]);
	const isActive = useFeatureState(isActiveState);

	if (!isActive) {
		return null;
	}

	return (
		<>
			{/* Portal-like pulsing effect */}
			<div
				className={cn('absolute inset-0', className)}
				style={{
					...style,
					animation: 'portalPulse 1s ease-in-out infinite'
				}}
				{...divProps}
			/>
			<style>{`
				@keyframes portalPulse {
					0%, 100% {
						box-shadow: 
							inset 0 0 18px rgba(59, 130, 246, 0.2),
							inset 0 0 35px rgba(59, 130, 246, 0.08);
						opacity: 0.75;
					}
					25% {
						box-shadow: 
							inset 0 0 25px rgba(147, 51, 234, 0.25),
							inset 0 0 45px rgba(147, 51, 234, 0.12);
						opacity: 0.85;
					}
					50% {
						box-shadow: 
							inset 0 0 32px rgba(236, 72, 153, 0.3),
							inset 0 0 55px rgba(236, 72, 153, 0.15);
						opacity: 0.95;
					}
					75% {
						box-shadow: 
							inset 0 0 25px rgba(147, 51, 234, 0.25),
							inset 0 0 45px rgba(147, 51, 234, 0.12);
						opacity: 0.85;
					}
				}
			`}</style>
		</>
	);
};

interface TPortalPulseProps extends React.HTMLAttributes<HTMLDivElement> {
	isActive: TState<boolean, []> | boolean;
}
