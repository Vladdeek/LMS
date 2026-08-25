import { ButtonCase } from './ButtonCase'

export const SubmitButton = ({
	children,
	disabled,
	onClick,
	sizeButton,
	className,
	invert = false,
}) => {
	return (
		<ButtonCase
			sizeButton={sizeButton}
			disabled={disabled}
			onClick={onClick}
			backgroundColor={invert ? 'var(--white)' : 'var(--black)'}
			textColor={invert ? 'var(--black)' : 'var(--white)'}
			hoverStyles='hover:bg-[var(--hero)] hover:text-white'
			className={`${className}`}
		>
			{children}
		</ButtonCase>
	)
}
