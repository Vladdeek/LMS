import api, { API_URL } from '../../src/API'

export const courseApi = {
	// Получить прикрепленные файлы
	fetchAttachments: async courseId => {
		const res = await api.get(`${API_URL}/courses/${courseId}/attachments`, {
			withCredentials: true,
		})
		return (res.data || []).map(file => ({
			file_path: file.file_path,
			name: file.original_name,
			size: file.file_size,
			type: file.file_extension,
			id: file.id,
		}))
	},

	// Загрузка файла (S3 Presigned URL + Direct Upload)
	uploadFile: async (courseId, file, onProgress) => {
		// 1. Получаем URL для загрузки
		const { data } = await api.post(`${API_URL}/files/upload-url`, {
			filename: file.name.split('.').slice(0, -1).join('.'),
			type: file.name.split('.').pop(),
			content_type: file.type,
			destination: `courses/${courseId}/attachments`,
		})

		// 2. Отправляем файл в облако
		const formData = new FormData()
		Object.entries(data.fields).forEach(([key, value]) => {
			formData.append(key, value)
		})
		formData.append('file', file)

		await axios.post(data.url, formData, {
			onUploadProgress: e => {
				const percent = Math.round((e.loaded * 100) / e.total)
				onProgress(percent)
			},
		})

		// 3. Сохраняем информацию в нашей БД
		await api.post(
			`${API_URL}/courses/${courseId}/attachments`,
			{
				file_path: data.fields.key,
				original_name: file.name,
				mime_type: file.type,
				file_size: file.size,
			},
			{ withCredentials: true },
		)
	},

	// Удаление файла
	deleteAttachment: async (courseId, id, path) => {
		return api.delete(`${API_URL}/courses/${courseId}/attachments`, {
			data: { file_path: path, id },
			withCredentials: true,
		})
	},

	// Получить студентов с фильтрами
	fetchStudents: async (courseId, params) => {
		const res = await api.get(`${API_URL}/courses/${courseId}/time`, {
			params,
			withCredentials: true,
		})
		return res.data
	},

	// Получить связанные группы
	fetchLinkedGroups: async courseId => {
		const res = await api.get(
			`${API_URL}/courses/student-group/linked/?course_id=${courseId}`,
			{
				withCredentials: true,
				headers: { 'Content-Type': 'application/json' },
			},
		)
		return res.data.items.map(item => item.name)
	},

	// Получить уроки
	fetchLessons: async courseId => {
		const res = await api.get(`${API_URL}/courses/${courseId}/lessons`, {
			withCredentials: true,
			headers: { 'Content-Type': 'application/json' },
		})
		return res.data
	},
}
