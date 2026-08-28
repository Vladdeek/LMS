// Настройки статусов публикации
export const STATUS_CONFIG = {
	approved: {
		text: 'Опубликован',
		styles: { text: 'var(--green-text)', bg: 'var(--green-bg)' },
	},
	in_development: {
		text: 'Не опубликован',
		styles: { text: 'var(--red-text)', bg: 'var(--red-bg)' },
	},
	pending: {
		text: 'На рассмотрении',
		styles: { text: 'var(--yellow-text)', bg: 'var(--yellow-bg)' },
	},
}
