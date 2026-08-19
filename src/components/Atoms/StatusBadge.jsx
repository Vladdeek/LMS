import { ROUNDED_SIZES } from '../../Constants/RoundeSizes'
import { TEXT_SIZES } from '../../Constants/TextSizes'

const BADGE_STYLES = {
	green: 'text-[var(--green-text)] bg-[var(--green-bg)]',
	yellow: 'text-[var(--yellow-text)] bg-[var(--yellow-bg)]',
	red: 'text-[var(--red-text)] bg-[var(--red-bg)]',
	hero: 'text-[var(--hero)] bg-[var(--hero-pale)]',
}
const BADGE_SIZES = {
	sm: 'px-1',
	md: 'px-2',
	lg: 'px-3 py-1',
}

export const StatusBadge = ({
	style,
	children,
	textSize = 'sm',
	rounded = 'md',
	className,
	size,
}) => {
	const currentStatus = BADGE_STYLES[status] || BADGE_STYLES['hero']

	return (
		<div
			className={`backdrop-blur-sm w-fit ${className} ${BADGE_SIZES[size]} ${TEXT_SIZES.size[textSize]} ${ROUNDED_SIZES[rounded]} ${currentStatus}`}
		>
			{children}
		</div>
	)
}
