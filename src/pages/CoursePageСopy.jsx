import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'

import { Loader } from '../components/Atoms/Loaders/Loader'
import { ReviewConfirmModal } from '../components/Organisms/Modals/ReviewConfirmModal'
import { RadioGroup } from '../components/Molecules/RadioGroup'
import { StatusBadge } from '../components/Atoms/StatusBadge'
import { CourseSidebar } from '../components/Organisms/CourseSideBar'
import { Show } from '../components/Atoms/Show'
import { ContentHeader } from '../components/Organisms/ContentHeader'
import { ContentView } from '../components/Organisms/ContentView'
import AccessManagement from './CoursePage/AccessManagement'
import ActivityStudents from './CoursePage/ActivityStudents'
import Attachment from './CoursePage/Attachmint'
import { SubmitButton } from '../components/Atoms/Buttons/SubmitButton'
import { Settings } from 'lucide-react'
import { CourseModal } from '../components/Organisms/Modals/CourseModal'
import {
	changeCourseStatus,
	changeCourseStatusForTeacher,
	fetchCourseById,
} from '../api/courseService'
import { ButtonCase } from '../components/Atoms/Buttons/ButtonCase'
import { STATUS_CONFIG } from '../Constants/statusConfig'
import { toast } from 'sonner'

const CHAPTER_OPTIONS = [
	{ value: 'constructor', label: 'Конструктор' },
	{ value: 'access', label: 'Управление доступом' },
	{ value: 'activity', label: 'Активность студентов' },
	{ value: 'RPD', label: 'РПД' },
]

const CoursePage = () => {
	const { role } = useUser()
	const navigate = useNavigate()
	const { courseId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()

	const [activeSectionId, setActiveSectionId] = useState(
		searchParams.get('section') || '',
	)
	const [activeType, setActiveType] = useState(searchParams.get('type') || '')
	const [title, setTitle] = useState('')
	const [status, setStatus] = useState('in_development')

	const [isEdit, setIsEdit] = useState(true)
	const [modules, setModules] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [activeChapter, setActiveChapter] = useState('constructor')

	const fetchCourseData = async () => {
		if (!courseId) return
		try {
			const res = await fetchCourseById(courseId)
			setTitle(res.name)
			setStatus(res.course_status)
			setModules(res.modules || [])
		} catch (err) {
			console.error('Ошибка при загрузке курса:', err)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		setIsLoading(true)
		fetchCourseData()
	}, [courseId])

	useEffect(() => {
		const id = searchParams.get('section')
		setActiveSectionId(id)

		if (id && modules?.length > 0) {
			const section = modules
				.flatMap(m => m?.content || [])
				.find(s => s?.id === id)
			if (section) {
				setActiveType(section.type)
			}
		}
	}, [searchParams, modules])

	const activeSection = modules
		?.flatMap(m => m?.content || [])
		.find(s => s?.id === activeSectionId)

	const toggleModule = id => {
		setModules(prev =>
			prev.map(m => (m.id === id ? { ...m, isExpanded: !m.isExpanded } : m)),
		)
	}

	const handleSectionClick = (type, id) => {
		setSearchParams({ type, section: id }, { replace: true })
	}

	const changeStatus = async () => {
		try {
			if (role === 'teacher' && currentStatus === 'in_development') {
				await changeCourseStatusForTeacher(courseId)
			} else return
			toast.success('Отправлено на рассмотрение!')
			fetchCourseData()
		} catch (err) {
			toast.error('Ошибка отправки курса на рассмотрения.')
			console.error(err)
		}
	}

	useEffect(() => {
		const handleReload = () => {
			fetchCourseData()
		}

		window.addEventListener('course:sidebar:update', handleReload)
		return () =>
			window.removeEventListener('course:sidebar:update', handleReload)
	}, [fetchCourseData])

	const currentStatus = STATUS_CONFIG[status]

	if (isLoading) {
		return (
			<div className='w-full min-h-screen flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<>
			{/* Модальное окно подтверждения */}
			<ReviewConfirmModal
				isModalOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<CourseModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				selectedCourse={courseId} // Передаем объект курса
			/>

			<div className='flex flex-col gap-3 pt-25 pb-10 min-h-screen'>
				<p className='text-2xl uppercase text-center font-bold text-[var(--black)]'>
					{title}
				</p>
				<div className='flex lg:flex-row lg:pl-0 pl-18 h-full flex-col justify-between items-center gap-4'>
					{role !== 'student' && (
						<RadioGroup
							options={CHAPTER_OPTIONS}
							value={activeChapter}
							onChange={setActiveChapter}
						/>
					)}
					<div className='flex gap-4'>
						<Show when={role !== 'student'}>
							<SubmitButton
								onClick={() => setIsSettingsOpen(true)}
								invert
								className={'flex items-center gap-2 justify-center'}
							>
								Настройки курса
								<Settings size={18} />
							</SubmitButton>
							<ButtonCase
								backgroundColor={currentStatus?.styles?.bg}
								textColor={currentStatus?.styles?.text}
								onClick={() =>
									role === 'moderator' ? setIsModalOpen(true) : changeStatus()
								}
							>
								{currentStatus?.text}
							</ButtonCase>
						</Show>
					</div>
				</div>

				<Show when={activeChapter === 'constructor'}>
					<div className='lg:grid grid-cols-[350px_1fr] h-[calc(100vh-180px)] gap-6 lg:pl-0 pl-18'>
						<CourseSidebar
							role={role}
							modules={modules}
							toggleModule={toggleModule}
							activeSectionId={activeSectionId}
							handleSectionClick={handleSectionClick}
							setActiveType={setActiveType}
							onSuccess={fetchCourseData}
						/>

						<div className='w-full h-full bg-[var(--white)] overflow-hidden shadow-lg rounded-3xl p-4 mb-5 flex flex-col'>
							<Show when={activeSectionId}>
								<ContentHeader onIsEditChange={setIsEdit} isEdit={isEdit} />
							</Show>

							<div className='w-full flex-1 overflow-y-auto px-2 py-4'>
								<ContentView isEdit={role !== 'student' && isEdit} />
								<div className='w-full h-20'></div>
							</div>
						</div>
					</div>
				</Show>

				<Show when={activeChapter === 'access'}>
					<AccessManagement />
				</Show>
				<Show when={activeChapter === 'activity'}>
					<ActivityStudents />
				</Show>
				<Show when={activeChapter === 'RPD'}>
					<Attachment />
				</Show>
			</div>
		</>
	)
}

export default CoursePage
