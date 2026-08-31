import { TEXT_SIZES } from '../../Constants/TextSizes'

const TEXT_STYLES = {
	primary: 'text-[var(--black)]',
	secondary: 'text-[var(--middle)]',
	tertiary: 'text-[var(--light-middle)]',
	inverse: 'text-[var(--white)]',
}

export const Text = ({
	children,
	size,
	font,
	style,
	className,
	as: Component = 'span',
}) => {
	return (
		<Component
			className={`${TEXT_SIZES.size[size]} ${TEXT_SIZES.font[font]} ${TEXT_STYLES[style]} ${className}`}
		>
			{children}
		</Component>
	)
}
