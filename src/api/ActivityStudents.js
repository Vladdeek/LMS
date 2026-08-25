import { API_URL } from '../API'
import api from './client'

export const activityApi = {
	getLinkedGroups: courseId =>
		api.get(`${API_URL}/courses/student-group/linked/?course_id=${courseId}`, {
			withCredentials: true,
		}),

	getLessons: courseId =>
		api.get(`${API_URL}/courses/${courseId}/lessons`, {
			withCredentials: true,
		}),

	getStudentsActivity: (courseId, params) =>
		api.get(`${API_URL}/courses/${courseId}/time`, {
			params,
			withCredentials: true,
		}),
}
