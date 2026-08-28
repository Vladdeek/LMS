import React from 'react'
import { motion } from 'framer-motion'
import { PanelLeftClose } from 'lucide-react'

const ResponsiveSidebar = ({
	title,
	triggerTitle,
	triggerIcon: TriggerIcon,
	isOpen,
	setIsOpen,
	children,
}) => {
	return (
		<>
			{/* ДЕСТКТОПНЫЙ ВАРИАНТ */}
			<div className='hidden lg:flex flex-col w-full h-full overflow-hidden bg-[var(--white)] shadow-lg rounded-3xl p-4 justify-between'>
				{title && (
					<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)] shrink-0'>
						{title}
					</h2>
				)}
				<div className='w-full h-full overflow-hidden'>{children}</div>
			</div>

			{/* МОБИЛЬНЫЙ ВАРИАНТ */}
			<div
				className='lg:hidden visible fixed left-0 md:top-20 top-18 bottom-10 z-40 flex items-start'
				style={{ pointerEvents: 'none' }}
				onMouseLeave={() => setIsOpen(false)}
			>
				{/* Ярлычок-кнопка для открытия */}
				<div
					onMouseEnter={() => setIsOpen(true)}
					onClick={() => setIsOpen(!isOpen)}
					className='flex flex-col px-6 py-6 gap-3 shadow-[var(--shadow)] h-screen bg-[var(--white)] z-10 cursor-pointer'
					style={{ pointerEvents: 'auto' }}
				>
					{TriggerIcon && (
						<TriggerIcon className='w-6 h-6 text-[var(--black)]' />
					)}
					<span className='[writing-mode:vertical-lr] rotate-180 text-base font-semibold tracking-wider text-[var(--black)] uppercase whitespace-nowrap'>
						{triggerTitle}
					</span>
				</div>

				{/* Выезжающая панель */}
				<motion.div
					animate={{
						x: isOpen ? 0 : '-100%',
						visibility: isOpen ? 'visible' : 'hidden',
					}}
					style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
					transition={{ type: 'spring', damping: 25, stiffness: 180 }}
					className={`relative flex items-start h-screen bg-[var(--white)] shadow-[var(--shadow)]
					`}
				>
					<div className='w-[75vw] md:w-[60vw] flex flex-col py-6 h-full px-4 transition-all delay-0 duration-75 overflow-hidden'>
						<div className='flex justify-between items-center mb-3 shrink-0'>
							{title && (
								<h2 className='text-lg font-bold px-2 text-[var(--black)]'>
									{title}
								</h2>
							)}
							<PanelLeftClose
								onClick={() => setIsOpen(false)}
								title={'Скрыть боковую панель'}
								className='text-[var(--black)] h-10 w-10 hover:bg-[var(--light-middle)]/50 p-2 rounded-lg cursor-pointer'
							/>
						</div>
						<div className='flex-1 overflow-hidden'>{children}</div>
					</div>
				</motion.div>
			</div>
		</>
	)
}

export default ResponsiveSidebar
