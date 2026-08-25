import { API_URL } from '../API'
import api from './client'

export const getCourseAttachments = async courseId => {
	const res = await api.get(`${API_URL}/courses/${courseId}/attachments`, {
		withCredentials: true,
	})
	return res.data || []
}

export const deleteCourseAttachment = async (courseId, id, filePath) => {
	const res = await api.delete(`${API_URL}/courses/${courseId}/attachments`, {
		data: {
			file_path: filePath,
			id: id,
		},
		withCredentials: true,
	})
	return res.data
}

export const getCourseStudentsTime = async (courseId, params) => {
	const res = await api.get(`${API_URL}/courses/${courseId}/time`, {
		params,
		withCredentials: true,
	})
	return res.data
}

export const getLinkedStudentGroups = async courseId => {
	const res = await api.get(
		`${API_URL}/courses/student-group/linked/?course_id=${courseId}`,
		{
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
	return res.data?.items || []
}

export const getCourseLessons = async courseId => {
	const res = await api.get(`${API_URL}/courses/${courseId}/lessons`, {
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return res.data
}
