import CourseCard from '../components/Cards'
import { motion, AnimatePresence } from 'framer-motion'
import {
	ArrowBigDown,
	ArrowDown,
	ArrowRight,
	Award,
	Blocks,
	BookOpen,
	Calendar,
	Clock,
	Layers,
	LayoutGrid,
	RussianRuble,
	User,
	X,
} from 'lucide-react'
import {
	DateInput,
	FileInput,
	FileInputZone,
	InputDefault,
	InputPrice,
	OptionInputWithSearch,
	OptionSearch,
	TextArea,
} from '../components/Inputs'
import { useEffect, useState } from 'react'
import { Checkbox, RadioButton } from '../components/Buttons'
import { AddTag, GetTags } from '../../service/APIs/CourseTagsSpecific'
import {
	CreateCourse,
	GetAllAvailableCoursesForStudent,
	GetAllCourses,
	GetAllCoursesForStudent,
	GetAllCoursesForTeacher,
	GetCertificates,
	GetFormats,
} from '../../service/APIs/Couses'
import Modal from '../components/Modal'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { GetCourseInfoById } from '../../service/APIs/Moderation'
import { Me } from '../../service/APIs/Authorization'

const CourseViewForStudent = ({ data, onApply }) => {
	const navigate = useNavigate()
	// Красивое форматирование дат
	const formatDate = (dateStr, includeYear = false) => {
		if (!dateStr) return ''
		return new Date(dateStr).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: includeYear ? 'numeric' : undefined,
		})
	}

	// Проверка, идет ли еще регистрация
	const isRegistrationOpen = data.registration_end
		? new Date(data.registration_end) > new Date()
		: true

	return (
		<div className='w-full max-w-6xl mx-auto p-2 rounded-4xl'>
			<div className='grid grid-cols-12 gap-8 lg:gap-12 p-4 md:p-6'>
				{/* ЛЕВАЯ КОЛОНКА: Закрепленный виджет действия (Превью + Кнопка + Быстрые даты) */}
				<div className='col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6 h-fit'>
					{/* Картинка-превью */}
					<div className='relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md bg-[var(--light-gray)]/50'>
						{data.preview_url ? (
							<img
								src={data.preview_url}
								alt={data.name}
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
								<BookOpen size={48} />
							</div>
						)}
					</div>

					{/* Виджет покупки/записи (Glassmorphism-эффект или чистый белый) */}
					<div className='flex flex-col p-6 rounded-3xl border border-[var(--light-middle)]/30 bg-[var(--light-gray)]/10 shadow-sm gap-5'>
						{/* Блок цены */}
						<div className='flex flex-col gap-1'>
							<span className='text-xs font-normal text-[var(--middle)] uppercase tracking-wider'>
								Стоимость обучения
							</span>
							<p className='text-3xl flex gap-1 items-center font-bold text-[var(--hero)]'>
								{data.is_free ? 'Бесплатно' : `${data.price?.toLocaleString()}`}
								{!data.is_free && <RussianRuble size={22} strokeWidth={2.5} />}
							</p>
						</div>

						<hr className='border-[var(--light-middle)]/30' />

						{/* Краткие важные дедлайны */}
						<div className='flex flex-col gap-3 text-sm'>
							<div className='flex items-center justify-between'>
								<span className='text-[var(--middle)] flex items-center gap-2'>
									<Clock size={16} className='text-orange-500' /> Регистрация
									до:
								</span>
								<span className='font-semibold text-orange-600'>
									{formatDate(data.registration_end)}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-[var(--middle)] flex items-center gap-2'>
									<Calendar size={16} className='text-[var(--hero)]' /> Старт
									курса:
								</span>
								<span className='font-semibold text-[var(--black)]'>
									{formatDate(data.start_date, true)}
								</span>
							</div>
						</div>

						{/* Главная кнопка действия */}
						<button
							onClick={() => navigate(`/request/${data.id}`)}
							disabled={!isRegistrationOpen}
							className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[101%] active:scale-[99%] cursor-pointer
                                ${
																	isRegistrationOpen
																		? 'bg-[var(--hero)] text-white hover:bg-[var(--hero-hover)]'
																		: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed shadow-none'
																}`}
						>
							{isRegistrationOpen ? (
								<>
									Подать заявку на курс
									<ArrowRight size={18} />
								</>
							) : (
								'Регистрация окончена'
							)}
						</button>
					</div>
				</div>

				{/* ПРАВАЯ КОЛОНКА: Детальная информация о курсе */}
				<div className='col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-8'>
					{/* Хедер курса: Тег и Название */}
					<div className='flex flex-col gap-4'>
						{data.tag && (
							<span className='flex items-center gap-1.5 px-4 py-1.5 bg-[var(--transparent-hero)] text-[var(--hero)] rounded-full w-fit text-xs font-semibold uppercase tracking-wide'>
								{data.tag}
							</span>
						)}
						<h1 className='text-3xl md:text-4xl font-bold leading-tight text-[var(--black)]'>
							{data.name}
						</h1>
					</div>

					{/* Блок характеристик (Грид) */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-[var(--light-gray)]/30 border border-[var(--light-middle)]/20'>
						<div className='flex items-start gap-3.5'>
							<div className='p-2.5 bg-[var(--white)] rounded-xl shadow-sm text-[var(--hero)] shrink-0'>
								<Layers size={20} />
							</div>
							<div className='flex flex-col'>
								<span className='text-xs text-[var(--middle)]'>
									Формат обучения
								</span>
								<span className='text-sm font-semibold text-[var(--black)] mt-0.5'>
									{data.format_name}
								</span>
							</div>
						</div>

						<div className='flex items-start gap-3.5'>
							<div className='p-2.5 bg-[var(--white)] rounded-xl shadow-sm text-[var(--hero)] shrink-0'>
								<Award size={20} />
							</div>
							<div className='flex flex-col'>
								<span className='text-xs text-[var(--middle)]'>
									Итоговый документ
								</span>
								<span
									className='text-sm font-semibold text-[var(--black)] mt-0.5'
									title={data.certificate_type_name}
								>
									{data.certificate_type_name}
								</span>
							</div>
						</div>

						<div className='flex items-start gap-3.5 border-t border-[var(--light-middle)]/20 sm:border-t-0 pt-3 sm:pt-0'>
							<div className='p-2.5 bg-[var(--white)] rounded-xl shadow-sm text-[var(--hero)] shrink-0'>
								<Calendar size={20} />
							</div>
							<div className='flex flex-col'>
								<span className='text-xs text-[var(--middle)]'>
									Период обучения
								</span>
								<span className='text-sm font-semibold text-[var(--black)] mt-0.5'>
									{formatDate(data.start_date)} —{' '}
									{formatDate(data.end_date, true)}
								</span>
							</div>
						</div>

						<div className='flex items-start gap-3.5 border-t border-[var(--light-middle)]/20 pt-3'>
							<div className='p-2.5 bg-[var(--white)] rounded-xl shadow-sm text-[var(--hero)] shrink-0'>
								<Clock size={20} />
							</div>
							<div className='flex flex-col'>
								<span className='text-xs text-[var(--middle)]'>
									Прием заявок
								</span>
								<span className='text-sm font-semibold text-[var(--black)] mt-0.5'>
									с {formatDate(data.registration_start)} до{' '}
									{formatDate(data.registration_end)}
								</span>
							</div>
						</div>
					</div>

					{/* Описание курса */}
					<div className='flex flex-col gap-3'>
						<h3 className='text-xl font-bold text-[var(--black)] flex items-center gap-2'>
							О курсе
						</h3>
						<p className='text-md font-normal leading-relaxed text-[var(--middle)] whitespace-pre-line'>
							{data.description}
						</p>
					</div>

					{/* Блок автора курса */}
					{data.creator && (
						<div className='mt-4 pt-6 border-t border-[var(--light-middle)]/40'>
							<h4 className='text-sm font-medium text-[var(--middle)] uppercase tracking-wider mb-4'>
								Эксперт курса
							</h4>
							<div className='flex items-center gap-4 p-4 rounded-2xl w-fit min-w-[280px]'>
								<div className='w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-inner'>
									{data.creator.avatar_url ? (
										<img
											src={data.creator.avatar_url}
											alt='Avatar'
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center bg-[var(--light-gray)] text-[var(--middle)]'>
											<User size={24} />
										</div>
									)}
								</div>
								<div className='flex flex-col'>
									<p className='text-base font-bold text-[var(--black)] leading-tight'>
										{data.creator.last_name} {data.creator.first_name}{' '}
										{data.creator.patronymic}
									</p>
									<p className='text-xs text-[var(--middle)] mt-1'>
										Преподаватель LMS
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

const CreateModal = ({ onChange }) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [img, setImg] = useState(null)
	const [categories, setCategories] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isFree, setIsFree] = useState(null)
	const [price, setPrice] = useState(null)
	const [regStartDate, setRegStartDate] = useState(null)
	const [regEndDate, setRegEndDate] = useState(null)
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)
	const [certificate, setCertificate] = useState([])
	const [selectedCertificate, setSelectedCertificate] = useState(null)
	const [format, setFormat] = useState([])
	const [selectedFormat, setSelectedFormat] = useState(null)

	const [isTitleValid, setIsTitleValid] = useState(false)
	const [isDescriptionValid, setIsDescriptionValid] = useState(false)
	const [isCategoryValid, setIsCategoryValid] = useState(false)
	const [isFileValid, setIsFileValid] = useState(false)
	const [isPriceValid, setIsPriceValid] = useState(false)
	const [isCertificateValid, setIsCertificateValid] = useState(false)
	const [isFormatValid, setIsFormatValid] = useState(false)

	const isDateValid = Boolean(
		regStartDate && regEndDate && startDate && endDate,
	)

	const isFormValid =
		isTitleValid &&
		isDescriptionValid &&
		isCategoryValid &&
		isFileValid &&
		isCertificateValid &&
		isFormatValid &&
		isDateValid

	useEffect(() => {
		const getTags = async () => {
			try {
				const res = await GetTags()
				setCategories(res)
			} catch (err) {}
		}
		const getCertificates = async name => {
			try {
				const res = await GetCertificates()
				setCertificate(res)
			} catch (err) {}
		}
		const getFormats = async name => {
			try {
				const res = await GetFormats()
				setFormat(res)
			} catch (err) {}
		}
		getCertificates()
		getFormats()
		getTags()
	}, [])

	const addTag = async name => {
		try {
			const res = await AddTag(name)
		} catch (err) {}
	}

	const handleSubmit = async e => {
		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault()
		}

		// Собираем объект в строгом соответствии с тем, что ждет бэкенд
		const dataToSend = {
			name: title, // У тебя стейт 'title', а бэкенд ждет 'name'
			description: description,
			preview_image: img, // Твой стейт 'img' идет в 'preview_image'

			is_free: isFree,
			price: price,

			registration_start: regStartDate,
			registration_end: regEndDate,

			start_date: startDate,
			end_date: endDate,

			// Вытаскиваем id, если объект выбран, иначе передаем null
			tag_id: selectedCategory ? selectedCategory.id : null,
			certificate_type_id: selectedCertificate ? selectedCertificate.id : null,
			format_id: selectedFormat ? selectedFormat.id : null,
		}

		try {
			// Отправляем собранный объект в нашу функцию
			await CreateCourse(dataToSend)
			onChange?.()
		} catch (error) {
			console.error('Ошибка при создании курса:', error)
		}
	}

	return (
		<div className=''>
			<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
				Создание курса
			</h2>

			<form
				action={() => handleSubmit()}
				className='w-[600px] max-md:w-[80vw] inline-flex flex-col items-center gap-5'
			>
				<InputDefault
					title='Название курса'
					placeholder='Введите название...'
					value={title}
					onChange={e => setTitle(e.target.value)}
					validate={val => val.length >= 3}
					onStatusChange={setIsTitleValid}
					required
				/>
				<TextArea
					title='Описание курса'
					placeholder='Введите описание...'
					value={description}
					onChange={e => setDescription(e.target.value)}
					validate={val => val.length >= 10}
					onStatusChange={setIsDescriptionValid}
					required
				/>
				<OptionInputWithSearch
					title='Категория'
					required
					options={categories}
					placeholder='Выберите категорию'
					labelKey='name'
					value={selectedCategory}
					onSelect={item => {
						setSelectedCategory(item)
						setIsCategoryValid(true)
					}}
					onCreate={name => addTag(name)}
					CreateOrNot={true}
				/>
				<div className='grid grid-cols-2 gap-3 w-full'>
					<DateInput
						text={'text-md'}
						title='Дата начала регистрации'
						required
						value={regStartDate}
						onChange={val => setRegStartDate(val)}
					/>
					<DateInput
						text={'text-md'}
						title='Дата окончания регистрации'
						required
						value={regEndDate}
						onChange={val => setRegEndDate(val)}
					/>
					<DateInput
						text={'text-md'}
						title='Дата начала курса'
						required
						value={startDate}
						onChange={val => setStartDate(val)}
					/>
					<DateInput
						text={'text-md'}
						title='Дата конца курса'
						required
						value={endDate}
						onChange={val => setEndDate(val)}
					/>
				</div>
				<Checkbox text={'Платный курс'} onChange={data => setIsFree(!data)}>
					<InputPrice
						step={Number(import.meta.env.VITE_PRICE_STEP)}
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</Checkbox>
				<OptionInputWithSearch
					title='Сертификат'
					required
					options={certificate}
					placeholder='Выберите сертификат'
					labelKey='name'
					value={selectedCertificate}
					onSelect={item => {
						setSelectedCertificate(item)
						setIsCertificateValid(true)
					}}
					CreateOrNot={true}
				/>
				<OptionInputWithSearch
					title='Формат'
					required
					options={format}
					placeholder='Выберите формат'
					labelKey='name'
					value={selectedFormat}
					onSelect={item => {
						setSelectedFormat(item)
						setIsFormatValid(true)
					}}
					CreateOrNot={true}
				/>
				<FileInputZone
					onFileChange={file => setImg(file)}
					onStatusChange={setIsFileValid}
				/>
				<input
					className={`px-12 py-3 font-medium text-xl rounded-2xl w-fit  transition ${
						isFormValid
							? 'bg-[var(--black)] text-[var(--white)] cursor-pointer hover:bg-[var(--hero)]  active:shadow-inner active:brightness-75 active:scale-99 '
							: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
					}`}
					type='submit'
					value='Создать курс'
					disabled={!isFormValid}
				/>
			</form>
		</div>
	)
}

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-4xl group hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all cursor-pointer h-full min-h-157 max-md:mb-30`}
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				{title}
			</span>
		</button>
	)
}

const Catalog = () => {
	const [userInfo, setUserInfo] = useState([])

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setUserInfo(res)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setRole(res.role)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	const { type = 'all' } = useParams() // Если type нет в URL, ставим 'all' по умолчанию
	const navigate = useNavigate()

	const options = [
		{ value: 'all', to: '/catalog/all', title: 'Все курсы' },
		{ value: 'patched', to: '/catalog/patched', title: 'Приобретенные' },
	]

	const NavigateTo = to => {
		navigate(to)
	}

	const [courses, setCourses] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [showArrow, setShowArrow] = useState(true)

	const [selectedCourse, setSelectedCourse] = useState(null)

	useEffect(() => {
		const getAllTeacherCourses = async () => {
			try {
				const res = await GetAllCoursesForTeacher()
				setCourses(res)
			} catch (err) {}
		}
		const getAllStudentCourses = async () => {
			try {
				const res = await GetAllCoursesForStudent()
				setCourses(res)
			} catch (err) {}
		}
		const getAllAvailableCoursesForStudent = async () => {
			try {
				const res = await GetAllAvailableCoursesForStudent()
				setCourses(res)
			} catch (err) {}
		}
		if (userInfo?.role === 'teacher') {
			getAllTeacherCourses()
		} else if (userInfo?.role === 'student') {
			if (type === 'all') {
				getAllStudentCourses()
			} else if (type === 'patched') {
				getAllAvailableCoursesForStudent()
			}
		}
	}, [userInfo, type])

	const handleScroll = e => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

		// Формула: полная высота контента минус прокрученная часть сверху
		// должна быть равна видимой высоте экрана (с погрешностью в 5px)
		const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5

		if (isAtBottom) {
			setShowArrow(false)
		} else {
			setShowArrow(true)
		}
	}

	const handleCourseClick = course => {
		if (userInfo?.role === 'teacher') {
			// Статусы, при которых преподаватель сразу переходит внутрь курса
			const editableOrActiveStatuses = ['draft', 'rejected', 'approved']

			if (editableOrActiveStatuses.includes(course.status)) {
				navigate(`/course/${course.id}`)
			} else {
				// Для pending_review и rejected_preview открываем превью/модалку модерации
				setSelectedCourse(course)
			}
		} else {
			if (type === 'all') {
				setSelectedCourse(course)
			} else if (type === 'patched') {
				navigate(`/course/${course.id}`)
			}
		}
	}

	return (
		<>
			<Modal
				width={'w-fit'}
				isOpen={selectedCourse !== null || isModalOpen}
				onClose={() => {
					setSelectedCourse(null)
					setIsModalOpen(false)
					setShowArrow(true)
				}}
			>
				{/* 1. Если выбран курс студентом */}
				{selectedCourse && (
					<div className='p-4 w-full'>
						<CourseViewForStudent
							data={selectedCourse}
							onApply={courseId => {
								console.log(`Подаем заявку на курс с ID: ${courseId}`)
								// Тут вызывай свою функцию API для записи студента
							}}
						/>
					</div>
				)}

				{/* 4. Если курс не выбран -> значит, это создание нового курса */}
				{!selectedCourse && (
					/* Обертка с relative, чтобы зафиксировать градиент внизу */
					<div className='relative h-[75vh]'>
						{/* Градиентный слой, который всегда "висит" вверху модалки */}
						<div className='pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-t to-[var(--white)] from-transparent' />

						{/* Контентный блок со скроллом */}
						<div
							className='px-4 pt-4 pb-12 h-full overflow-y-scroll hide-scrollbar'
							onScroll={handleScroll}
						>
							<CreateModal
								onChange={() => {
									setIsModalOpen(false)
									getAllTeacherCourses()
								}}
							/>
						</div>

						{/* Градиентный слой, который всегда "висит" внизу модалки */}
						<div className='pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--white)] to-transparent' />

						{/* Стрелочка с динамическим классом видимости */}
						<ArrowDown
							className={`absolute bottom-2 text-[var(--black)] left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${
								showArrow ? 'opacity-50' : 'opacity-0'
							}`}
						/>
					</div>
				)}
			</Modal>
			<div className='flex flex-col w-full gap-5 py-30'>
				{userInfo?.role === 'student' && (
					<div className='flex items-center gap-3'>
						{options?.map(option => (
							<RadioButton
								key={option.value}
								name='catalog-type'
								value={option.value}
								title={option.title}
								icon={option.icon}
								// Теперь checked железно сработает и на /catalog, и на /catalog/all
								checked={type === option.value}
								onChange={() => NavigateTo(option.to)}
							/>
						))}
					</div>
				)}

				<div
					className={`grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-5 `}
				>
					{courses?.map((course, index) => (
						<motion.div
							key={course.id}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: index * 0.1,
								ease: 'easeOut',
							}}
						>
							<CourseCard
								onClick={() => handleCourseClick(course)}
								status={userInfo?.role === 'teacher' && course.status}
								data={course}
							/>
						</motion.div>
					))}
					{userInfo?.role === 'teacher' && (
						<motion.div
							key={courses?.length + 1}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: courses?.length * 0.1,
								ease: 'easeOut',
							}}
						>
							<CreateBtn
								onClick={() => setIsModalOpen(true)}
								title='Создать новый курс'
							/>
						</motion.div>
					)}
				</div>
			</div>
		</>
	)
}

export default Catalog
