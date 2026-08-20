import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CourseMiniCard } from '../../components/Organisms/Cards/CourseMiniCard'
import { BasicPagination } from '../../components/Molecules/Pagination'
import { SubmitButton } from '../../components/Atoms/Buttons/SubmitButton'
import { ArrowLeft } from 'lucide-react'
import { CourseForm } from '../../components/Organisms/Forms/CourseForm'

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
								<SubmitButton
									className={'p-3 w-fit aspect-square'}
									onClick={() => {
										clearParams()
									}}
								>
									<ArrowLeft className='text-[var(--black)]' />
								</SubmitButton>
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
