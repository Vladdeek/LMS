import { API_URL } from '../API'
import api from './client'

export const fetchCourseById = async courseId => {
	const res = await api.get(`${API_URL}/courses/${courseId}`)
	return res.data
}
export const editCourseById = async courseId => {
	const res = await api.put(`${API_URL}/courses/${courseId}`)
	return res.data
}
