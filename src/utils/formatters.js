export const formatDuration = (seconds = 0) => {
	if (seconds < 60) return `${seconds} сек`

	const mins = Math.floor(seconds / 60)
	if (mins < 60) return `${mins} мин`

	const hours = Math.floor(mins / 60)
	if (hours < 24) return `${hours} ч ${mins % 60} мин`

	const days = Math.floor(hours / 24)
	return `${days} д ${hours % 24} ч`
}

export const formatDateTime = isoString => {
	if (!isoString) return '—'

	const date = new Date(isoString)
	return date
		.toLocaleString('ru-RU', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		})
		.replace(',', '')
}
