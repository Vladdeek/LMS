import { API_URL } from '../API'
import api from './client'

// Получение списка вебинаров
export const getWebinars = async (status = 'all') => {
	const url =
		status !== 'all'
			? `${API_URL}/webinar/?webinar_status=${status}`
			: `${API_URL}/webinar/`
	const res = await api.get(url)
	return res.data
}

// Получение информации о вебинаре по ID
export const getWebinarById = async id => {
	const res = await api.get(`${API_URL}/webinar/${id}`)
	return res.data
}

// Удаление вебинара
export const deleteWebinar = async id => {
	const res = await api.delete(`${API_URL}/webinar/${id}`)
	return res.data
}

// Получение список непривязанных групп
export const getUnlinkedGroups = async ({
	webinarId,
	page = 1,
	size = 25,
	term = '',
}) => {
	const query = new URLSearchParams({
		page,
		size,
		...(webinarId && { webinar_id: webinarId }),
		...(term && { term }),
	})
	const res = await api.get(
		`${API_URL}/webinar/student-group/unlinked?${query}`,
	)
	return res.data
}

// Создание вебинара
export const createWebinar = async formData => {
	const res = await api.post(`${API_URL}/webinar`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return res.data
}

// Редактирование прав доступа / параметров вебинара
export const updateWebinarAccess = async (id, data) => {
	const res = await api.put(`${API_URL}/webinar/access/edit/${id}`, data)
	return res.data
}
export const getStudentAttendanceOnWebinar = async activeWebinar => {
	const res = await api.get(
		`${API}/webinar/${activeWebinar}/student/attendance`,
	)
	return res.data
}
