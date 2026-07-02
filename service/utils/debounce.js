// service/utils/debounce.js
export function debounce(callback, delay) {
	let timer

	return function (...args) {
		// Очищаем предыдущий таймер, если он был
		clearTimeout(timer)

		// Запускаем новый
		timer = setTimeout(() => {
			callback.apply(this, args)
		}, delay)
	}
}
