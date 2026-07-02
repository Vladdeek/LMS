import { useScroll } from 'framer-motion'
import {
	InputDefault,
	OptionInput,
	FileInput,
	useInput,
	DateInput,
	MaskInput,
} from '../components/Inputs'
import { useEffect, useState } from 'react'
import { ChevronDown, CircleCheck } from 'lucide-react'
import { GetCourseInfoById } from '../../service/APIs/Moderation'
import { useParams } from 'react-router-dom'
import {
	createCourseRequest,
	GetСitizenship,
	GetEducationInstitution,
} from '../../service/APIs/Request'

const StudentCourseRequest = () => {
	const { courseId } = useParams()
	const [courseInfo, setCourseInfo] = useState()
	const [citizenship, setСitizenship] = useState([])
	const [educationInstitution, setEducationInstitution] = useState([])

	const [formData, setFormData] = useState({
		first_name_nominative: '',
		last_name_nominative: '',
		patronymic_nominative: '',
		first_name_genitive: '',
		last_name_genitive: '',
		patronymic_genitive: '',
		last_name_diploma: '',
		marriage_certificate_scan: null,
		citizenship: '',
		gender: '',
		birth_date: '',
		snils: '',
		snils_scan: null,
		job_region: '',
		job_place: '',
		job_title: '',
		diploma_series: '',
		diploma_number: '',
		diploma_scan: null,
		education_level: '',
		diploma_qualification: '',
		education_institution_name: '',
		education_institution_name_missed: '',
		identity_document_type: '',
		number_and_series: '',
		issued_by: '',
		issue_date: '',
		registration_address: '',
		phone: '',
		email: '',
	})

	console.log('Текущая дата формы:', formData)

	useEffect(() => {
		const GetCourseInfo = async () => {
			try {
				const res = await GetCourseInfoById(courseId)
				setCourseInfo(res)
			} catch (err) {}
		}
		GetCourseInfo()
	}, [courseId])

	useEffect(() => {
		const getСitizenship = async () => {
			try {
				const res = await GetСitizenship()
				const formattedCitizenship = res.map(item => ({
					value: item.id,
					label: item.name,
				}))
				setСitizenship(formattedCitizenship)
			} catch (err) {
				console.error(err)
			}
		}

		const getEducationInstitution = async () => {
			try {
				const res = await GetEducationInstitution()
				const formattedEducation = res.map(item => ({
					value: item.id,
					label: item.name,
				}))
				setEducationInstitution(formattedEducation)
			} catch (err) {
				console.error(err)
			}
		}

		getСitizenship()
		getEducationInstitution()
	}, [])

	// Универсальный хэндлер
	const handleChange = (e, customValue) => {
		// 1. Стандартный инпут (через event)
		if (e && e.target) {
			const { name, value, type, files } = e.target
			// Если это дефолтный инпут типа файл
			const finalValue = type === 'file' ? files[0] : value

			setFormData(prev => ({
				...prev,
				[name]: finalValue,
			}))
		}
		// 2. Кастомный инпут (когда напрямую передается имя поля и значение/файл)
		else if (typeof e === 'string') {
			setFormData(prev => ({
				...prev,
				[e]: customValue,
			}))
		}
	}

	const handleSubmit = async e => {
		// Защита от перезагрузки страницы при классическом сабмите
		if (e && e.preventDefault) e.preventDefault()

		const finalData = {
			...formData,
			course_id: courseId,
			marriage_certificate_scan: formData.marriage_certificate_scan || null,
			education_institution_name: formData.education_institution_name || null,
			education_institution_name_missed:
				formData.education_institution_name_missed || null,
		}

		try {
			const result = await createCourseRequest(finalData)
			console.log('Успешно отправлено:', result)
		} catch (err) {
			console.error('Ошибка при отправке:', err)
		}
	}

	return (
		<form
			onSubmit={handleSubmit} /* Изменили action на классический onSubmit */
			className='w-[50vw] mx-auto pt-25 mb-25 flex flex-col gap-3'
		>
			<p className='text-3xl text-[var(--black)] font-semibold'>
				Заявка на обучение по программе "{courseInfo?.name}"
			</p>

			<div className='grid grid-cols-3 w-full gap-3'>
				<InputDefault
					title='Фамилия (в именительном падеже)'
					name='last_name_nominative'
					value={formData.last_name_nominative}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Имя (в именительном падеже)'
					name='first_name_nominative'
					value={formData.first_name_nominative}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Отчество (в именительном падеже)'
					name='patronymic_nominative'
					value={formData.patronymic_nominative}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Фамилия (в родительном падеже)'
					description={'Иванов(-а)'}
					name='last_name_genitive'
					value={formData.last_name_genitive}
					onChange={handleChange}
					validate={val => val.length >= 0}
					required={true}
				/>
				<InputDefault
					title='Имя (в родительном падеже)'
					description={'Иван(-а)'}
					name='first_name_genitive'
					value={formData.first_name_genitive}
					onChange={handleChange}
					validate={val => val.length >= 0}
					required={true}
				/>
				<InputDefault
					title='Отчество (в родительном падеже)'
					description={'Иванович(-а)'}
					name='patronymic_genitive'
					value={formData.patronymic_genitive}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
			</div>

			<div className='w-full'>
				<InputDefault
					title='Фамилия, указанная в дипломе о ВО или СПО (без инициалов)'
					description={'Указать фамилию из диплома...'}
					name='last_name_diploma'
					value={formData.last_name_diploma}
					onChange={handleChange}
					validate={val => val.length >= 0}
					required={true}
				/>
			</div>

			<div className='w-full'>
				<FileInput
					title='Скан свидетельства о браке / смене имени (при наличии)'
					name='marriage_certificate_scan'
					value={formData.marriage_certificate_scan || ''}
					/* Явно передаем имя поля и пришедший из FileInput файл */
					onChange={file => handleChange('marriage_certificate_scan', file)}
					validate={val => val.length >= 0}
					accept='application/pdf,image/jpeg,image/png, .pdf, .jpg, .jpeg, .png'
				/>
			</div>

			<div className='grid grid-cols-2 gap-3'>
				<OptionInput
					title={'Гражданство'}
					required={true}
					options={citizenship}
					/* Передаем через handleChange */
					onChange={obj => handleChange('citizenship', obj ? obj.value : '')}
				/>
				<OptionInput
					title={'Пол'}
					required={true}
					options={[
						{ label: 'Мужской', value: 'Мужской' },
						{ label: 'Женский', value: 'Женский' },
					]}
					onChange={obj => handleChange('gender', obj ? obj.value : '')}
				/>
				<DateInput
					title='Дата рождения'
					required
					value={formData.birth_date}
					onChange={val => handleChange('birth_date', val)}
				/>
				<MaskInput
					title='СНИЛС'
					mask='XXX-XXX-XXX XX'
					required
					onChange={val => handleChange('snils', val)}
				/>
			</div>

			<div className='w-full'>
				<FileInput
					title='Скан-копия СНИЛС'
					description={'Допустимые форматы файлов: PDF, JPEG, PNG'}
					required
					name='snils_scan'
					value={formData.snils_scan}
					/* Явно передаем имя поля и файл */
					onChange={file => handleChange('snils_scan', file)}
					validate={val => val.length >= 0}
					accept='application/pdf,image/jpeg,image/png, .pdf, .jpg, .jpeg, .png'
				/>
			</div>

			<div className='grid grid-cols-3 w-full gap-3'>
				<InputDefault
					title='Регион места работы'
					required
					name='job_region'
					value={formData.job_region}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Место работы (или учебное заведение для обучающихся)'
					required
					description={'Указать краткое или полное официальное название...'}
					name='job_place'
					value={formData.job_place}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Должность (курс обучения)'
					required
					name='job_title'
					value={formData.job_title}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
			</div>

			<p className='text-xl text-[var(--black)]'>Сведения об образовании</p>
			<div className='grid grid-cols-2 gap-3'>
				<InputDefault
					title='Серия диплома об образовании'
					required
					description={'Указать серию диплома...'}
					name='diploma_series'
					value={formData.diploma_series}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Номер диплома об образовании'
					required
					description={'Указать номер диплома...'}
					name='diploma_number'
					value={formData.diploma_number}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
			</div>

			<div className='w-full'>
				<FileInput
					title='Скан-копия диплома об образовании'
					required
					name='diploma_scan'
					value={formData.diploma_scan}
					/* Явно передаем имя поля и файл */
					onChange={file => {
						console.log(file)
						handleChange('diploma_scan', file)
					}}
					validate={val => val.length >= 0}
					accept='application/pdf,image/jpeg,image/png, .pdf, .jpg, .jpeg, .png'
				/>
			</div>

			<div className='grid grid-cols-2 gap-3'>
				<OptionInput
					title={'Уровень образования'}
					required={true}
					options={[
						{ label: 'Бакалавриат', value: 'Бакалавриат' },
						{ label: 'Специалитет', value: 'Специалитет' },
						{ label: 'Магистратура', value: 'Магистратура' },
						{ label: 'Аспирантура', value: 'Аспирантура' },
					]}
					onChange={obj =>
						handleChange('education_level', obj ? obj.value : '')
					}
				/>
				<InputDefault
					title='Квалификация по диплому'
					required
					name='diploma_qualification'
					value={formData.diploma_qualification}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<OptionInput
					title={'Полное наименование учебного заведения'}
					required={true}
					options={educationInstitution}
					onChange={obj =>
						handleChange('education_institution_name', obj ? obj.value : '')
					}
				/>
				<InputDefault
					title='Если Вашего учебного заведения нет в списке, укажите его название здесь:'
					name='education_institution_name_missed'
					value={formData.education_institution_name_missed || ''}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
			</div>

			<p className='text-xl text-[var(--black)]'>Удостоверение личности</p>
			<div className='grid grid-cols-2 gap-3'>
				<InputDefault
					title='Тип документа, удостоверяющего личность'
					required
					name='identity_document_type'
					value={formData.identity_document_type}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<MaskInput
					title='Серия и номер документа'
					mask='XXXX XXXXXX'
					required
					onChange={val => handleChange('number_and_series', val)}
				/>
				<InputDefault
					title='Кем выдан документ'
					required
					name='issued_by'
					value={formData.issued_by}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
				<DateInput
					title='Дата выдачи документа'
					required
					value={formData.issue_date}
					onChange={val => handleChange('issue_date', val)}
				/>
			</div>

			<div className='w-full'>
				<InputDefault
					title='Адрес регистрации'
					required
					name='registration_address'
					value={formData.registration_address}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
			</div>

			<p className='text-xl text-[var(--black)]'>Контакты</p>
			<div className='grid grid-cols-2 gap-3'>
				<MaskInput
					title='Телефон'
					mask='+X (XXX) XXX-XX-XX'
					required
					onChange={val => handleChange('phone', val)}
				/>
				<InputDefault
					title='Действующий адрес электронной почты (e-mail)'
					required
					name='email'
					value={formData.email}
					onChange={handleChange}
					validate={val => val.length >= 0}
				/>
			</div>

			<div className='flex gap-3 w-full items-center justify-start'>
				<button
					type='submit'
					className='px-6 py-3 bg-[var(--hero)] text-white rounded-2xl shadow-[var(--shadow)] active:scale-99 active:shadow-inner active:brightness-90 transition-all cursor-pointer'
				>
					Создать
				</button>
				<button
					type='button'
					className='px-6 py-3 text-[var(--black)] bg-[var(--light-middle)] rounded-2xl active:shadow-inner active:brightness-90 active:scale-99 transition-all cursor-pointer'
				>
					Отмена
				</button>
			</div>
		</form>
	)
}

export default StudentCourseRequest
