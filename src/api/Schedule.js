import { API_URL } from '../API'
import api from './client'

export const fetchTeachersList = async term => {
	const response = await api.get(
		`${API_URL}/teacher-profile${term?.length ? `?term=${term}` : ''}`,
	)
	return response.data
}

export const fetchScheduleData = async (
	weekOffset,
	teacherId,
	isTeacherSelected,
) => {
	const response = await api.get(
		`${API_URL}/schedule-lessons${
			teacherId && isTeacherSelected ? '/teacher' : ''
		}?week_offset=${weekOffset}${
			teacherId && isTeacherSelected
				? `&mmis_name=${encodeURIComponent(teacherId)}`
				: ''
		}`,
	)
	return response.data
}
