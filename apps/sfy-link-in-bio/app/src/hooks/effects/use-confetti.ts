import confetti from 'canvas-confetti';
import { useCallback } from 'react';

/**
 * Hook for creating confetti firework effects
 * @example
 * ```tsx
 * const triggerConfetti = useConfetti();
 *
 * return <button onClick={triggerConfetti}>Celebrate!</button>;
 * ```
 */
export const useConfetti = (options: TConfettiOptions = {}) => {
	const {
		duration = 3000,
		startVelocity = 30,
		spread = 360,
		ticks = 60,
		zIndex = 0,
		interval = 250
	} = options;

	return useCallback(() => {
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity, spread, ticks, zIndex };

		const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

		const timer = window.setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				clearInterval(timer);
				return;
			}

			const particleCount = 50 * (timeLeft / duration);

			// Shoot confetti from the left edge
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
			});

			// Shoot confetti from the right edge
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
			});
		}, interval);

		// Cleanup function in case component unmounts during animation
		return () => clearInterval(timer);
	}, [duration, interval, spread, startVelocity, ticks, zIndex]);
};

export interface TConfettiOptions {
	/**
	 * Duration of the effect in milliseconds
	 * @default 5000
	 */
	duration?: number;
	/**
	 * Initial velocity of the particles
	 * @default 30
	 */
	startVelocity?: number;
	/**
	 * Spread angle in degrees
	 * @default 360
	 */
	spread?: number;
	/**
	 * Number of ticks the particles will animate for
	 * @default 60
	 */
	ticks?: number;
	/**
	 * Z-index of the particles
	 * @default 0
	 */
	zIndex?: number;
	/**
	 * Interval between bursts in milliseconds
	 * @default 250
	 */
	interval?: number;
}
