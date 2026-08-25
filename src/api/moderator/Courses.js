import { API_URL } from '../../API'
import api from '../client'

// export const getModerationCourses = async courseId => {
// 	const res = await api.get(`${API_URL}/courses/${courseId}`)
// 	return res.data
// }

export const getCourseAttachments = async courseId => {
	const res = await api.get(`${API_URL}/courses/${courseId}/attachments`)
	return res.data
}

export const fetchCourseById = async courseId => {
	const res = await api.get(`${API_URL}/courses/${courseId}`)
	return res.data
}

export const getLinkedAllLinkedGroups = async courseId => {
	const res = await api.get(
		`${API_URL}/courses/student-group/linked/all/?course_id=${courseId}`,
	)
	return res.data
}

export const getModerationCourses = async (getAll = false, page, term = '') => {
	const res = await api.get(
		`${API_URL}/courses/${!getAll ? 'all/pending' : ''}?size=${25}&page=${page}${term.length > 0 ? `&term=${term}` : ''}`,
	)
	return res.data
}
