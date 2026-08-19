import { useState, useEffect } from 'react'

export const useCreateCourseForm = ({ onCreate, onClose }) => {
	const [selectedTab, setSelectedTab] = useState(0)
	const [isCreateLoading, setIsCreateLoading] = useState(false)
	const [hintOpen, setHintOpen] = useState(null)

	const [yearsList, setYearsList] = useState([])
	const [disciplinesList, setDisciplinesList] = useState([])

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		selectedSemester: null,
		selectedStudyLevel: null,
		selectedCourses: null,
		img: null,
		selectedYearIdx: null,
		selectedDisciplineIdx: null,
	})

	const [isNameValid, setIsNameValid] = useState(false)

	// Хэндлеры изменения состояния
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleDirectChange = (name, value) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	// Валидация форм перед отправкой
	const isForm1Valid = isNameValid
	const isForm2Valid = formData.selectedDisciplineIdx !== null

	// Очистка формы
	const resetForm = () => {
		setFormData({
			title: '',
			description: '',
			selectedSemester: null,
			selectedStudyLevel: null,
			selectedCourses: null,
			img: null,
			selectedYearIdx: null,
			selectedDisciplineIdx: null,
		})
		setDisciplinesList([])
	}

	// Эффекты загрузки справочников из API
	useEffect(() => {
		if (selectedTab === 1) {
			fetchYearsRequest()
				.then(data => setYearsList(data))
				.catch(err => console.error(err))
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
				.catch(err => console.error(err))
		}
	}, [formData.selectedYearIdx, formData.selectedSemester, yearsList])

	// Сброс курса для Магистратуры, если выбран курс > 2
	useEffect(() => {
		if (formData.selectedStudyLevel === 1 && formData.selectedCourses > 2) {
			handleDirectChange('selectedCourses', null)
		}
	}, [formData.selectedStudyLevel])

	// Отправка формы
	const handleSubmit = async e => {
		e.preventDefault()

		const isFromLoad = selectedTab === 1
		if ((!isFromLoad && !isForm1Valid) || (isFromLoad && !isForm2Valid)) return

		setIsCreateLoading(true)

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
							: study_level_options.find(
									item => item.value === formData.selectedStudyLevel,
								)?.label,
					image: formData.img,
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
				}
			}

			const createdCourse = await CreateCourse(payload, isFromLoad)

			if (onCreate) onCreate(createdCourse)
			if (onClose) onClose()
			resetForm()
		} catch (error) {
			if (error.response) {
				console.error(
					'Ошибка сервера:',
					error.response.status,
					error.response.data,
				)
			} else {
				console.error('Ошибка сети:', error.message)
			}
		} finally {
			setIsCreateLoading(false)
		}
	}

	return {
		selectedTab,
		setSelectedTab,
		isCreateLoading,
		hintOpen,
		setHintOpen,
		yearsList,
		disciplinesList,
		formData,
		setIsNameValid,
		handleChange,
		handleDirectChange,
		handleSubmit,
		isForm1Valid,
		isForm2Valid,
	}
}
