import { API_URL } from '../API'
import api from './client'

export const accessApi = {
	getLinkedData: (type, courseId, page, term = '') => {
		const endpoint = type === 'students' ? 'student-group' : 'teachers'
		const queryParams = new URLSearchParams({
			course_id: courseId,
			page,
			size: 25,
			...(term && { term }),
		})
		return api.get(`${API_URL}/courses/${endpoint}/linked/?${queryParams}`, {
			withCredentials: true,
		})
	},

	getUnlinkedData: (type, courseId, page, term = '') => {
		const endpoint = type === 'students' ? 'student-group' : 'teachers'
		const queryParams = new URLSearchParams({
			course_id: courseId,
			page,
			size: 25,
			...(term && { term }),
		})
		return api.get(`${API_URL}/courses/${endpoint}/unlinked/?${queryParams}`, {
			withCredentials: true,
		})
	},

	addAccess: (type, courseId, id) => {
		const endpoint = type === 'students' ? 'students' : 'teachers'
		const param =
			type === 'students' ? 'student_group_id' : 'teacher_profile_id'
		return api.post(`${API_URL}/courses/${endpoint}/${courseId}?${param}=${id}`)
	},

	removeAccess: (type, courseId, id) => {
		const endpoint = type === 'students' ? 'students' : 'teachers'
		const param =
			type === 'students' ? 'student_group_id' : 'teacher_profile_id'
		return api.delete(
			`${API_URL}/courses/${endpoint}/${courseId}?${param}=${id}`,
		)
	},
}
