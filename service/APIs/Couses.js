import api, { API_URL } from '../../src/API'

// Универсальный метод отправки формы создания курса
export const CreateCourse = async (courseData, is_from_load) => {
	const formData = new FormData()

	Object.keys(courseData).forEach(key => {
		if (courseData[key] !== undefined && courseData[key] !== null) {
			formData.append(key, courseData[key])
		}
	})

	const response = await api.post(
		`${API_URL}/courses${is_from_load ? '?is_from_load=true' : ''}`,
		formData,
		{
			withCredentials: true, // Перенесено из твоего компонента
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		},
	)

	return response.data
}

// Запрос учебных годов
export const fetchYearsRequest = async () => {
	const res = await api.get(`${API_URL}/courses/study-year/all`, {
		withCredentials: true,
		headers: { 'Content-Type': 'application/json' },
	})
	return res.data
}

// Запрос дисциплин по нагрузке
export const fetchDisciplinesRequest = async (year, semester) => {
	const res = await api.get(
		`${API_URL}/courses/disciplines/by-load?year=${year}&semester=${semester}`,
		{
			withCredentials: true,
			headers: { 'Content-Type': 'application/json' },
		},
	)
	return res.data
}

export const GetAllCourses = async () => {
	const response = await api.get(`${API_URL}/course`)
	return response.data
}

export const GetAllAvailableCoursesForStudent = async () => {
	const response = await api.get(`${API_URL}/student/courses/available`)
	return response.data
}

export const GetAllCoursesForStudent = async () => {
	const response = await api.get(`${API_URL}/courses`)
	return response.data
}

export const GetAllCoursesForTeacher = async () => {
	const response = await api.get(`${API_URL}/courses`)
	return response.data
}

export const ReadCourseById = async course_id => {
	const response = await api.get(`${API_URL}/course/${course_id}/content`)
	return response.data
}

export const GetCertificates = async () => {
	const response = await api.get(`${API_URL}/course/certificate-types`)
	return response.data
}
export const GetFormats = async () => {
	const response = await api.get(`${API_URL}/course/formats`)
	return response.data
}

export const CreateModule = async (name, course_id) => {
	const response = await api.post(`${API_URL}/course/module/`, {
		name,
		course_id,
	})
	return response.data
}
export const CreateLesson = async (name, module_content_type, module_id) => {
	const response = await api.post(`${API_URL}/course-module/content/`, {
		name,
		module_content_type,
		module_id,
	})
	return response.data
}
