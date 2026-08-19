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
import { useUser } from '../../service/context/UserContext'
import { CourseCard } from '../components/Cards'
import { CreateCourseForm } from '../components/Organisms/Forms/CreateCourseForm'

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-4xl group hover:border-[var(--hero)] hover:text-[var(--hero)] transition-all cursor-pointer h-full max-md:mb-30`}
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				{title}
			</span>
		</button>
	)
}

const Catalog = () => {
	const { userInfo, role } = useUser()

	const { type = 'courses' } = useParams() // Если type нет в URL, ставим 'all' по умолчанию
	const navigate = useNavigate()

	const options = [
		{ value: 'courses', to: '/catalog/courses', title: 'Курсы' },
		{ value: 'webinars', to: '/catalog/webinars', title: 'Видео-конференции' },
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

	const rowHeight = `h-125`

	return (
		<>
			<Modal
				width={'w-175'}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setShowArrow(true)
				}}
			>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание курса
				</h2>
				<div className='relative h-[70vh]'>
					{/* Градиентный слой, который всегда "висит" вверху модалки */}

					<div className='pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-t to-[var(--white)] from-transparent' />

					{/* Контентный блок со скроллом */}
					<div
						className='px-2 pt-6 pb-10 h-full overflow-y-scroll hide-scrollbar font'
						onScroll={handleScroll}
					>
						<CreateCourseForm />
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
			</Modal>
			<div className='flex flex-col w-full gap-5 py-30'>
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
							className={rowHeight}
						>
							<CourseCard courseInfo={course} />
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
							className={rowHeight}
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
