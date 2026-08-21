export const checkIsCurrentLesson = (lessonDate, lessonTime) => {
	try {
		const [hours, minutes] = lessonTime.split(':').map(Number)
		const lessonStart = new Date(lessonDate)
		lessonStart.setHours(hours, minutes, 0, 0)
		const lessonEnd = new Date(lessonStart.getTime() + 90 * 60000)
		return isWithinInterval(new Date(), { start: lessonStart, end: lessonEnd })
	} catch {
		return false
	}
}
