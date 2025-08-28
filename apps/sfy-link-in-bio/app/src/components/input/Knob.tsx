import React from 'react';
import styles from './Knob.module.css';

// https://www.polariscomponents.com/components/knob
export const Knob: React.FC<TKnobProps> = (props) => {
	const { ariaLabel, selected, disabled, ...buttonProps } = props;

	return (
		<button
			className={`${styles['track']} ${selected ? styles['track_on'] : ''} ${disabled ? styles['track_disabled'] : ''}`}
			aria-label={ariaLabel}
			role="switch"
			type="button"
			aria-checked={selected}
			disabled={disabled}
			{...buttonProps}
		>
			<div className={`${styles['knob']} ${selected ? styles['knob_on'] : ''}`}></div>
		</button>
	);
};

export interface TKnobProps extends Omit<React.ComponentProps<'button'>, 'onClick'> {
	ariaLabel: string;
	selected: boolean;
	onClick: () => void;
}
