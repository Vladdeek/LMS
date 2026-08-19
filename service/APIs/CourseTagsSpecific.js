import api, { API_URL } from '../../src/API'

export const GetTags = async () => {
	const response = await api.get(`${API_URL}/tags/`)
	return response.data
}

export const AddTag = async name => {
	const response = await api.post(`${API_URL}/tags/`, { name })
	return response.data
}
