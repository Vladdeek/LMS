import { useEffect } from 'react'

export const useScrollListener = (
	callback,
	isEnabled = true,
	elementRef = null,
) => {
	useEffect(() => {
		if (!isEnabled) return

		const handleScroll = event => {
			callback(event)
		}

		// Если передали ref, слушаем скролл внутри этого элемента, иначе — на всем окне
		const target = elementRef?.current || window

		target.addEventListener('scroll', handleScroll, true) // true включает стадию перехвата

		return () => {
			target.removeEventListener('scroll', handleScroll, true)
		}
	}, [callback, isEnabled, elementRef])
}
