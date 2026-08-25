import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
	ArrowLeft,
	BookOpen,
	CheckCircle2,
	Edit3,
	ShieldAlert,
	XCircle,
} from 'lucide-react'

import { motion } from 'framer-motion'

import Modal from '../../components/Atoms/Modal'
import ResponsiveSidebar from '../../components/Molecules/ResponsiveSidebar'
import { CourseMiniCard } from '../../components/Organisms/Cards/CourseMiniCard'
import { BasicPagination } from '../../components/Molecules/Pagination'
import { SubmitButton } from '../../components/Atoms/Buttons/SubmitButton'
import { getModerationCourses } from '../../api/moderator/Courses'
import { ButtonCase } from '../../components/Atoms/Buttons/ButtonCase'
import { ModeratorCourseForm } from '../../components/Organisms/Forms/ModeratorCourseForm'

const formatDate = dateString => (dateString ? dateString.split('T')[0] : '')

const ModerateCourses = () => {
	const [pagesCount, setPagesCount] = useState(1)
	const [isOpen, setIsOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const navigate = useNavigate()

	const [searchParams, setSearchParams] = useSearchParams()
	const activeCourseId = searchParams.get('course_id')

	const [page, setPage] = useState(1)
	const [courses, setCourses] = useState([])

	const [isEdit, setIsEdit] = useState(false)

	const clearParams = () => {
		setSearchParams({})
	}

	const handleCourseClick = id => {
		setIsEdit(false)
		setSearchParams({ course_id: id })
	}

	const options = [
		{ value: 'pending', title: 'На рассмотрении' },
		{ value: 'all', title: 'все' },
	]

	const [activeStatus, setActiveStatus] = useState('pending')
	const [courseStatus, setCourseStatus] = useState(null)

	const fetchCourses = async () => {
		console.log('getCourses!')
		try {
			const res = await getModerationCourses(activeStatus === 'all', page)
			setPagesCount(res.pages)
			setCourses(res.items)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchCourses()
	}, [activeStatus, page])

	const accessCourse = async status => {
		try {
			await ChangeStatus(activeCourseId, status)
			setIsModalOpen(false)
			clearParams()
			fetchCourses() // Обновляем список курсов в сайдбаре после модерации
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<>
			<div className='lg:grid grid-cols-[400px_1fr] h-screen gap-6 lg:pl-0 pl-18 pt-25 bg-[var(--light-gray)]/30'>
				<ResponsiveSidebar
					title='Курсы на проверку'
					triggerTitle='Курсы'
					triggerIcon={BookOpen}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				>
					<div className='flex flex-col justify-between h-full overflow-hidden'>
						{/* <div className='flex gap-1'>
							{options?.map(option => (
								<RadioButton
									key={option.value}
									name='catalog-type'
									value={option.value}
									title={option.title}
									icon={option.icon}
									checked={activeStatus === option.value}
									onChange={() => {
										setActiveStatus(option.value)
									}}
									wfull
									fill
								/>
							))}
						</div> */}
						<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
							{courses?.map((course, index) => (
								<motion.div
									key={course.id || index}
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.125, ease: 'easeOut' }}
								>
									<CourseMiniCard
										data={course}
										onClick={() => {
											handleCourseClick(course.id)
											setIsOpen(false)
										}}
									/>
								</motion.div>
							))}
						</div>
						<div className='pt-4 mt-auto shrink-0'>
							<BasicPagination
								count={pagesCount}
								page={page}
								onPageChange={setPage}
								siblingCount={0}
							/>
						</div>
					</div>
				</ResponsiveSidebar>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] overflow-y-auto shadow-lg rounded-t-3xl border-t border-x border-[var(--light-middle)]/10 p-6 relative'>
					{!activeCourseId ? (
						<div className='flex items-center justify-center w-full h-full'>
							<p className='text-[var(--middle)] font-light text-xl'>
								Выберите курс из списка для проведения модерации
							</p>
						</div>
					) : (
						<div className='flex flex-col gap-6 h-full w-full'>
							{/* ВЕРХНЯЯ ПАНЕЛЬ: Навигация и Редактирование */}
							<div className='flex items-center w-full justify-between border-b border-[var(--light-middle)]/10 pb-4 shrink-0'>
								<ButtonCase
									onClick={clearParams}
									backgroundColor='var(--white)'
									textColor='var(--black)'
									hoverStyles='hover:bg-[var(--hero)] hover:text-white'
								>
									<ArrowLeft className='text-[var(--black)]' size={20} />
								</ButtonCase>

								<div className='flex gap-3'>
									<ButtonCase
										onClick={() => setIsEdit(prev => !prev)}
										backgroundColor={isEdit ? 'var(--hero)' : 'var(--white)'}
										textColor={isEdit ? 'white' : 'var(--black)'}
										hoverStyles='hover:bg-[var(--hero)] hover:text-white'
										className={'px-5 py-2.5 text-sm flex items-center'}
									>
										{isEdit ? (
											<>
												<Edit3 size={16} />
												Редактирование
											</>
										) : (
											<>
												<Edit3 size={16} />
												Редактировать
											</>
										)}
									</ButtonCase>

									{courseStatus === 'pending_review' && (
										<SubmitButton
											width='px-6 py-2.5 text-sm flex items-center'
											onClick={() => setIsModalOpen(true)}
										>
											<ShieldAlert size={16} />
											Рецензировать
										</SubmitButton>
									)}
								</div>
							</div>

							{/* Сама анкета данных курса */}
							<ModeratorCourseForm
								isEdit={isEdit}
								onIsEditChange={data => {
									setIsEdit(data)
									fetchCourses()
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
