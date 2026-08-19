const env = import.meta.env.VITE_ENV || 'dev'
const apiPrefix = import.meta.env.VITE_API_PREFIX || ''
const config = {
	dev: {
		API_URL: `${import.meta.env.VITE_API_URL || ''}${apiPrefix}`,
		MEDIA_API_URL: import.meta.env.VITE_IMG_URL_DEV,
	},
	prod: {
		API_URL: apiPrefix,
		MEDIA_API_URL: import.meta.env.VITE_IMG_URL_PROD,
	},
}
if (!config[env]) {
	throw new Error(`Неизвестное окружение: ${env}`)
}
export const { API_URL, MEDIA_API_URL } = config[env]

//====================== Axios API Error Context ===========================//

import axios from 'axios'
import { toast } from 'sonner'

const api = axios.create({
	withCredentials: true,
})

const BACKEND_ERRORS = {
	USER_NOT_FOUND_BY_EMAIL: 'Пользователь с таким email не найден',
}

const STATUS_ERRORS = {
	401: 'Ошибка авторизации',
	403: 'Доступ запрещён',
	404: 'Ничего не найдено',
	500: 'Сервер временно умер',
}

const showError = err => {
	const uniqueCode = err.data?.unique_code
	const status = err?.status

	let message = ''

	if (uniqueCode && BACKEND_ERRORS[uniqueCode]) {
		message = BACKEND_ERRORS[uniqueCode]
	} else if (status && STATUS_ERRORS[status]) {
		message = STATUS_ERRORS[status]
	} else {
		message = uniqueCode || `Неизвестная ошибка (${status || 'No Status'})`
	}

	toast.error(message, {
		id: 'api-error',
	})
}

const getCookie = name => {
	const cookies = document.cookie ? document.cookie.split('; ') : []
	for (let c of cookies) {
		const [k, ...v] = c.split('=')
		if (k === name) return decodeURIComponent(v.join('='))
	}
	return null
}

api.interceptors.request.use(config => {
	const csrf = getCookie('csrftoken')

	if (csrf) {
		config.headers['X-CSRF-TOKEN'] = csrf
	}

	config.headers['X-API-KEY'] = import.meta.env.VITE_API_KEY

	return config
})

api.interceptors.response.use(
	r => r,
	error => {
		if (axios.isCancel(error)) {
			return Promise.reject(error)
		}

		if (error.response?.status === 401) {
			console.error('Ошибка авторизации. Пожалуйста, войдите в систему.')
			window.location.href = '/authorization'
			return Promise.reject(error)
		}

		const status = error.response
		showError(status)

		return Promise.reject(error)
	},
)

export default api
