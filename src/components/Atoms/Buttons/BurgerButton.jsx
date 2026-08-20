import { useState } from 'react'

export const BurgerButton = ({ onClick, active }) => {
	return (
		<button onClick={onClick} className='lg:hidden relative h-10 w-10 group'>
			<div
				className={`bg-black w-[90%] rounded-full h-1 absolute  transition-all ${active ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-2'}`}
			></div>
			<div
				className={`bg-black w-[90%] rounded-full h-1 absolute top-1/2 -translate-y-1/2 transition-all ${active && 'opacity-0'}`}
			></div>
			<div
				className={`bg-black w-[90%] rounded-full h-1 absolute  transition-all ${active ? '-rotate-45 top-1/2 -translate-y-1/2' : 'bottom-2'}`}
			></div>
		</button>
	)
}
