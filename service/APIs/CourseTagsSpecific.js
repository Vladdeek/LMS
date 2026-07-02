import api, { API } from '../../src/API'

export const GetTags = async () => {
	const response = await api.get(`${API}/tags/`)
	return response.data
}

export const AddTag = async name => {
	const response = await api.post(`${API}/tags/`, { name })
	return response.data
}
