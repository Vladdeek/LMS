import { NavLink } from 'react-router-dom'
import { TEXT_SIZES } from '../../Constants/TextSizes'

export const Link = ({ to, children, textSize = '2xl', underline = false }) => {
	return (
		<>
			<NavLink
				to={to}
				className={`flex flex-col items-center group w-fit ${TEXT_SIZES.size[textSize]} text-[var(--black)] p-1`}
			>
				<p className='group-hover:text-[var(--hero)]'>{children}</p>
				{underline && (
					<div className='bg-[var(--black)] h-[1px] w-full opacity-100 group-hover:opacity-100 group-hover:bg-[var(--hero)] transition-all'></div>
				)}

				<div className='bg-[var(--hero)] h-[1px]  w-0 group-hover:w-full transition-all'></div>
			</NavLink>
		</>
	)
}
