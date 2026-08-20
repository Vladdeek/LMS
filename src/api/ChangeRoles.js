import { API_URL } from '../API'
import api from './client'

export const GetUserRoles = async () => {
	const res = await api.get(`${API_URL}/user/active-profiles`)

	return res.data
}
export const ChangeUserRoles = async (name, id) => {
	const res = await api.put(`${API_URL}/user/active-profile`, {
		profile_name: name,
		profile_id: id,
	})
	return res
}
