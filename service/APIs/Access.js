import axios from 'axios'
import api, { API_URL } from '../../src/API'

export const accessApi = {
	getLinked: (entity, courseId, page, term) => {
		const endpoint = entity === 'students' ? 'student-group' : 'teachers'
		return api.get(`${API_URL}/courses/${endpoint}/linked/`, {
			params: { course_id: courseId, page, size: 25, term: term || undefined },
		})
	},

	getUnlinked: (entity, courseId, page, term) => {
		const endpoint = entity === 'students' ? 'student-group' : 'teachers'
		return api.get(`${API_URL}/courses/${endpoint}/unlinked/`, {
			params: { course_id: courseId, page, size: 25, term: term || undefined },
		})
	},

	addAccess: (entity, courseId, id) => {
		const paramName =
			entity === 'students' ? 'student_group_id' : 'teacher_profile_id'
		const endpoint = entity === 'students' ? 'students' : 'teachers'
		return api.post(
			`${API_URL}/courses/${endpoint}/${courseId}?${paramName}=${id}`,
		)
	},

	removeAccess: (entity, courseId, id) => {
		const paramName =
			entity === 'students' ? 'student_group_id' : 'teacher_profile_id'
		const endpoint = entity === 'students' ? 'students' : 'teachers'
		return api.delete(
			`${API_URL}/courses/${endpoint}/${courseId}?${paramName}=${id}`,
		)
	},
}
