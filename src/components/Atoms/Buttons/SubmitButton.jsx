import { ButtonCase } from './ButtonCase'

export const SubmitButton = ({ disabled, onClick, sizeButton, className }) => {
	return (
		<ButtonCase
			sizeButton={sizeButton}
			disabled={disabled}
			onClick={onClick}
			backgroundColor='var(--black)'
			textColor='var(--white)'
			hoverStyles='hover:bg-[var(--hero)] hover:text-white'
			className={`${className}`}
		>
			{children}
		</ButtonCase>
	)
}
