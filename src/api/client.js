import axios from 'axios'
import { toast } from 'sonner'
import { API_URL } from '../API'

// Формируем WS URL на основе API_URL
export const WS_API = API_URL.startsWith('http')
	? API_URL.replace(/^http/, 'ws') + '/ws'
	: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${API_URL}/ws`

const api = axios.create({
	withCredentials: true,
})

export const getCookie = name => {
	const cookies = document.cookie ? document.cookie.split('; ') : []
	for (let c of cookies) {
		const [k, ...v] = c.split('=')
		if (k === name) return decodeURIComponent(v.join('='))
	}
	return null
}

// Request Interceptor
api.interceptors.request.use(config => {
	const csrf = getCookie('csrftoken')
	if (csrf) {
		config.headers['X-CSRF-TOKEN'] = csrf
	}

	if (import.meta.env.VITE_API_KEY) {
		config.headers['X-API-KEY'] = import.meta.env.VITE_API_KEY
	}

	return config
})

// Response Interceptor с очередью Refresh JWT
let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = cb => refreshSubscribers.push(cb)
const onRefreshed = () => {
	refreshSubscribers.forEach(cb => cb())
	refreshSubscribers = []
}

api.interceptors.response.use(
	r => r,
	async error => {
		if (axios.isCancel(error)) {
			return Promise.reject(error)
		}

		const status = error.response?.status
		const originalRequest = error.config

		// Перехват 401 и попытка рефреша
		if (status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(resolve => {
					subscribeTokenRefresh(() => {
						resolve(api(originalRequest))
					})
				})
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				// Запрос на рефреш идет через базовый axios, чтобы не зациклить interceptor
				await axios.post(
					`${API_URL}/auth/jwt/refresh`,
					{},
					{
						withCredentials: true,
						headers: import.meta.env.VITE_API_KEY
							? { 'X-API-KEY': import.meta.env.VITE_API_KEY }
							: {},
					},
				)

				isRefreshing = false
				onRefreshed()
				return api(originalRequest)
			} catch (refreshError) {
				isRefreshing = false
				refreshSubscribers = []
				window.location.href = '/authorization'
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	},
)

export default api
