import api, { API_URL } from '../../src/API'

export const ActivityAPI = {
	fetchStudents: async (courseId, params) => {
		const res = await api.get(`${API_URL}/courses/${courseId}/time`, {
			params,
			withCredentials: true,
		})
		return res.data
	},

	fetchLinkedGroups: async courseId => {
		const res = await api.get(
			`${API_URL}/courses/student-group/linked/?course_id=${courseId}`,
			{ withCredentials: true },
		)
		return res.data.items.map(item => item.name)
	},

	fetchLessons: async courseId => {
		const res = await api.get(`${API_URL}/courses/${courseId}/lessons`, {
			withCredentials: true,
		})
		return res.data
	},
}
