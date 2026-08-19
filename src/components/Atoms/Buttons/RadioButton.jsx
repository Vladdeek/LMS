import { ButtonCase } from './ButtonCase'

export const RadioButton = ({
	children,
	active = false,
	onClick,
	style = 'outline',
	wfull = false,
	disabled = false,
	sizeButton = 'md',
	rounded = 'xl',
	className = '',
}) => {
	const isSolid = style === 'solid'

	// Динамические цвета в зависимости от стиля и состояния
	const backgroundColor = active
		? isSolid
			? 'var(--hero)'
			: 'var(--hero-pale)'
		: isSolid
			? 'var(--white)'
			: 'transparent'

	const textColor = active
		? isSolid
			? 'white'
			: 'var(--hero)'
		: 'var(--middle)'

	const hoverStyles = active
		? ''
		: isSolid
			? 'hover:bg-[var(--hero)] hover:text-white'
			: 'hover:bg-[var(--hero-pale)] hover:text-[var(--hero)] hover:ring-[var(--hero)]'

	const ringStyles = isSolid
		? ''
		: active
			? 'ring-1 ring-[var(--hero)]'
			: 'ring-1 ring-[var(--middle)]'

	const widthStyles = wfull
		? 'w-full justify-center'
		: 'max-md:w-full max-md:justify-center'

	return (
		<ButtonCase
			disabled={disabled}
			onClick={onClick}
			sizeButton={sizeButton}
			rounded={rounded}
			backgroundColor={backgroundColor}
			textColor={textColor}
			hoverStyles={hoverStyles}
			className={`items-center justify-center ${ringStyles} ${widthStyles} ${className}`}
		>
			{children}
		</ButtonCase>
	)
}
