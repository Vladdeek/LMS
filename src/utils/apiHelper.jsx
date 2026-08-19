import { Logout } from '../APIs/Authorization'

// при 409 во время авторизации делать logout и повторять запрос
export const executeWithAuthCheck = async requestFn => {
	try {
		return await requestFn()
	} catch (err) {
		const errorData = err.response?.data
		const isAlreadyAuth =
			errorData?.unique_code === 'USER_ALREADY_AUTHENTICATED' ||
			err.response?.status === 409

		if (isAlreadyAuth) {
			console.warn(
				'Пользователь уже авторизован. Разлогиниваемся и пробуем снова...',
			)
			try {
				await Logout()
				return await requestFn()
			} catch (logoutOrRetryErr) {
				throw logoutOrRetryErr
			}
		}
		throw err
	}
}
