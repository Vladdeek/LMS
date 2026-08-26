import { API_URL } from '../API'
import api from './client'

export const getAllDefaultPhoto = async () => {
	const response = await api.get(`${API_URL}/courses/default-images`)
	return response.data
}

export const getRandomDefaultPhoto = async () => {
	const response = await api.get(`${API_URL}/courses/default-images/random`)
	return response.data
}
