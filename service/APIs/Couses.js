import api, { API } from '../../src/API'

export const CreateCourse = async courseData => {
	const formData = new FormData()

	// Циклом проходим по всем ключам объекта и добавляем их в FormData
	Object.keys(courseData).forEach(key => {
		// Проверяем, что значение существует, чтобы не отправлять undefined
		if (courseData[key] !== undefined && courseData[key] !== null) {
			formData.append(key, courseData[key])
		}
	})

	const response = await api.post(`${API}/course/`, formData, {
		headers: {
			// Axios обычно сам выставляет нужный Content-Type для FormData,
			// но явное указание защищает от некоторых багов
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}

export const GetAllCourses = async () => {
	const response = await api.get(`${API}/course`)
	return response.data
}

export const GetAllAvailableCoursesForStudent = async () => {
	const response = await api.get(`${API}/student/courses/available`)
	return response.data
}

export const GetAllCoursesForStudent = async () => {
	const response = await api.get(`${API}/course/preview/students`)
	return response.data
}

export const GetAllCoursesForTeacher = async () => {
	const response = await api.get(`${API}/course/teacher/created`)
	return response.data
}

export const ReadCourseById = async course_id => {
	const response = await api.get(`${API}/course/${course_id}/content`)
	return response.data
}

export const GetCertificates = async () => {
	const response = await api.get(`${API}/course/certificate-types`)
	return response.data
}
export const GetFormats = async () => {
	const response = await api.get(`${API}/course/formats`)
	return response.data
}

export const CreateModule = async (name, course_id) => {
	const response = await api.post(`${API}/course/module/`, { name, course_id })
	return response.data
}
export const CreateLesson = async (name, module_content_type, module_id) => {
	const response = await api.post(`${API}/course-module/content/`, {
		name,
		module_content_type,
		module_id,
	})
	return response.data
}
