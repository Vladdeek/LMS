import { useEffect, useState } from 'react'
import {
	AccessCourse,
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
} from 'lucide-react'
import Modal from '../../components/Modal'
import { InputDefault } from '../../components/Inputs'

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

const CourseForm = ({ courseId, onChange }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	// Инициализируем пустым объектом, чтобы не падали проверки типа courseInfo.id
	const [courseInfo, setCourseInfo] = useState({})

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
	}, [])

	const accessCourse = async status => {
		try {
			const res = await AccessCourse(courseId, status)
			setIsModalOpen(false)
			onChange?.()
		} catch (err) {}
	}

	return (
		<>
			{/* Модальное окно: Допуск */}
			<Modal width={'w-110'} isOpen={isModalOpen}>
				<div className='flex flex-col gap-6 p-2'>
					<div className='flex flex-col items-center text-center gap-3'>
						<div className='p-4 bg-[var(--transparent-hero)] rounded-full text-[var(--hero)]'>
							<ShieldAlert size={40} />
						</div>
						<h2 className='text-2xl font-bold text-[var(--black)]'>
							Модерация курса
						</h2>
						<p className='text-[var(--middle)]'>
							Проверьте корректность всех заполненных данных перед тем, как
							изменить статус доступа к редактированию.
						</p>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<button
							onClick={() => accessCourse('rejected_preview')}
							className='flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--red-hover)] bg-[var(--red-base)] text-[var(--red-surface)] transition-all cursor-pointer'
						>
							<XCircle size={24} />
							<span className='font-semibold'>Запретить</span>
						</button>
						<button
							onClick={() => accessCourse('draft')}
							className='flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--green-hover)] bg-[var(--green-base)] text-[var(--green-surface)] transition-all cursor-pointer'
						>
							<CheckCircle2 size={24} />
							<span className='font-semibold'>Допустить</span>
						</button>
					</div>

					<button
						onClick={() => setIsModalOpen(false)}
						className='w-full py-3 text-[var(--middle)] font-medium hover:bg-[var(--light-middle)] rounded-xl transition-all'
					>
						Отмена
					</button>
				</div>
			</Modal>

			<div className='mx-40'>
				<div className='grid grid-cols-12 gap-10'>
					{/* ЛЕВАЯ КОЛОНКА: Виджет курса и Создатель */}
					<div className='col-span-12 lg:col-span-4 flex flex-col space-y-6 border-r border-[var(--light-middle)]/30 pr-6'>
						<div className='relative group h-64 w-full rounded-3xl overflow-hidden ring-5 ring-[var(--white)] shadow-[var(--shadow)] bg-[var(--light-gray)]/50'>
							{courseInfo.preview_url ? (
								<img
									src={courseInfo.preview_url}
									alt='Preview'
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
									<BookOpen size={48} />
								</div>
							)}
							<div className='absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-[var(--hero)] shadow-sm'>
								ID: {courseInfo.id?.slice(0, 8)}...
							</div>
						</div>

						<div className='space-y-4 border-t border-[var(--light-middle)]/30 pt-5'>
							<div className='flex items-center gap-3 p-3 bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl'>
								<div className='w-12 h-12 rounded-lg ring-4 ring-[var(--white)] shadow-[var(--shadow)] overflow-hidden shrink-0'>
									{courseInfo.creator?.avatar_url ? (
										<img
											src={courseInfo.creator.avatar_url}
											alt='Avatar'
											className='w-full h-full object-cover'
										/>
									) : (
										<User className='p-2 bg-[var(--light-gray)]/50 text-[var(--middle)] w-full h-full' />
									)}
								</div>
								<div className='overflow-hidden'>
									<p className='text-xs text-[var(--middle)]'>
										Создатель курса
									</p>
									<p className='text-sm font-semibold truncate text-[var(--black)]'>
										{courseInfo.creator?.last_name}{' '}
										{courseInfo.creator?.first_name}{' '}
										{courseInfo.creator?.patronymic}
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2 px-3 py-2 bg-[var(--transparent-hero)] text-[var(--hero)] rounded-xl w-fit text-sm font-medium'>
								<Tag size={14} />
								{courseInfo.tag || 'Без тега'}
							</div>
						</div>
					</div>

					{/* ПРАВАЯ КОЛОНКА: Использование компонента TextStroke */}
					<div className='col-span-12 lg:col-span-8 flex flex-col space-y-8'>
						{/* Блок 1: Основное */}
						<section className='space-y-5'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
									<BookOpen size={20} />
								</div>
								<h3 className='text-lg font-bold text-[var(--black)]'>
									Основная информация
								</h3>
							</div>

							<TextStroke title='Название курса' value={courseInfo.name} />
							<TextStroke
								title='Описание'
								value={courseInfo.description}
								textarea
							/>
						</section>

						{/* Блок 2: Даты */}
						<section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-4'>
								<div className='flex items-center gap-2 text-[var(--hero)] font-medium text-sm uppercase tracking-wider mb-1'>
									<Calendar size={16} /> Регистрация
								</div>
								<TextStroke
									title='Начало'
									value={courseInfo.registration_start?.split('T')[0]}
								/>
								<TextStroke
									title='Конец'
									value={courseInfo.registration_end?.split('T')[0]}
								/>
							</div>

							<div className='space-y-4'>
								<div className='flex items-center gap-2 text-[var(--hero)] font-medium text-sm uppercase tracking-wider mb-1'>
									<Calendar size={16} /> Обучение
								</div>
								<TextStroke
									title='Дата старта'
									value={courseInfo.start_date?.split('T')[0]}
								/>
								<TextStroke
									title='Дата завершения'
									value={courseInfo.end_date?.split('T')[0]}
								/>
							</div>
						</section>

						{/* Блок 3: Стоимость и Доп. информация */}
						<section className='grid grid-cols-1 md:grid-cols-3 gap-6 items-end'>
							<div className='md:col-span-2 flex flex-col gap-4 w-full'>
								<TextStroke
									title='Формат обучения'
									value={courseInfo.format_name}
								/>
								<TextStroke
									title='Тип сертификата'
									value={courseInfo.certificate_type_name}
								/>
							</div>
							<div className='flex flex-col gap-1 w-full'>
								<span className='flex items-center gap-2 text-sm font-medium text-[var(--middle)] mb-1 select-none'>
									<CreditCard size={16} /> Цена
								</span>
								<TextStroke
									value={
										courseInfo.is_free
											? 'Бесплатно'
											: `${courseInfo.price || 0} ₽`
									}
								/>
							</div>
						</section>

						{/* Кнопка действия */}
						<div className='flex justify-end pt-4'>
							<DefaultButton
								width='w-full md:w-auto px-8 py-4'
								onClick={() => setIsModalOpen(true)}
							>
								<div className='flex items-center gap-3'>
									<ShieldAlert size={18} strokeWidth={3} />
									Допустить к редактированию
								</div>
							</DefaultButton>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const ModerateCourses = () => {
	const navigate = useNavigate()
	const { type } = useParams() // Получаем 'admit' или 'release' из URL
	const [searchParams, setSearchParams] = useSearchParams()
	const activeCourseId = searchParams.get('course_id')

	const [page, setPage] = useState(1)
	const [courses, setCourses] = useState([])

	// Маппинг для удобной работы с индексами ToggleButton
	const types = ['pending_review', 'draft']
	const selected = types.indexOf(type) !== -1 ? types.indexOf(type) : 0

	const handleSelectChange = index => {
		// При смене таба меняем URL. course_id пока сбрасываем или оставляем по логике.
		const newType = types[index]
		navigate(`/moderation-courses/${newType}`)
	}

	const handleCourseClick = id => {
		// Пример добавления query-параметра при клике на курс
		setSearchParams({ course_id: id })
	}

	useEffect(() => {
		// Если зашли просто по базовому адресу, редиректим на 'admit'
		if (!type) {
			navigate('/moderation-courses/pending_review', { replace: true })
		}
	}, [type, navigate])

	useEffect(() => {
		const getModerateCourses = async () => {
			try {
				// Здесь можно передавать selected или type в API
				const res = await GetModerationCourses(type)
				setCourses(res)
			} catch (err) {}
		}
		getModerateCourses()
	}, [type]) // Перезагружаем данные при смене типа в URL

	return (
		<>
			<div className='grid grid-cols-[500px_1fr] h-screen gap-6 pt-30 pb-10 '>
				<div className='flex flex-col gap-5'>
					<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4 flex flex-col justify-between'>
						<div className='flex items-center gap-3 mb-3'>
							<h2 className='text-xl font-bold text-[var(--black)]'>Курсы</h2>
						</div>

						<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
							{/* Пример списка курсов */}
							{courses?.map(course => (
								<motion.div
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.125,
										ease: 'easeOut',
									}}
								>
									<CourseMiniCard
										data={course}
										onClick={() => {
											handleCourseClick(course.id)
										}}
									/>
								</motion.div>
							))}
						</div>

						<BasicPagination
							count={1}
							page={page}
							onPageChange={setPage}
							siblingCount={0}
						/>
					</div>
				</div>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
					{!activeCourseId ? (
						<div className='flex items-center justify-center w-full h-full'>
							<p className='text-[var(--middle)] font-light text-2xl'>
								Курс для модерации не выбран
							</p>
						</div>
					) : (
						<div className='flex flex-col gap-5 h-full w-full'>
							<div className='flex items-start w-full justify-between'>
								<DefaultButton
									paddings='p-3'
									width='w-fit aspect-square'
									flexParams='items-center'
									invert={true}
									onClick={() => {
										clearParams()
									}}
								>
									<ArrowLeft className='text-[var(--black)]' />
								</DefaultButton>
							</div>

							<CourseForm
								courseId={activeCourseId}
								onChange={data => {
									handleUserClick(data)
								}}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
export default ModerateCourses
