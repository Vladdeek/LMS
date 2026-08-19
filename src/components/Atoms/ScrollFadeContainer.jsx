import { ArrowDown } from 'lucide-react'
import { useState } from 'react'

export const ScrollFadeContainer = ({ children, height }) => {
	const [showArrow, setShowArrow] = useState(true)

	const handleScroll = e => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

		// Формула: полная высота контента минус прокрученная часть сверху
		// должна быть равна видимой высоте экрана (с погрешностью в 5px)
		const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5

		if (isAtBottom) {
			setShowArrow(false)
		} else {
			setShowArrow(true)
		}
	}
	return (
		<div className={`relative ${height}`}>
			{/* Градиентный слой, который всегда "висит" вверху модалки */}

			<div className='pointer-events-none  absolute top-0 left-0 right-0 h-10 bg-gradient-to-t to-[var(--white)] from-transparent' />

			{/* Контентный блок со скроллом */}
			<div
				className='px-2 pt-6 pb-10 h-full overflow-y-scroll hide-scrollbar font'
				onScroll={handleScroll}
			>
				{children}
			</div>

			{/* Градиентный слой, который всегда "висит" внизу модалки */}
			<div className='pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--white)] to-transparent' />

			{/* Стрелочка с динамическим классом видимости */}
			<ArrowDown
				className={`absolute bottom-2 text-[var(--black)] left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${
					showArrow ? 'opacity-50' : 'opacity-0'
				}`}
			/>
		</div>
	)
}
