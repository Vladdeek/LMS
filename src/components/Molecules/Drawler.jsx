import { useEffect, useState } from 'react'

export const Drawer = ({ isOpen, onClose, children }) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true)
			document.body.style.overflow = 'hidden' // Блокируем скролл страницы
		} else {
			const timer = setTimeout(() => setIsVisible(false), 300) // Длина анимации
			document.body.style.overflow = ''
			return () => clearTimeout(timer)
		}
	}, [isOpen])

	if (!isVisible && !isOpen) return null

	return (
		<div className='fixed inset-0 z-110 lg:hidden overflow-hidden'>
			{/* Backdrop (Затемнение) */}
			<div
				className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${
					isOpen ? 'opacity-100' : 'opacity-0'
				}`}
				onClick={onClose}
			/>

			{/* Контент шторки с выездом слева */}
			<div
				className={`fixed top-0 left-0 w-[280px] h-full bg-[var(--white)] shadow-2xl z-120 transition-transform duration-300 ease-in-out transform ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{children}
			</div>
		</div>
	)
}
