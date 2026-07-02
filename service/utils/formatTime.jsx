export function formatTime(totalSeconds) {
	const h = Math.floor(totalSeconds / 3600)
	const m = Math.floor((totalSeconds % 3600) / 60)
	const s = totalSeconds % 60

	const parts = []

	if (h > 0) parts.push(`${h} ч.`)
	if (m > 0) parts.push(`${m} м.`)
	if (s > 0 || parts.length === 0) parts.push(`${s} с.`)

	return parts.join(' ')
}
