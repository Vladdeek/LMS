import { useEffect, useState } from 'react'
import {
	AccessCourse,
	GetAllCoursesWithRequest,
	GetAllStudentRequests,
	GetCourseInfoById,
	GetModerationCourses,
} from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import { DefaultButton, ToggleButton } from '../../components/Buttons'
import Help from '../../components/Help'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseMiniCard } from '../../components/Cards'
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	CheckCircle2,
	CreditCard,
	RussianRuble,
	ShieldAlert,
	Tag,
	User,
	XCircle,
	FileText,
	Download,
	GraduationCap,
	Contact,
	ImageOff,
	Mail,
	ShieldCheck,
} from 'lucide-react'
import Modal from '../../components/Modal'
import { InputDefault } from '../../components/Inputs'
import {
	GetCourseRequestById,
	UpdateRequestStatus,
} from '../../../service/APIs/Request'

// Компонент текстовой строки просмотра
const TextStroke = ({ title, value, textarea }) => {
	return (
		<div className='flex flex-col gap-1 w-full'>
			{title && (
				<span className='text-xs md:text-sm font-medium text-[var(--middle)] ml-1 select-none'>
					{title}
				</span>
			)}

			{textarea ? (
				<div className='rounded-2xl p-4 bg-[var(--light-middle)]/10 text-[var(--black)] shadow-inner border-1 border-[var(--middle)]/3 min-h-32 whitespace-pre-wrap break-words leading-relaxed cursor-default select-text'>
					{value || '—'}
				</div>
			) : (
				<div className='rounded-2xl p-3 bg-[var(--light-middle)]/10 text-[var(--black)] shadow-inner border-1 border-[var(--middle)]/3 truncate cursor-default select-text font-medium'>
					{value || '—'}
				</div>
			)}
		</div>
	)
}

// Компонент отображения сканов / документов
const FileStrokeView = ({ title, fileUrl }) => {
	return (
		<div className='flex flex-col gap-1 w-full'>
			<span className='text-xs md:text-sm font-medium text-[var(--middle)] ml-1 select-none'>
				{title}
			</span>
			{fileUrl ? (
				<a
					href={fileUrl}
					target='_blank'
					rel='noreferrer'
					className='flex items-center justify-between rounded-2xl p-3 bg-[var(--transparent-hero)] text-[var(--hero)] border border-[var(--hero)]/10 hover:bg-[var(--transparent-hero)]/80 transition-all cursor-pointer font-medium'
				>
					<div className='flex items-center gap-2 truncate text-sm'>
						<FileText size={18} />
						<span className='truncate'>Открыть прикрепленный документ</span>
					</div>
					<Download size={16} className='shrink-0 ml-2' />
				</a>
			) : (
				<div className='rounded-2xl p-3 bg-[var(--light-middle)]/5 text-[var(--middle)]/60 border border-dashed border-[var(--light-middle)]/30 text-sm cursor-default select-none'>
					Не прикреплен
				</div>
			)}
		</div>
	)
}

// РЕЖИМ ПРОСМОТРА ЗАЯВКИ ПОЛЬЗОВАТЕЛЯ
const StudentCourseRequestView = ({ requestId, onClose }) => {
	const [courseInfo, setCourseInfo] = useState(null)

	// В будущем здесь будет useEffect(() => { fetchRequestInfo(requestId) }, [requestId])
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
		snils_scan: '',
		job_region: '',
		job_place: '',
		job_title: '',
		diploma_series: '',
		diploma_number: '',
		diploma_scan: '',
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

	useEffect(() => {
		const getCourseRequestById = async () => {
			try {
				const res = await GetCourseRequestById(requestId)
				setFormData(res)
			} catch (err) {
				console.error('Ошибка при загрузке курса:', err)
			}
		}
		if (requestId) getCourseRequestById()
	}, [requestId])

	const updateRequestStatus = async status => {
		try {
			const res = await UpdateRequestStatus(requestId, status)
			onClose()
		} catch (err) {
			console.error('Ошибка при загрузке курса:', err)
		}
	}

	return (
		<div className='w-full h-full flex flex-col gap-6 overflow-y-auto pr-2'>
			{/* Хедер просмотра */}
			<div className='space-y-3 border-b border-[var(--light-middle)]/20 pb-4 shrink-0'>
				<button
					onClick={onClose}
					className='flex items-center gap-2 text-sm font-medium text-[var(--middle)] hover:text-[var(--black)] transition-colors cursor-pointer'
				>
					<ArrowLeft size={16} /> Назад к списку участников
				</button>
				<div className='flex items-center gap-3'>
					<div className='p-2 bg-[var(--transparent-hero)] text-[var(--hero)] rounded-xl shrink-0'>
						<ShieldCheck size={24} />
					</div>
					<div>
						<span className='text-[10px] font-bold text-[var(--hero)] uppercase tracking-wider block'>
							Просмотр анкеты
						</span>
						<h1 className='text-lg text-[var(--black)] font-bold truncate max-w-xl'>
							Заявка #{requestId?.slice(0, 8)}... (
							{formData.last_name_nominative} {formData.first_name_nominative})
						</h1>
					</div>
				</div>
			</div>

			{/* Контент анкеты */}
			<div className='space-y-6 pb-6'>
				{/* СЕКЦИЯ 1: Личные данные */}
				<section className='space-y-4'>
					<div className='flex items-center gap-2 text-[var(--black)] font-bold text-base border-b border-[var(--light-gray)] pb-2'>
						<User size={18} className='text-[var(--hero)]' />
						Личные данные абитуриента
					</div>

					<p className='text-[10px] font-bold text-[var(--hero)] uppercase tracking-wider'>
						Именительный падеж
					</p>
					<div className='grid grid-cols-3 gap-3'>
						<TextStroke title='Фамилия' value={formData.last_name_nominative} />
						<TextStroke title='Имя' value={formData.first_name_nominative} />
						<TextStroke
							title='Отчество'
							value={formData.patronymic_nominative}
						/>
					</div>

					<p className='text-[10px] font-bold text-[var(--hero)] uppercase tracking-wider pt-1'>
						Родительный падеж
					</p>
					<div className='grid grid-cols-3 gap-3'>
						<TextStroke title='Фамилия' value={formData.last_name_genitive} />
						<TextStroke title='Имя' value={formData.first_name_genitive} />
						<TextStroke title='Отчество' value={formData.patronymic_genitive} />
					</div>

					<div className='grid grid-cols-2 gap-3 pt-1'>
						<TextStroke title='Гражданство' value={formData.citizenship} />
						<TextStroke title='Пол' value={formData.gender} />
						<TextStroke title='Дата рождения' value={formData.birth_date} />
						<TextStroke title='СНИЛС' value={formData.snils} />
					</div>
					<FileStrokeView
						title='Скан-копия СНИЛС'
						fileUrl={formData.snils_scan}
					/>
				</section>

				{/* СЕКЦИЯ 2: Паспорт */}
				<section className='space-y-4'>
					<div className='flex items-center gap-2 text-[var(--black)] font-bold text-base border-b border-[var(--light-gray)] pb-2'>
						<FileText size={18} className='text-[var(--hero)]' />
						Паспортные данные
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<TextStroke
							title='Тип документа'
							value={formData.identity_document_type}
						/>
						<TextStroke
							title='Серия и номер'
							value={formData.number_and_series}
						/>
						<TextStroke title='Дата выдачи' value={formData.issue_date} />
						<TextStroke title='Кем выдан' value={formData.issued_by} />
					</div>
					<TextStroke
						title='Адрес регистрации'
						value={formData.registration_address}
					/>
				</section>

				{/* СЕКЦИЯ 3: Образование */}
				<section className='space-y-4'>
					<div className='flex items-center gap-2 text-[var(--black)] font-bold text-base border-b border-[var(--light-gray)] pb-2'>
						<GraduationCap size={18} className='text-[var(--hero)]' />
						Сведения об образовании
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<TextStroke
							title='Уровень образования'
							value={formData.education_level}
						/>
						<TextStroke
							title='Квалификация по диплому'
							value={formData.diploma_qualification}
						/>
						<TextStroke title='Серия диплома' value={formData.diploma_series} />
						<TextStroke title='Номер диплома' value={formData.diploma_number} />
					</div>
					<TextStroke
						title='Наименование учебного заведения'
						value={
							formData.education_institution_name_missed ||
							formData.education_institution_name
						}
					/>
					<div className='grid grid-cols-2 gap-3'>
						<TextStroke
							title='Фамилия в дипломе'
							value={formData.last_name_diploma}
						/>
						<FileStrokeView
							title='Свидетельство о браке/смене имени'
							fileUrl={formData.marriage_certificate_scan}
						/>
					</div>
					<FileStrokeView
						title='Скан-копия диплома об образовании'
						fileUrl={formData.diploma_scan}
					/>
				</section>

				{/* СЕКЦИЯ 4: Работа */}
				<section className='space-y-4'>
					<div className='flex items-center gap-2 text-[var(--black)] font-bold text-base border-b border-[var(--light-gray)] pb-2'>
						<BookOpen size={18} className='text-[var(--hero)]' />
						Информация о занятости
					</div>
					<div className='grid grid-cols-3 gap-3'>
						<TextStroke title='Регион работы' value={formData.job_region} />
						<TextStroke title='Место работы / ВУЗ' value={formData.job_place} />
						<TextStroke title='Должность / Курс' value={formData.job_title} />
					</div>
				</section>

				{/* СЕКЦИЯ 5: Контакты */}
				<section className='space-y-4'>
					<div className='flex items-center gap-2 text-[var(--black)] font-bold text-base border-b border-[var(--light-gray)] pb-2'>
						<Contact size={18} className='text-[var(--hero)]' />
						Контакты для связи
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<TextStroke title='Телефон' value={formData.phone} />
						<TextStroke
							title='Электронная почта (e-mail)'
							value={formData.email}
						/>
					</div>
				</section>
			</div>
			<div className='flex gap-3 w-full items-center justify-end mb-2'>
				<button
					onClick={() => updateRequestStatus('accepted')}
					className='px-6 py-3 bg-[var(--black)] text-[var(--white)] hover:bg-[var(--green-base)] hover:text-[var(--green-surface)] rounded-2xl shadow-[var(--shadow)] active:scale-99 active:shadow-inner active:brightness-90 transition-all cursor-pointer'
				>
					Зачислить
				</button>
				<button
					onClick={() => updateRequestStatus('rejected')}
					className='px-6 py-3 text-[var(--black)] bg-[var(--light-middle)] hover:bg-[var(--red-base)] hover:text-[var(--red-surface)] rounded-2xl active:shadow-inner active:brightness-90 active:scale-99 transition-all cursor-pointer'
				>
					Отклонить
				</button>
			</div>
		</div>
	)
}

// ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ
const UsersTable = ({ courseId, onUserClick }) => {
	const [courseInfo, setCourseInfo] = useState({})
	// Фейк стейт пользователей — добавлены реальные ID для прокидывания query
	const [users, setUsers] = useState([])

	useEffect(() => {
		const getCourse = async () => {
			try {
				const res = await GetCourseInfoById(courseId)
				setCourseInfo(res)
			} catch (err) {
				console.error('Ошибка при загрузке курса:', err)
			}
		}
		if (courseId) getCourse()
	}, [courseId])

	useEffect(() => {
		const getAllStudentRequests = async () => {
			try {
				const res = await GetAllStudentRequests(courseId)
				setUsers(res)
			} catch (err) {
				console.error('Ошибка при загрузке курса:', err)
			}
		}
		if (courseId) getAllStudentRequests()
	}, [courseId])

	return (
		<div className='w-full h-full flex flex-col gap-6 overflow-y-auto p-2'>
			{/* ВЕРХНИЙ БЛОК: Краткая выжимка о курсе */}
			<div className='flex flex-col lg:flex-row gap-4 p-4 bg-[var(--white)] rounded-xl border border-[var(--light-middle)]/10 shadow-[var(--shadow)] items-start lg:items-center justify-between shrink-0'>
				<div className='flex gap-4 items-center min-w-0'>
					<div className='w-16 h-16 rounded-md overflow-hidden bg-[var(--light-gray)]/50 shrink-0 border border-[var(--light-middle)]/10'>
						{courseInfo.preview_url ? (
							<img
								src={courseInfo.preview_url}
								alt='Course Preview'
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
								<BookOpen size={22} />
							</div>
						)}
					</div>

					<div className='space-y-1 min-w-0'>
						<div className='flex items-center gap-2 text-[10px]'>
							<span className='font-bold text-[var(--hero)] bg-[var(--transparent-hero)] px-1.5 py-0.5 rounded'>
								ID: {courseInfo.id?.slice(0, 8)}
							</span>
							{courseInfo.tag && (
								<span className='flex items-center gap-1 font-medium text-[var(--middle)]'>
									<Tag size={10} /> {courseInfo.tag}
								</span>
							)}
						</div>
						<h2 className='text-base font-bold text-[var(--black)] truncate max-w-sm'>
							{courseInfo.name || 'Загрузка курса...'}
						</h2>
					</div>
				</div>

				<div className='flex gap-4 text-xs text-[var(--middle)] shrink-0 border-t lg:border-t-0 border-[var(--light-middle)]/10 pt-3 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end'>
					<div>
						<p className='text-[var(--middle)] font-medium text-[9px] uppercase tracking-wider'>
							Старт
						</p>
						<p className='font-semibold text-[var(--black)]'>
							{courseInfo.start_date?.split('T')[0] || '—'}
						</p>
					</div>
					<div>
						<p className='text-[var(--middle)] font-medium text-[9px] uppercase tracking-wider'>
							Цена
						</p>
						<p className='font-semibold text-[var(--hero)]'>
							{courseInfo.is_free ? 'Бесплатно' : `${courseInfo.price || 0} ₽`}
						</p>
					</div>
				</div>
			</div>

			{/* НИЖНИЙ БЛОК: Сетка карточек */}
			<div className='space-y-3 flex-1'>
				<h3 className='text-base font-bold text-[var(--black)] px-1'>
					Заявки на курс ({users.length})
				</h3>

				<div className='grid grid-cols-2 xl:grid-cols-3 gap-4'>
					{users.map((user, idx) => (
						<UserCard
							key={user.student_request_id || idx}
							FullName={user.student}
							avatar_url={user.student.avatar_url}
							email={user.student.email}
							status={user.request_status}
							appliedAt={user.submitted_at}
							onClick={() => onUserClick(user.student_request_id)} // Передаем ID наружу
						/>
					))}
				</div>
			</div>
		</div>
	)
}

// КАРТОЧКА ПОЛЬЗОВАТЕЛЯ
const UserCard = ({
	FullName,
	avatar_url,
	email,
	role,
	appliedAt,
	onClick,
	status,
}) => {
	const statuses = {
		accepted: {
			label: 'Одобрен',
			color: 'bg-[var(--green-base)] text-[var(--green-surface)]',
		},
		rejected: {
			label: 'Отклонен',
			color: 'bg-[var(--red-base)] text-[var(--red-surface)]',
		},
		pending: {
			label: 'Ожидает одобрения',
			color: 'bg-[var(--light-middle)] text-[var(--middle)]',
		},
	}

	return (
		<div
			onClick={onClick}
			className={`w-full h-fit flex gap-4 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] p-3  transition-all duration-200 border border-[var(--light-middle)]/10  ${status === 'pending' && 'cursor-pointer hover:translate-y-[-2px] hover:border-[var(--light-middle)]/30'}  items-center `}
		>
			<div className='w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-inner bg-[var(--light-gray)]'>
				{avatar_url ? (
					<img
						className='w-full h-full object-cover'
						src={avatar_url}
						alt='User Avatar'
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center text-[var(--middle)] bg-[var(--light-middle)]/20'>
						<ImageOff size={18} />
					</div>
				)}
			</div>

			<div className='flex flex-col flex-1 min-w-0 gap-0.5'>
				<div className='flex items-center justify-between gap-2 w-full'>
					<p className='text-sm font-bold text-[var(--black)] truncate'>
						{FullName?.last_name} {FullName?.first_name[0]}
						{'. '}
						{FullName?.patronymic[0]}.
					</p>
					{status && statuses[status] && (
						<span
							className={`text-[10px] font-semibold ${statuses[status].color}  px-2 py-0.5 rounded-full shrink-0`}
						>
							{statuses[status].label}
						</span>
					)}
				</div>

				<div className='flex items-center justify-between gap-x-4 text-[12px] text-[var(--middle)]'>
					<span className='flex items-center gap-1 truncate'>
						<Mail size={12} className='text-[var(--middle)]' />{' '}
						{email || 'Нет почты'}
					</span>
					{appliedAt && (
						<span className='flex items-center gap-1 font-medium text-[var(--hero)] shrink-0'>
							<Calendar size={12} /> <p>{appliedAt.split('T')[0]}</p>
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

// ОСНОВНОЙ КОМПОНЕНТ ДАШБОРДА МОДЕРАЦИИ
const AcceptanceOfApplications = () => {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()

	const activeCourseId = searchParams.get('course_id')
	const activeRequestId = searchParams.get('request_id') // Получаем request_id из URL

	const [page, setPage] = useState(1)
	const [courses, setCourses] = useState([])

	// При клике на курс, сбрасываем старый request_id, чтобы открыть список заново
	const handleCourseClick = id => {
		setSearchParams({ course_id: id })
	}

	// При клике на юзера сохраняем текущий course_id и дописываем request_id
	const handleUserClick = requestId => {
		setSearchParams({
			course_id: activeCourseId,
			request_id: requestId,
		})
	}

	// Возврат от просмотра анкеты назад к списку пользователей курса
	const handleCloseRequestView = () => {
		setSearchParams({ course_id: activeCourseId })
	}

	useEffect(() => {
		const getModerateCourses = async () => {
			try {
				const res = await GetAllCoursesWithRequest()
				setCourses(res)
			} catch (err) {
				console.error(err)
			}
		}
		getModerateCourses()
	}, [])

	return (
		<div className='grid grid-cols-[420px_1fr] h-screen gap-6 pt-24 pb-6 px-6 bg-[var(--light-gray)]/30'>
			{/* Левый сайдбар: Список курсов */}
			<div className='flex flex-col gap-5 h-full min-h-0'>
				<div className='w-full h-full bg-[var(--white)] shadow-[var(--shadow)] rounded-3xl p-4 flex flex-col justify-between overflow-hidden'>
					<div className='flex items-center gap-3 mb-2 shrink-0'>
						<h2 className='text-lg font-bold text-[var(--black)]'>
							Курсы на модерации
						</h2>
					</div>

					<div className='flex flex-col gap-2 flex-1 overflow-y-auto my-2 pr-1'>
						{courses.map(course => (
							<motion.div
								key={course.id}
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.15 }}
							>
								<CourseMiniCard
									data={course}
									isActive={course.id === activeCourseId} // Подсвечиваем выбранный
									onClick={() => handleCourseClick(course.id)}
								/>
							</motion.div>
						))}
					</div>

					<div className='shrink-0 pt-2 border-t border-[var(--light-middle)]/10'>
						<BasicPagination
							count={1}
							page={page}
							onPageChange={setPage}
							siblingCount={0}
						/>
					</div>
				</div>
			</div>

			{/* Основной правый блок */}
			<div className='w-full h-full bg-[var(--white)] shadow-[var(--shadow)] rounded-3xl p-5 overflow-hidden'>
				<AnimatePresence mode='wait'>
					{!activeCourseId ? (
						// Состояние: Ничего не выбрано
						<motion.div
							key='empty'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='w-full h-full flex flex-col items-center justify-center text-[var(--middle)] gap-2'
						>
							<BookOpen
								size={36}
								className='stroke-1 text-[var(--light-middle)]'
							/>
							<p className='text-sm font-medium'>
								Выберите курс из списка слева
							</p>
						</motion.div>
					) : activeRequestId ? (
						// Состояние: Просмотр конкретной анкеты (есть request_id)
						<motion.div
							key='request-view'
							initial={{ x: 15, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -15, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className='w-full h-full'
						>
							<StudentCourseRequestView
								requestId={activeRequestId}
								onClose={handleCloseRequestView}
							/>
						</motion.div>
					) : (
						// Состояние: Список пользователей курса
						<motion.div
							key='users-table'
							initial={{ x: -15, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 15, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className='w-full h-full'
						>
							<UsersTable
								courseId={activeCourseId}
								onUserClick={handleUserClick}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default AcceptanceOfApplications
