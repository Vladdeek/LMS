import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FilterIcon } from 'lucide-react'
import { FilterOptionInput } from '../../components/Molecules/InputFields/FilterOptionInput'
import { SearchInput } from '../../components/Molecules/InputFields/SearchInput'

// Вынесенный компонент строки таблицы
const TableEl = ({ name, group, lecture, activity = 0, last_activity }) => {
	return (
		<>
			{/* Десктопная версия */}
			<div className='max-lg:hidden w-full text-[var(--black)] flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] h-10 px-4'>
				<p className='w-1/4 h-full flex items-center justify-center'>{name}</p>
				<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
					{group}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center'>
					{lecture}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
					{formatTime(activity)}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center'>
					{formatDate(last_activity)}
				</p>
			</div>

			{/* Мобильная версия */}
			<div className='min-lg:hidden w-full rounded-lg shadow-[var(--shadow)] p-4 flex justify-between items-start transition-transform transform hover:scale-105 hover:shadow-2xl'>
				<div className='flex flex-col gap-1'>
					<p className='font-semibold text-lg text-[var(--black)]'>
						{name}{' '}
						<span className='font-normal text-[var(--middle)]'>({group})</span>
					</p>
					<p className='text-[var(--middle)] font-medium text-sm'>
						Занятие: {lecture}
					</p>
				</div>
				<div className='flex flex-col items-end gap-1'>
					<p className='font-medium text-[var(--black)] flex items-center'>
						Активность:
						<span className='ml-1 font-semibold bg-[var(--green-status-bg)] text-[var(--green-status-text)] px-2 rounded-md whitespace-nowrap'>
							{formatTime(activity)}
						</span>
					</p>
					<p className='text-[var(--middle)] text-sm'>
						{formatDate(last_activity)}
					</p>
				</div>
			</div>
		</>
	)
}

const filterConfig = {
	'Имя (А–Я)': { student_name_order: 'asc' },
	'Имя (Я–А)': { student_name_order: 'desc' },
	'Дата (сначала новые)': { module_section_date_order: 'desc' },
	'Дата (сначала старые)': { module_section_date_order: 'asc' },
	'Активность (по убыванию)': { session_time_order: 'desc' },
	'Активность (по возрастанию)': { session_time_order: 'asc' },
	'Занятие (по убыванию)': { module_section_title_order: 'desc' },
	'Занятие (по возрастанию)': { module_section_title_order: 'asc' },
}

const ActivityStudents = () => {
	const { courseId } = useParams()

	const [groups, setGroups] = useState([])
	const [lessons, setLessons] = useState({})
	const [students, setStudents] = useState([])

	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)
	const [searchStudents, setSearchStudents] = useState('')

	const [isSearchLoading, setIsSearchLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	// Функция загрузки списка студентов
	const loadStudents = async (term = '') => {
		if (!courseId) return
		setIsSearchLoading(true)

		const lessonKeys = Object.keys(lessons)
		const lessonKey =
			selectedLesson !== null && selectedLesson !== undefined
				? lessonKeys[selectedLesson]
				: null

		const params = {
			...(term && { term }),
			...(selectedGroup !== null && { group_name: groups[selectedGroup] }),
			...(lessonKey && { module_section_id: lessons[lessonKey] }),
			...(selectedFilter && filterConfig[selectedFilter]),
		}

		try {
			const data = await ActivityAPI.fetchStudents(courseId, params)
			setStudents(data)
		} catch (e) {
			console.error('loadStudents error', e)
		} finally {
			setIsSearchLoading(false)
		}
	}

	// Первичная загрузка групп и занятий
	useEffect(() => {
		if (!courseId) return

		ActivityAPI.fetchLinkedGroups(courseId)
			.then(setGroups)
			.catch(err => console.error(err))

		ActivityAPI.fetchLessons(courseId)
			.then(setLessons)
			.catch(err => console.error(err))
	}, [courseId])

	// Дебаунс для поиска по ФИО + триггер на изменение фильтров
	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			loadStudents(searchStudents)
		}, 500)

		return () => clearTimeout(delayDebounce)
	}, [searchStudents, selectedGroup, selectedFilter, selectedLesson, lessons])

	return (
		<div>
			{/* Десктопные фильтры */}
			<div className='lg:flex hidden justify-between gap-2 w-full mb-2'>
				<div className='flex gap-2 h-full items-center min-[1800px]:w-2/5 w-full'>
					<FilterOptionInput
						Options={groups}
						color='white'
						placeholder='Группа'
						onChange={setSelectedGroup}
						value={selectedGroup}
						width='w-[175px]'
					/>
					<FilterOptionInput
						Options={Object.keys(lessons)}
						color='white'
						placeholder='Занятие'
						onChange={setSelectedLesson}
						value={selectedLesson}
						width='w-[225px]'
						showReset
					/>
					<SearchInput
						width='100%'
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading}
						showReset
					/>
				</div>
				<FilterOptionInput
					Options={Object.keys(filterConfig)}
					placeholder='Фильтр'
					value={selectedFilter}
					onChange={setSelectedFilter}
					width='w-[275px]'
					showReset
				/>
			</div>

			{/* Мобильные фильтры */}
			<div className='flex justify-between gap-2 w-full mb-2 lg:hidden'>
				<div className='flex gap-2 h-full items-center min-[1800px]:w-2/5 w-full'>
					<SearchInput
						width='100%'
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading}
						showReset
					/>
				</div>
				<div className='relative select-none'>
					<div
						onClick={() => setIsOpen(prev => !prev)}
						className='bg-[var(--white)] text-[var(--black)] flex justify-between gap-2 items-center rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium'
					>
						<p>Фильтры</p>
						<FilterIcon className='transition-all' />
					</div>

					{isOpen && (
						<div className='absolute bg-[var(--white)] flex flex-col gap-3 p-2 rounded-xl shadow-[var(--shadow)] h-40 hide-scrollbar w-75 right-0 top-11 z-5 text-[var(--black)]'>
							<FilterOptionInput
								Options={groups}
								color='white'
								placeholder='Группа'
								onChange={setSelectedGroup}
								value={selectedGroup}
								width='w-full'
							/>
							<FilterOptionInput
								Options={Object.keys(lessons)}
								color='white'
								placeholder='Занятие'
								onChange={setSelectedLesson}
								value={selectedLesson}
								width='w-full'
								showReset
							/>
							<FilterOptionInput
								Options={Object.keys(filterConfig)}
								placeholder='Сортировка'
								value={selectedFilter}
								onChange={setSelectedFilter}
								width='w-full'
								showReset
							/>
						</div>
					)}
				</div>
			</div>

			{/* Таблица / Список */}
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(77.5vh-100px)] overflow-hidden flex flex-col p-2'>
				<div className='max-lg:hidden w-full flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] text-[var(--black)] h-12 px-4'>
					{[
						'ФИО',
						'Группа',
						'Занятие',
						'Время нахождения',
						'Последняя активность',
					].map((title, idx) => (
						<p
							key={idx}
							className='w-1/4 h-full flex items-center justify-center overflow-hidden'
						>
							<span className='truncate'>{title}</span>
						</p>
					))}
				</div>

				<div className='flex flex-col p-2 gap-2'>
					{students?.length === 0 ? (
						<p className='text-center text-2xl text-[var(--middle)]'>Пусто</p>
					) : (
						students?.map(item => {
							const initialF = item?.first_name ? `${item.first_name[0]}.` : ''
							const initialM = item?.middle_name
								? `${item.middle_name[0]}.`
								: ''
							const fullName =
								`${item?.last_name || ''} ${initialF} ${initialM}`.trim()

							return (
								<TableEl
									key={item?.id || item?.student_id || fullName}
									name={fullName}
									group={item?.group_name}
									lecture={item?.module_section_title}
									activity={item?.session_time}
									last_activity={item?.end_date}
								/>
							)
						})
					)}
				</div>
			</div>
		</div>
	)
}

export default ActivityStudents
