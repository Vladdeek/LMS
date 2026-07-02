import axios from 'axios'

/**
 * Чистая функция для загрузки файла на S3 через Presigned Post FormData
 * @param {string} url - S3 bucket URL (data.url)
 * @param {Object} fields - Поля авторизации от бэка (data.fields)
 * @param {File} file - Сам файл из инпута
 * @param {Function} onProgress - Коллбэк для обновления процентов
 */
export const uploadFileToStorage = async (url, fields, file, onProgress) => {
	const formData = new FormData()

	// В S3 критически важен порядок: сначала все служебные поля, потом файл!
	Object.entries(fields).forEach(([key, value]) => {
		formData.append(key, value)
	})
	formData.append('file', file)

	await axios.post(url, formData, {
		headers: {
			// Браузер сам выставит нужный multipart/form-data boundary, руками писать не нужно
			'Content-Type': 'multipart/form-data',
		},
		onUploadProgress: progressEvent => {
			if (progressEvent.total) {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total,
				)
				onProgress(percentCompleted)
			}
		},
	})

	// Возвращаем итоговый URL собранного файла
	return `${url}/${fields.key}`
}
