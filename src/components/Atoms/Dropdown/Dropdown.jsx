import React, { useState, useRef, useEffect } from 'react'

export const Dropdown = ({ trigger, children, align = 'right' }) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = event => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const toggle = () => setIsOpen(prev => !prev)

	const alignmentClasses = {
		right: 'right-0',
		left: 'left-0',
	}

	return (
		<div className='relative inline-block text-left' ref={dropdownRef}>
			<div onClick={toggle} className='cursor-pointer'>
				{trigger(isOpen)}
			</div>

			{isOpen && (
				<div
					className={`absolute ${alignmentClasses[align]} mt-2 w-48 rounded-xl bg-[var(--white)] shadow-lg border border-[var(--light-middle)] py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
				>
					{typeof children === 'function'
						? children({ close: () => setIsOpen(false) })
						: children}
				</div>
			)}
		</div>
	)
}
