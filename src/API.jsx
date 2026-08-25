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
