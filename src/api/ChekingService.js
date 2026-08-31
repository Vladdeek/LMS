import { API_URL } from '../API'
import api from './client'

export const fetchCourses = async () => {
	const res = await api.get(`${API_URL}/courses/`)
	return res.data
}

export const fetchGroups = async courseId => {
	if (!courseId) return []
	const res = await api.get(
		`${API_URL}/courses/student-group/linked/?course_id=${courseId}`,
	)
	return res.data.items || []
}

export const fetchStudents = async groupId => {
	if (!groupId) return []
	const res = await api.get(`${API_URL}/student-group/${groupId}/students`)
	return res.data
}

export const fetchTasks = async (studentId, courseId) => {
	if (!studentId || !courseId) return []
	const res = await api.get(
		`${API_URL}/student-profile/${studentId}/assignments/?course_id=${courseId}`,
	)
	return res.data
}
