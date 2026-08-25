import { ROUNDED_SIZES } from '../../../Constants/RoundeSizes'

const BUTTON_SIZES = {
	sm: 'px-3 py-1',
	md: 'px-4 py-2',
	lg: 'px-5 py-3',
}
export const ButtonCase = ({
	children,
	onClick,
	disabled,
	sizeButton = 'md',
	rounded = 'xl',
	backgroundColor = 'var(--black)',
	textColor = 'var(--white)',
	hoverStyles = 'hover:bg-[var(--hero)] hover:text-white',
	className = 'w-fit gap-3 ',
	type = 'button',
}) => {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			style={{ backgroundColor: backgroundColor, color: textColor }}
			className={`${BUTTON_SIZES[sizeButton]} ${ROUNDED_SIZES[rounded]} ${className} ${hoverStyles} disabled:opacity-25 disabled:cursor-not-allowed active:scale-99 active:brightness-95 cursor-pointer flex transition-all shadow-[var(--shadow)] text-center`}
		>
			{children}
		</button>
	)
}
