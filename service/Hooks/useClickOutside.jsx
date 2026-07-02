import { useEffect } from 'react'

export const useClickOutside = (ref, callback, isEnabled = true) => {
	useEffect(() => {
		if (!isEnabled) return

		const handleClickOutside = event => {
			// Если ref существует и клик был ВНЕ этого элемента
			if (ref.current && !ref.current.contains(event.target)) {
				callback()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('touchstart', handleClickOutside) // Для мобилок

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('touchstart', handleClickOutside)
		}
	}, [ref, callback, isEnabled])
}
