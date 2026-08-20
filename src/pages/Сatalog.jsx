import { ArrowDown, Blocks, Filter, RotateCcw } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from '../components/Atoms/Modal'
import { CreateCourseForm } from '../components/Organisms/Forms/CreateCourseForm'
import { RadioGroup } from '../components/Molecules/RadioGroup'
import { CourseCard } from '../components/Organisms/Cards/CourseCard'
import { motion } from 'framer-motion'
import { CreateCourseModal } from '../components/Organisms/Modals/CreateCourseModal'
import { Show } from '../components/Atoms/Show'
import { fetchCoursesApi } from '../api/Courses'
import { FilterOptionInput } from '../components/Molecules/InputFields/FilterOptionInput'

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

export const SORTING_FILTERS = [
	'Все',
	'По дате создания (новые)',
	'По дате создания (старые)',
	'По названию курса (А-Я)',
	'По названию курса (Я-А)',
]

export const STUDY_LEVELS = [
	'Все',
	'Бакалавриат',
	'Специалитет',
	'Магистратура',
]

export const STATUS_OPTIONS = [
	'Все',
	'Опубликован',
	'Не опубликован',
	'На рассмотрении',
]

export const SEMESTER_OPTIONS = [
	{ value: 1, title: '1-й Семестр' },
	{ value: 2, title: '2-й Семестр' },
]

export const COURSE_YEAR_OPTIONS = [
	{ value: 1, title: '1-й' },
	{ value: 2, title: '2-й' },
	{ value: 3, title: '3-й' },
	{ value: 4, title: '4-й' },
	{ value: 5, title: '5-й' },
	{ value: 6, title: '6-й' },
]

const Catalog = () => {
	const { userInfo, role } = useUser()
	const { type = 'courses' } = useParams()
	const navigate = useNavigate()

	const [courses, setCourses] = useState([])
	const [loading, setLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	// Единое состояние для фильтров (вместо 10 отдельных useState)
	const [filters, setFilters] = useState({
		sort: null,
		studyLevel: null,
		status: null,
		semester: null,
		courseOpt: null,
	})

	const updateFilter = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}

	const resetFilters = () => {
		setFilters({
			sort: null,
			studyLevel: null,
			status: null,
			semester: null,
			courseOpt: null,
		})
	}

	// Считаем кол-во активных фильтров для бейджа
	const activeFiltersCount = useMemo(() => {
		return Object.values(filters).filter(v => v !== null && v !== undefined)
			.length
	}, [filters])

	// Загрузка данных
	const loadCourses = useCallback(async () => {
		setLoading(true)
		try {
			const data = await fetchCoursesApi({
				selectedSortFilter: filters.sort,
				selectedSemester: filters.semester,
				selectedStatus: filters.status,
				selectedElvl: filters.studyLevel,
				selectedCoursesOpt: filters.courseOpt,
				sortingFilters: SORTING_FILTERS,
				statusOptions: STATUS_OPTIONS,
				studyLevelMap: STUDY_LEVELS,
			})
			setCourses(data || [])
		} catch (err) {
			console.error('Failed to fetch courses:', err)
		} finally {
			setLoading(false)
		}
	}, [filters])

	// Триггерим загрузку при изменении фильтров
	useEffect(() => {
		loadCourses()
	}, [loadCourses])

	const rowHeight = 'h-125'

	return (
		<>
			<CreateCourseModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={loadCourses}
			/>

			<div className='flex flex-col w-full gap-5 py-25 px-4'>
				{/* Шапка с фильтрами */}
				<div className='flex justify-end items-center relative'>
					<div className='relative'>
						<button
							type='button'
							onClick={() => setIsFilterOpen(prev => !prev)}
							className='flex items-center gap-2 px-4 py-2 bg-[var(--white)] text-[var(--black)] rounded-lg shadow-[var(--shadow)] hover:bg-[var(--hero)] hover:text-white transition-all font-medium cursor-pointer'
						>
							<Filter className='w-5 h-5' />
							<span>Фильтры</span>
							{activeFiltersCount > 0 && (
								<span className='ml-1 px-2 py-0.5 text-xs bg-[var(--hero)] text-white rounded-full font-bold'>
									{activeFiltersCount}
								</span>
							)}
						</button>

						{/* Выпадающее окно фильтров */}
						{isFilterOpen && (
							<div className='absolute right-0 top-12 w-80 sm:w-96 p-4 bg-[var(--white)] rounded-xl shadow-[var(--shadow)] z-30 flex flex-col gap-3 text-sm'>
								<div>
									<label className='block text-xs font-semibold mb-1 text-gray-500'>
										Уровень обучения
									</label>
									<FilterOptionInput
										Options={STUDY_LEVELS}
										placeholder='Все уровни'
										value={filters.studyLevel}
										onChange={val => updateFilter('studyLevel', val)}
									/>
								</div>

								<div>
									<label className='block text-xs font-semibold mb-1 text-gray-500'>
										Статус
									</label>
									<FilterOptionInput
										Options={STATUS_OPTIONS}
										placeholder='Все статусы'
										value={filters.status}
										onChange={val => updateFilter('status', val)}
									/>
								</div>

								<div>
									<label className='block text-xs font-semibold mb-1 text-gray-500'>
										Сортировка
									</label>
									<FilterOptionInput
										Options={SORTING_FILTERS}
										placeholder='По умолчанию'
										value={filters.sort}
										onChange={val => updateFilter('sort', val)}
									/>
								</div>

								{/* Семестр */}
								<div>
									<label className='block text-xs font-semibold mb-1 text-gray-500'>
										Семестр
									</label>
									<div className='grid grid-cols-2 gap-2'>
										{SEMESTER_OPTIONS.map(sem => (
											<button
												key={sem.value}
												type='button'
												onClick={() =>
													updateFilter(
														'semester',
														filters.semester === sem.value ? null : sem.value,
													)
												}
												className={`py-1.5 px-3 rounded-md text-xs font-medium border transition-all cursor-pointer ${
													filters.semester === sem.value
														? 'bg-[var(--black)] text-white border-[var(--black)]'
														: 'bg-transparent text-[var(--black)] border-gray-300 hover:border-gray-500'
												}`}
											>
												{sem.title}
											</button>
										))}
									</div>
								</div>

								{/* Курс обучения */}
								<div>
									<label className='block text-xs font-semibold mb-1 text-gray-500'>
										Курс обучения
									</label>
									<div className='grid grid-cols-6 gap-1'>
										{COURSE_YEAR_OPTIONS.map(c => (
											<button
												key={c.value}
												type='button'
												onClick={() =>
													updateFilter(
														'courseOpt',
														filters.courseOpt === c.value ? null : c.value,
													)
												}
												className={`py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
													filters.courseOpt === c.value
														? 'bg-[var(--black)] text-white border-[var(--black)]'
														: 'bg-transparent text-[var(--black)] border-gray-300 hover:border-gray-500'
												}`}
											>
												{c.title}
											</button>
										))}
									</div>
								</div>

								{/* Сброс фильтров */}
								{activeFiltersCount > 0 && (
									<button
										type='button'
										onClick={resetFilters}
										className='mt-2 flex items-center justify-center gap-2 py-2 w-full bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-all cursor-pointer'
									>
										<RotateCcw className='w-4 h-4' />
										<span>Сбросить фильтры</span>
									</button>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Сетка карточек */}
				<div className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-5'>
					{courses.map((course, index) => (
						<motion.div
							key={course.id}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: index * 0.05,
								ease: 'easeOut',
							}}
							className={rowHeight}
						>
							<CourseCard courseInfo={course} />
						</motion.div>
					))}

					<Show when={role === 'teacher'}>
						<motion.div
							key='create-btn'
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: courses.length * 0.05,
								ease: 'easeOut',
							}}
							className={rowHeight}
						>
							<CreateBtn
								onClick={() => setIsModalOpen(true)}
								title='Создать новый курс'
							/>
						</motion.div>
					</Show>
				</div>
			</div>
		</>
	)
}
export default Catalog
