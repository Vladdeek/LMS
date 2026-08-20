import { NavLink } from 'react-router-dom'

export const HeaderButton = ({
	title,
	icon: Icon,
	to,
	not_clickable = false,
	onClick,
}) => {
	const clearError = () => {
		// setGlobalError(null)
	}

	const handleClick = e => {
		if (not_clickable) {
			e.preventDefault()
			return
		}
		clearError()
		if (onClick) onClick()
	}

	return (
		<NavLink
			to={!not_clickable ? to : '#'}
			onClick={handleClick}
			className={({ isActive }) =>
				`flex justify-start md:justify-center items-center gap-3 md:gap-2 rounded-xl px-4 py-3 md:pb-3 md:pt-2 cursor-pointer shadow-[var(--shadow)] text-[var(--black)] transition-all select-none w-full md:w-auto ${
					not_clickable
						? 'bg-[var(--light-middle)] text-[var(--middle)] opacity-75'
						: `${
								!isActive ? 'bg-[var(--white)]' : 'bg-[var(--hero)] text-white'
							}`
				}`
			}
		>
			{({ isActive }) => (
				<>
					<Icon size={24} />
					<p
						className={`font-medium text-base whitespace-nowrap transition-all ${
							not_clickable
								? 'text-[var(--middle)]'
								: `${isActive ? 'text-white' : 'hover:text-[var(--black)]'}`
						}`}
					>
						{title}
					</p>
				</>
			)}
		</NavLink>
	)
}
