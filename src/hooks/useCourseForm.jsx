import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	createCourseRequest,
	updateCourseRequest,
	fetchDisciplinesRequest,
	fetchYearsRequest,
} from '../api/Courses'
import { fetchCourseById } from '../api/CoursePage'
import { toast } from 'sonner'

export const studyLevelOptions = [
	{ value: 0, label: 'Бакалавриат' },
	{ value: 2, label: 'Специалитет' },
	{ value: 1, label: 'Магистратура' },
]

const initialFormState = {
	title: '',
	description: '',
	selectedSemester: null,
	selectedStudyLevel: null,
	selectedCourses: null,
	img: null,
	default_image_url: null,
	selectedYearIdx: null,
	selectedDisciplineIdx: null,
}

export const useCourseForm = ({ onClose } = {}) => {
	const { courseId } = useParams()
	const isEdit = Boolean(courseId)
	const navigate = useNavigate()

	const [selectedTab, setSelectedTab] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [isFetchingCourse, setIsFetchingCourse] = useState(false)
	const [hintOpen, setHintOpen] = useState(null)

	const [yearsList, setYearsList] = useState([])
	const [disciplinesList, setDisciplinesList] = useState([])

	const [formData, setFormData] = useState(initialFormState)
	const [isNameValid, setIsNameValid] = useState(false)

	const getStudyLevelValue = useCallback(label => {
		const found = studyLevelOptions.find(item => item.label === label)
		return found !== undefined ? found.value : null
	}, [])

	// При получении данных курса заполняем default_image_url
	useEffect(() => {
		let isMounted = true

		if (isEdit) {
			setIsFetchingCourse(true)
			fetchCourseById(courseId)
				.then(res => {
					if (!isMounted || !res) return
					setFormData({
						title: res.name || '',
						description: res.description || '',
						selectedSemester: res.semester ? String(res.semester) : null,
						selectedStudyLevel: getStudyLevelValue(res.study_level),
						selectedCourses: res.course ? Number(res.course) : null,
						img: res.image || null,
						default_image_url: res.default_image_url || res.image || null,
						selectedYearIdx: null,
						selectedDisciplineIdx: null,
					})
					setIsNameValid(Boolean(res.name?.trim()))
				})
				.catch(err => console.error('Ошибка загрузки курса:', err))
				.finally(() => {
					if (isMounted) setIsFetchingCourse(false)
				})
		} else {
			setFormData(initialFormState)
			setIsNameValid(false)
		}

		return () => {
			isMounted = false
		}
	}, [courseId, isEdit, getStudyLevelValue])

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleDirectChange = (name, value) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const isForm1Valid = isNameValid
	const isForm2Valid = formData.selectedDisciplineIdx !== null

	// Справочники для вкладки "По нагрузке"
	useEffect(() => {
		if (selectedTab === 1) {
			fetchYearsRequest()
				.then(data => setYearsList(data))
				.catch(err => console.error('Ошибка при загрузке лет:', err))
		} else {
			setDisciplinesList([])
			handleDirectChange('selectedDisciplineIdx', null)
		}
	}, [selectedTab])

	useEffect(() => {
		const { selectedYearIdx, selectedSemester } = formData
		if (
			selectedYearIdx !== null &&
			selectedSemester !== null &&
			yearsList[selectedYearIdx]
		) {
			fetchDisciplinesRequest(yearsList[selectedYearIdx], selectedSemester)
				.then(data => setDisciplinesList(data))
				.catch(err => console.error('Ошибка при загрузке дисциплин:', err))
		}
	}, [formData.selectedYearIdx, formData.selectedSemester, yearsList])

	// Отправка формы (POST или PUT)
	const handleSubmit = async e => {
		if (e) e.preventDefault()

		const isFromLoad = selectedTab === 1
		if (
			!isEdit &&
			((!isFromLoad && !isForm1Valid) || (isFromLoad && !isForm2Valid))
		) {
			return
		}

		setIsLoading(true)

		try {
			let payload = {}

			if (!isFromLoad) {
				payload = {
					name: formData.title,
					description: formData.description,
					semester: formData.selectedSemester,
					course: formData.selectedCourses,
					study_level:
						formData.selectedStudyLevel === null
							? null
							: studyLevelOptions.find(
									item => item.value === formData.selectedStudyLevel,
								)?.label,
					image: formData.img,
					default_image_url: formData.default_image_url,
				}
			} else {
				const activeDiscipline = disciplinesList[formData.selectedDisciplineIdx]
				payload = {
					name: activeDiscipline?.discipline,
					description: activeDiscipline?.study_plan,
					semester: activeDiscipline?.semester,
					course: activeDiscipline?.course,
					id_plan_strings: activeDiscipline?.id_plan_strings,
					study_plan: activeDiscipline?.study_plan,
					study_year: activeDiscipline?.study_year,
					image: formData.img,
					default_image_url: formData.default_image_url,
				}
			}

			if (isEdit) {
				await updateCourseRequest(courseId, payload)
				toast.success('Курс успешно обновлен!')
			} else {
				await createCourseRequest(payload, isFromLoad)
				toast.success('Курс успешно создан!')
				window.dispatchEvent(new Event('courses:updated'))
			}

			if (onClose) {
				onClose()
			} else {
				navigate(-1)
			}
		} catch (error) {
			if (isEdit) {
				toast.error('Ошибка обновления курса!')
			} else {
				toast.error('Ошибка создания курса!')
			}

			console.error('Ошибка отправки формы:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		selectedTab,
		setSelectedTab,
		isLoading: isLoading || isFetchingCourse,
		isFetchingCourse,
		hintOpen,
		setHintOpen,
		yearsList,
		disciplinesList,
		formData,
		isEdit,
		setIsNameValid,
		handleChange,
		handleDirectChange,
		handleSubmit,
		isForm1Valid,
		isForm2Valid,
	}
}
