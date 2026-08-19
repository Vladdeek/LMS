import { CircleQuestionMark } from 'lucide-react'
import { useState } from 'react'

export const HintTooltip = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className='relative inline-block'>
			<CircleQuestionMark
				onClick={() => setIsOpen(prev => !prev)}
				className='text-blue-500 ml-1 cursor-pointer'
				size={16}
			/>
			<div
				className={`${
					isOpen
						? 'opacity-100 scale-100'
						: 'opacity-0 scale-0 -translate-x-1/2'
				} transition-all select-none cursor-default bg-[var(--white)] shadow-[var(--shadow)] absolute -top-12.5 left-7 h-auto w-75 px-3 py-2 text-[var(--black)] rounded-lg z-10`}
			>
				{children}
			</div>
		</div>
	)
}
