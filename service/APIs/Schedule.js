import api, { API_URL } from '../../src/API'

// ---> fetchTeachersList - Получение списка преподавателей по поисковому запросу <---
export const fetchTeachersList = async term => {
	const res = await api.get(
		`${API_URL}/teacher-profile${term?.length ? `?term=${term}` : ''}`,
		{
			withCredentials: true,
			headers: { 'Content-Type': 'application/json' },
		},
	)
	return res.data.map(t => t.mmis_teacher_name)
}

// ---> fetchScheduleData - Получение расписания (для студента, преподавателя или конкретного учителя) <---
export const fetchScheduleData = async (
	currentWeek,
	teacher,
	isTeacherSelected,
) => {
	const isSearchingTeacher = teacher && isTeacherSelected
	const url = `${API_URL}/schedule-lessons${isSearchingTeacher ? '/teacher' : ''}?week_offset=${currentWeek}${
		isSearchingTeacher ? `&mmis_name=${encodeURIComponent(teacher)}` : ''
	}`

	const res = await api.get(url, { withCredentials: true })
	return res.data
}
