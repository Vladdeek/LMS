import { useEffect } from 'react'

export const useLockBodyScroll = isLocked => {
	useEffect(() => {
		if (!isLocked) return

		// Сохраняем исходный стиль, чтобы вернуть его при размонтировании
		const originalOverflow = window.getComputedStyle(document.body).overflow

		// Блокируем скролл
		document.body.style.overflow = 'hidden'

		// Возвращаем скролл обратно при закрытии компонента
		return () => {
			document.body.style.overflow = originalOverflow
		}
	}, [isLocked]) // Хук сработает каждый раз, когда меняется флаг isLocked
}
