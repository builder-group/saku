import React from 'react';
import styles from './Knob.module.css';

// https://www.polariscomponents.com/components/knob
export const Knob: React.FC<TKnobProps> = ({
	ariaLabel,
	selected,
	onClick,
	disabled,
	...props
}) => {
	return (
		<button
			className={`${styles['track']} ${selected ? styles['track_on'] : ''} ${disabled ? styles['track_disabled'] : ''}`}
			aria-label={ariaLabel}
			role="switch"
			type="button"
			aria-checked={selected}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			<div className={`${styles['knob']} ${selected ? styles['knob_on'] : ''}`}></div>
		</button>
	);
};

interface TKnobProps extends Omit<React.ComponentProps<'button'>, 'onClick'> {
	ariaLabel: string;
	selected: boolean;
	onClick: () => void;
}
