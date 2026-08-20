import { API_URL } from '../API'
import api from './client'

export const Me = async () => {
	const res = await api.get(`${API_URL}/users/me`)
	return res.data
}
export const Login = async data => {
	const res = await api.post(`${API_URL}/auth/jwt/login`, data)
	return res
}
