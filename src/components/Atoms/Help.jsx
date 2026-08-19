import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

const Help = ({ children, width, size = 24 }) => {
	const [open, setOpen] = useState()
	return (
		<div className='relative'>
			<HelpCircle
				size={size}
				className='text-blue-500 cursor-pointer'
				onClick={() => setOpen(prev => !prev)}
			/>
			<div
				className={`absolute  px-3 py-1 z-10 rounded-2xl ${open ? 'top-0 left-7' : '-top-17 -left-17 scale-0 opacity-0'} ${width} h-auto bg-[var(--white)] shadow-[var(--shadow)] transition-all`}
			>
				{children}
			</div>
		</div>
	)
}
export default Help
