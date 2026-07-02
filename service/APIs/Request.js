import api, { API } from '../../src/API'

export const CreateRequest = async courseData => {
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

export const GetСitizenship = async () => {
	const response = await api.get(`${API}/citizenships/list`)
	return response.data
}
export const GetEducationInstitution = async () => {
	const response = await api.get(`${API}/education-institutions/listed`)
	return response.data
}

export const createCourseRequest = async data => {
	console.log('data: ', data)
	const response = await api.post(`${API}/course-request`, data, {
		headers: {
			// Axios обычно сам выставляет нужный Content-Type для FormData,
			// но явное указание защищает от некоторых багов
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data
}

export const GetCourseRequestById = async request_id => {
	const response = await api.get(`${API}/course-request/${request_id}`)
	return response.data
}

export const UpdateRequestStatus = async (request_id, status) => {
	const response = await api.patch(`${API}/course-request/${request_id}`, {
		status,
	})
	return response.data
}
