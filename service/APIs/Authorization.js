import api, { API } from '../../src/API'

export const Registration = async (
	email,
	password,
	repeat_password,
	username,
	first_name,
	last_name,
	patronymic,
) => {
	const response = await api.post(`${API}/auth/signup`, {
		username,
		password,
		repeat_password,
		first_name,
		last_name,
		patronymic,
		email,
	})
	return response.data
}

export const Login = async (email, password) => {
	const response = await api.post(`${API}/auth/login`, {
		email,
		password,
	})
	return response.data
}

export const Me = async () => {
	const response = await api.get(`${API}/auth/me`)
	return response.data
}

export const Logout = async () => {
	const response = await api.post(`${API}/auth/logout`)
	return response.data
}
