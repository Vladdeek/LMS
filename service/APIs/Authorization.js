import api, { API_URL } from '../../src/API'

export const Login = async (email, password) => {
	const response = await api.post(`${API_URL}/auth/login`, {
		email,
		password,
	})
	return response.data
}

export const Me = async () => {
	const response = await api.get(`${API_URL}/auth/me`)
	return response.data
}

export const Logout = async () => {
	const response = await api.post(`${API_URL}/auth/logout`)
	return response.data
}

export const GetUserRoles = async () => {
	const response = await api.get(`${API_URL}/user/active-profiles`)
	return response.data
}

export const changeActiveRole = async (profile_name, profile_id) => {
	const response = await api.patch(`${API_URL}/user/active-profile`, {
		profile_name,
		profile_id,
	})
	return response.data
}
