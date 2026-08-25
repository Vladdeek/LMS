import { API_URL } from '../API'
import api from './client'

export const fetchCoursesApi = async ({
	sortFilter,
	selectedSemester,
	selectedStatus,
	selectedElvl,
	selectedCoursesOpt,
	sortingFilters,
	statusOptions,
	studyLevelMap,
}) => {
	let sortParam = null
	let sortValue = null

	const sort = sortingFilters[sortFilter]

	if (sort === 'по дате создания (новые)') {
		sortParam = 'sort_date'
		sortValue = 'desc'
	} else if (sort === 'по дате создания (старые)') {
		sortParam = 'sort_date'
		sortValue = 'asc'
	} else if (sort === 'по названию курса (А-Я)') {
		sortParam = 'sort_name'
		sortValue = 'asc'
	} else if (sort === 'по названию курса (Я-А)') {
		sortParam = 'sort_name'
		sortValue = 'desc'
	}

	const res = await api.get(`${API_URL}/courses/`, {
		params: {
			semester: selectedSemester,
			...(sortParam && { [sortParam]: sortValue }),
			...(selectedStatus !== null &&
				selectedStatus !== undefined && {
					course_status:
						statusOptions[selectedStatus] === 'Опубликован'
							? 'approved'
							: statusOptions[selectedStatus] === 'Не опубликован'
								? 'in_development'
								: 'pending',
				}),
			study_level: studyLevelMap[selectedElvl],
			course: selectedCoursesOpt,
		},
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	return res.data
}

// Загрузка списка учебных лет
export const fetchYearsRequest = async () => {
	const response = await api.get(`${API_URL}/years/`)
	return response.data
}

// Загрузка дисциплин по году и семестру
export const fetchDisciplinesRequest = async (year, semester) => {
	const response = await api.get(`${API_URL}/disciplines/`, {
		params: { year, semester },
	})
	return response.data
}

// Создание курса
// Создание курса
export const updateCourseRequest = async payload => {
	const formData = new FormData()

	// Наполнение FormData элементами из payload
	Object.keys(payload).forEach(key => {
		if (payload[key] !== undefined && payload[key] !== null) {
			// Если передается массив или файл
			if (Array.isArray(payload[key])) {
				payload[key].forEach(item => formData.append(key, item))
			} else {
				formData.append(key, payload[key])
			}
		}
	})

	const response = await api.put(`${API_URL}/courses/`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}
export const createCourseRequest = async payload => {
	const formData = new FormData()

	// Наполнение FormData элементами из payload
	Object.keys(payload).forEach(key => {
		if (payload[key] !== undefined && payload[key] !== null) {
			// Если передается массив или файл
			if (Array.isArray(payload[key])) {
				payload[key].forEach(item => formData.append(key, item))
			} else {
				formData.append(key, payload[key])
			}
		}
	})

	const response = await api.post(`${API_URL}/courses/`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}

export const deleteCourse = async courseId => {
	const response = await api.delete(`${API_URL}/course/delete/${courseId}`)
	return response.data
}
