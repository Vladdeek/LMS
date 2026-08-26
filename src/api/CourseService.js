import { API_URL } from '../API'
import api from './client'

// --- Работа с модулями ---
export const createModule = async (name, courseId) => {
	const res = await api.post(`${API_URL}/modules/${courseId}`, {
		name,
	})
	return res.data
}

export const deleteModule = async moduleId => {
	const res = await api.delete(`${API_URL}/modules/${moduleId}`)
	return res.data
}

export const renameModule = async (moduleId, name) => {
	const res = await api.put(`${API_URL}/modules/${moduleId}`, { name })
	return res.data
}

export const translateModule = async (courseId, moduleId, direction) => {
	const res = await api.patch(`${API_URL}/modules/${moduleId}/move`, {
		direction,
		course_id: courseId,
	})
	return res.data
}

// --- Работа с секциями (уроками/тестами/практиками) ---
export const createLesson = async (title, type, moduleId) => {
	const res = await api.post(`${API_URL}/sections/modules/${moduleId}`, {
		title,
		type,
	})
	return res.data
}

export const deleteSection = async sectionId => {
	const res = await api.delete(`${API_URL}/sections/${sectionId}`)
	return res.data
}

export const renameSection = async (sectionId, name) => {
	const res = await api.put(`${API_URL}/sections/${sectionId}`, { name })
	return res.data
}

export const translateSection = async (moduleId, sectionId, direction) => {
	const res = await api.patch(`${API_URL}/sections/${sectionId}/move`, {
		direction,
		module_id: moduleId,
	})
	return res.data
}

export const getSectionInfo = async sectionId => {
	const res = await api.get(`${API_URL}/sections/${sectionId}/content`)
	return res.data
}

// --- Управление статусом курса ---
export const changeCourseStatus = async (courseId, status) => {
	const res = await api.patch(`${API_URL}/courses/${courseId}/status`, {
		status,
	})
	return res.data
}

// --- Контент лекции ---
export const readLectureContent = async sectionId => {
	const res = await api.get(`${API_URL}/sections/${sectionId}/content`)
	return res.data
}

// Отправка всего массива блоков
// Отправка строго чистого массива блоков в body
export const saveLectureContent = async (sectionId, blocks) => {
	const res = await api.put(
		`${API_URL}/sections/${sectionId}/content`,
		blocks, // Передаем массив напрямую, без обёртки в объект!
	)
	return res.data
}

export const deleteImage = async (blockId, fileId) => {
	const res = await api.delete(`${API_URL}/blocks/${blockId}/images/${fileId}`)
	return res.data
}

export const deleteFile = async (blockId, fileId) => {
	const res = await api.delete(`${API_URL}/blocks/${blockId}/files/${fileId}`)
	return res.data
}

// --- Практические работы ---
export const fetchStudentWork = async sectionId => {
	const res = await api.get(
		`${API_URL}/sections/${sectionId}/upload/assignment`,
	)
	return res.data
}

export const sendResultOfWork = async (sectionId, workData) => {
	const res = await api.post(
		`${API_URL}/sections/${sectionId}/upload/assignment`,
		workData,
	)
	return res.data
}

export const getSession = async sectionId => {
	const res = await api.get(`${API_URL}/tests/is-active/${sectionId}`)
	return res.data
}

export const startSession = async sectionId => {
	const res = await api.post(`${API_URL}/tests/start/${sectionId}`, {})
	return res.data
}

export const updateStudentAnswers = async (sectionId, answers) => {
	const res = await api.put(
		`${API_URL}/tests/student-answers/update/${sectionId}`,
		answers,
	)
	return res.data
}

export const endSession = async sectionId => {
	const res = await api.post(`${API_URL}/tests/end/${sectionId}`, {})
	return res.data
}

export const editTest = async (
	sectionId,
	title,
	description,
	timeLimit,
	questions,
) => {
	const res = await api.put(`${API_URL}/tests/${sectionId}`, {
		title,
		description,
		time_limit: timeLimit,
		questions,
	})
	return res.data
}
