import { useState, useEffect, useMemo, useRef } from 'react'
import {
	format,
	startOfWeek,
	addDays,
	isToday,
	isWithinInterval,
	startOfToday,
	isSameDay,
	addWeeks,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import Loader from '../components/Loader'
import { OptionSearch } from '../components/Inputs'
import { useUser } from '../../service/context/UserContext'
import {
	fetchScheduleData,
	fetchTeachersList,
} from '../../service/APIs/Schedule'

const ScheduleCard = ({
	lessonIndex,
	isCurrent,
	start_time,
	end_time,
	title,
	description,
	auditory_name,
	subgroup,
	isCompact,
}) => {
	return (
		<div
			key={lessonIndex}
			className={`relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero)]' : ''
			}`}
		>
			<p className='xl:text-sm text-xs text-[var(--black)]'>
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero)] text-white w-fit'>
					{start_time}
				</span>
				—
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero)] text-white w-fit'>
					{end_time}
				</span>
			</p>

			<p
				className={`text-[var(--black)] font-bold ${isCompact ? 'text-lg' : 'xl:text-lg text-md'}`}
			>
				{title}
			</p>
			<p
				className={`text-[var(--middle)] font-light ${isCompact ? 'text-sm' : 'xl:text-sm text-xs'}`}
			>
				{description}
			</p>
			<p
				className={`text-[var(--middle)] font-light ${isCompact ? 'text-sm mb-3' : 'xl:text-sm text-xs mb-3'}`}
			>
				{subgroup}
			</p>

			<p
				className={`absolute w-fit flex gap-1 items-center text-[var(--middle)] font-light ${isCompact ? 'bottom-1 right-1' : 'bottom-2 right-2'}`}
			>
				ауд.
				<span
					className={`text-white w-fit rounded-lg bg-[var(--hero)] px-2 py-[1px] font-medium ${isCompact ? 'text-sm' : 'xl:text-sm text-xs'}`}
				>
					{auditory_name}
				</span>
			</p>
		</div>
	)
}

const DayCard = ({
	isCurrentDay,
	isSelected,
	day,
	month,
	weekDay,
	onClick,
	isCompact,
}) => {
	if (isCompact) {
		return (
			<div
				onClick={onClick}
				className={`cursor-pointer rounded-xl shadow-[var(--shadow)] flex items-center justify-center gap-3 text-[var(--black)] font-medium w-full p-4 ${
					isSelected ? 'bg-[var(--hero)] text-white' : 'bg-[var(--white)]'
				}`}
			>
				<div className='flex flex-col items-center justify-center'>
					<p className='text-3xl'>{day}</p>
					<p className='text-lg'>{weekDay}</p>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`rounded-xl shadow-[var(--shadow)] flex items-center justify-center gap-3 text-[var(--black)] font-medium w-full p-4 ${
				isCurrentDay ? 'bg-[var(--hero)] text-white' : 'bg-[var(--white)]'
			}`}
		>
			<div className='flex flex-col items-center justify-center'>
				<p className='2xl:text-8xl xl:text-7xl text-5xl'>{day}</p>
				<p className='2xl:text-2xl xl:text-xl text-md'>{month}</p>
			</div>
			<p className='2xl:text-7xl xl:text-6xl text-5xl'>{weekDay}</p>
		</div>
	)
}

const ScheduleHeader = ({
	role,
	selected,
	setSelected,
	onSelected,
	searchTeachers,
	setSearchTeachers,
	teachers,
	onClick,
	prev_active,
	next_active,
	setWeekOffset,
	WeekNumber,
	academic_year,
	semester,
	isCompact,
}) => {
	return (
		<div
			className={`flex m-3 ${isCompact ? 'w-full relative flex-col justify-center mb-3' : 'items-center justify-between'}`}
		>
			{role === 'student' && (
				<div
					className={
						isCompact
							? 'w-full flex flex-col'
							: 'w-full flex items-center gap-3 relative'
					}
				>
					<button
						type='button'
						onClick={e => {
							e.preventDefault()
							const newValue = !selected
							setSelected(newValue)
							onSelected?.(newValue)
						}}
						className={`bg-transparent py-2.5 ring-2 rounded-lg cursor-pointer transition-all font-medium text-xl ${isCompact ? 'w-full' : 'px-4'} ${
							selected
								? 'text-[var(--hero)] ring-[var(--hero)]'
								: 'text-[var(--black)] ring-[var(--black)]'
						}`}
					>
						Найти преподавателя
					</button>
					<div
						className={`transition-all ${isCompact ? 'w-full my-3' : ''} ${!selected ? 'absolute opacity-0 -z-1 pointer-events-none' : ''}`}
					>
						<OptionSearch
							placeholder='Иванов И..'
							onSearch={setSearchTeachers}
							Options={teachers}
							onSelect={onClick}
						/>
					</div>
				</div>
			)}
			<div
				className={`flex flex-col w-full justify-center ${isCompact ? 'text-[var(--black)]' : role !== 'student' ? 'items-center' : 'items-end'}`}
			>
				<div
					className={`w-full flex items-center gap-5 text-[var(--black)] ${isCompact ? 'justify-between' : role !== 'student' ? 'justify-center' : 'justify-end'}`}
				>
					<ChevronLeft
						size={48}
						onClick={() => prev_active && setWeekOffset(prev => prev - 1)}
						className={`${!prev_active ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
					/>
					<p className='font-medium text-2xl mt-0.5'>Неделя {WeekNumber}</p>
					<ChevronRight
						size={48}
						onClick={() => next_active && setWeekOffset(prev => prev + 1)}
						className={`${!next_active ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
					/>
				</div>
				<p
					className={`font-light text-[var(--middle)] text-md mt-0.5 ${isCompact || role !== 'student' ? 'text-center' : 'text-end'}`}
				>
					Учебный год: {academic_year} Семестр: {semester}
				</p>
			</div>
		</div>
	)
}

// Общий хук для работы с логикой преподавателей (убирает дублирование стейтов)
const useTeacherSearch = () => {
	const [selected, setSelected] = useState(false)
	const [teachers, setTeachers] = useState([])
	const [searchTeachers, setSearchTeachers] = useState('')
	const teachersDebounce = useRef(null)

	useEffect(() => {
		const loadTeachers = async () => {
			try {
				const data = await fetchTeachersList(searchTeachers)
				setGlobalError(null)
				setTeachers(data)
			} catch (error) {
				console.error(error)
			}
		}

		if (searchTeachers === '') {
			loadTeachers()
			return
		}

		if (teachersDebounce.current) clearTimeout(teachersDebounce.current)
		teachersDebounce.current = setTimeout(loadTeachers, 1500)

		return () => clearTimeout(teachersDebounce.current)
	}, [searchTeachers])

	return { selected, setSelected, teachers, searchTeachers, setSearchTeachers }
}

// Функция проверки текущего урока
const checkIsCurrentLesson = (lessonDate, lessonTime) => {
	try {
		const [hours, minutes] = lessonTime.split(':').map(Number)
		const lessonStart = new Date(lessonDate)
		lessonStart.setHours(hours, minutes, 0, 0)
		const lessonEnd = new Date(lessonStart.getTime() + 90 * 60000)
		return isWithinInterval(new Date(), { start: lessonStart, end: lessonEnd })
	} catch {
		return false
	}
}

const ScheduleDesktop = ({
	scheduleData,
	Offset,
	prev_active,
	next_active,
	selectedOffset,
	WeekNumber,
	role,
	onClick,
	onSelected,
	academic_year,
	semester,
}) => {
	const [weekOffset, setWeekOffset] = useState(selectedOffset)
	const searchProps = useTeacherSearch()

	const today = new Date()
	const weekStart = startOfWeek(addWeeks(today, weekOffset), {
		weekStartsOn: 1,
	})
	const weekDays = useMemo(
		() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)),
		[weekStart],
	)

	useEffect(() => {
		Offset?.(weekOffset)
	}, [weekOffset])

	return (
		<>
			<ScheduleHeader
				role={role}
				prev_active={prev_active}
				next_active={next_active}
				setWeekOffset={setWeekOffset}
				WeekNumber={WeekNumber}
				academic_year={academic_year}
				semester={semester}
				onClick={onClick}
				onSelected={onSelected}
				isCompact={false}
				{...searchProps}
			/>
			<div className='grid grid-cols-6 gap-2'>
				{weekDays.map((day, index) => {
					const dateString = format(day, 'yyyy-MM-dd')
					const daySchedule = scheduleData?.[dateString] || []

					return (
						<div key={index} className='flex flex-col gap-4'>
							<DayCard
								isCurrentDay={isToday(day)}
								day={format(day, 'd')}
								month={format(day, 'MMMM', { locale: ru })}
								weekDay={format(day, 'EEEEEE', { locale: ru }).toUpperCase()}
								isCompact={false}
							/>
							<div className='flex flex-col gap-3'>
								{daySchedule.length > 0 ? (
									daySchedule.map((lesson, idx) => (
										<ScheduleCard
											key={idx}
											lessonIndex={idx}
											isCurrent={checkIsCurrentLesson(day, lesson.start_time)}
											isCompact={false}
											{...lesson}
										/>
									))
								) : (
									<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex items-center justify-center min-h-[120px]'>
										<p className='text-[var(--middle)] text-center'>
											Нет занятий
										</p>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

const ScheduleMobile = ({
	scheduleData,
	Offset,
	prev_active,
	next_active,
	selectedOffset,
	WeekNumber,
	role,
	onClick,
	onSelected,
	semester,
	academic_year,
}) => {
	const [weekOffset, setWeekOffset] = useState(selectedOffset)
	const searchProps = useTeacherSearch()

	const today = startOfToday()
	const weekStart = startOfWeek(addWeeks(today, weekOffset), {
		weekStartsOn: 1,
	})
	const weekDays = useMemo(
		() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)),
		[weekStart],
	)

	const [selectedDay, setSelectedDay] = useState(
		weekDays.find(d => isSameDay(d, today)) || weekDays[0],
	)
	const selectedDaySchedule =
		scheduleData?.[format(selectedDay, 'yyyy-MM-dd')] || []

	useEffect(() => {
		Offset?.(weekOffset)
	}, [weekOffset])

	return (
		<>
			<ScheduleHeader
				role={role}
				prev_active={prev_active}
				next_active={next_active}
				setWeekOffset={setWeekOffset}
				WeekNumber={WeekNumber}
				academic_year={academic_year}
				semester={semester}
				onClick={onClick}
				onSelected={onSelected}
				isCompact={true}
				{...searchProps}
			/>
			<div className='grid grid-cols-6 gap-2'>
				{weekDays.map((day, index) => (
					<DayCard
						key={index}
						isSelected={isSameDay(day, selectedDay)}
						onClick={() => setSelectedDay(day)}
						day={format(day, 'd')}
						weekDay={format(day, 'EEEEEE', { locale: ru }).toUpperCase()}
						isCompact={true}
					/>
				))}
				<div className='col-span-6 flex flex-col gap-3 mt-1'>
					{selectedDaySchedule.length > 0 ? (
						selectedDaySchedule.map((lesson, idx) => (
							<ScheduleCard
								key={idx}
								lessonIndex={idx}
								isCurrent={checkIsCurrentLesson(selectedDay, lesson.start_time)}
								isCompact={true}
								{...lesson}
							/>
						))
					) : (
						<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex items-center justify-center min-h-[120px]'>
							<p className='text-[var(--middle)] text-center'>Нет занятий</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

const SchedulePage = () => {
	const { role } = useUser()
	const [scheduleData, setScheduleData] = useState({})
	const [allScheduleData, setAllScheduleData] = useState({})
	const [loading, setLoading] = useState(false)
	const [current_week, setCurrentWeek] = useState(0)
	const [selected, setSelected] = useState(false)
	const [teacher, setTeacher] = useState('')

	const loadSchedule = async () => {
		setLoading(true)
		try {
			const data = await fetchScheduleData(current_week, teacher, selected)
			setAllScheduleData(data)

			const normalized = {}

			Object.entries(data?.schedule || {}).forEach(([date, lessons]) => {
				const shortDate = date.split('T')[0]
				const map = {}

				lessons.forEach(lesson => {
					const key = [
						lesson.start_time,
						lesson.end_time,
						lesson.subject_name,
						lesson.lesson_type,
						lesson.teacher_full_name,
						lesson.classroom,
					].join('|')

					if (!map[key]) {
						map[key] = {
							...lesson,
							group_names: [lesson.group_name],
							subgroups: lesson.subgroup != null ? [lesson.subgroup] : [],
						}
					} else {
						if (lesson.subgroup != null)
							map[key].subgroups.push(lesson.subgroup)
						map[key].group_names.push(lesson.group_name)
					}
				})

				normalized[shortDate] = Object.values(map).map(lesson => {
					const subgroupsStr =
						lesson.subgroups.length > 0
							? lesson.subgroups
									.sort((a, b) => a - b)
									.map(sg => `${sg}-я подгруппа`)
									.join(', ')
							: null

					return {
						start_time: lesson.start_time.slice(0, 5),
						end_time: lesson.end_time.slice(0, 5),
						title: `${lesson.subject_name} (${lesson.lesson_type})`,
						description:
							role === 'student'
								? lesson.teacher_full_name
								: lesson.group_names.join(', '),
						auditory_name: lesson.classroom,
						subgroup: subgroupsStr,
						raw: lesson,
					}
				})
			})

			setScheduleData(normalized)
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadSchedule()
	}, [current_week])

	useEffect(() => {
		if (!selected || (selected && teacher)) {
			loadSchedule()
		}
	}, [selected, teacher])

	const commonProps = {
		scheduleData,
		Offset: setCurrentWeek,
		prev_active: allScheduleData?.has_prev,
		next_active: allScheduleData?.has_next,
		selectedOffset: current_week,
		WeekNumber: allScheduleData?.current_week_number,
		role,
		onClick: setTeacher,
		onSelected: setSelected,
		academic_year: allScheduleData?.academic_year,
		semester: allScheduleData?.semester,
	}

	return (
		<div className='flex flex-col gap-2 p-4 max-md:mb-20 md:min-h-[calc(100vh-100px)]'>
			{loading && (
				<div className='fixed inset-0 flex items-center justify-center z-[9999]'>
					<Loader />
				</div>
			)}

			<div className={loading ? 'pointer-events-none opacity-30' : ''}>
				<div className='lg:hidden'>
					<ScheduleMobile {...commonProps} />
				</div>
				<div className='max-lg:hidden'>
					<ScheduleDesktop {...commonProps} />
				</div>
			</div>
		</div>
	)
}

export default SchedulePage
