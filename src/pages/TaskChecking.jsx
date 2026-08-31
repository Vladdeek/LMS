import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Users, ChevronLeft } from 'lucide-react'
import {
	fetchCourses,
	fetchGroups,
	fetchStudents,
	fetchTasks,
} from '../api/ChekingService'
import ResponsiveSidebar from '../components/Molecules/ResponsiveSidebar'
import { SubmitButton } from '../components/Atoms/Buttons/SubmitButton'
import { UserCard } from '../components/Organisms/Cards/UserCard'
import { TaskCard } from '../components/Organisms/Cards/TaskCard'
import { CourseMiniCard } from '../components/Organisms/Cards/CourseMiniCard'
import { TestCheckingView } from '../components/Organisms/TestManager/TeskCheckingView'

const TestChecking = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const courseId = searchParams.get('course_id')
	const groupId = searchParams.get('group_id')
	const studentId = searchParams.get('student_id')
	const taskId = searchParams.get('task_id')

	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const [courses, setCourses] = useState([])
	const [groups, setGroups] = useState([])
	const [students, setStudents] = useState([])
	const [tasks, setTasks] = useState([])

	// 1. Загрузка списка курсов
	useEffect(() => {
		fetchCourses().then(setCourses).catch(console.error)
	}, [])

	// 2. Загрузка групп при выборе курса
	useEffect(() => {
		if (courseId) {
			fetchGroups(courseId).then(setGroups).catch(console.error)
		} else {
			setGroups([])
		}
	}, [courseId])

	// 3. Загрузка студентов при выборе группы
	useEffect(() => {
		if (groupId) {
			fetchStudents(groupId).then(setStudents).catch(console.error)
		} else {
			setStudents([])
		}
	}, [groupId])

	// 4. Загрузка тасков при выборе студента и курса
	useEffect(() => {
		if (studentId && courseId) {
			fetchTasks(studentId, courseId).then(setTasks).catch(console.error)
		} else {
			setTasks([])
		}
	}, [studentId, courseId])

	// Утилита для обновления параметров URL
	const updateParams = newParamsMap => {
		const newParams = new URLSearchParams(searchParams)
		Object.entries(newParamsMap).forEach(([key, value]) => {
			if (value === null) {
				newParams.delete(key)
			} else {
				newParams.set(key, value)
			}
		})
		setSearchParams(newParams)
	}

	const handleBackToCourses = () => {
		updateParams({
			course_id: null,
			group_id: null,
			student_id: null,
			task_id: null,
		})
	}

	const handleBackToGroups = () => {
		updateParams({ group_id: null, student_id: null, task_id: null })
	}

	const handleBackToTasks = () => {
		updateParams({ task_id: null })
	}

	// Динамический заголовок сайдбара
	const getSidebarTitle = () => {
		if (!courseId) return 'Выбор курса'
		if (!groupId) return 'Выбор группы'
		return 'Выбор студента'
	}

	const currentTask = tasks?.find(t => String(t.id) === String(taskId))

	return (
		<div className='flex lg:grid lg:grid-cols-[340px_1fr] h-screen gap-6 pt-24 pb-6 px-4'>
			{/* ЛЕВАЯ КОЛОНКА: Навигационный сайдбар (Курс -> Группа -> Студент) */}
			<ResponsiveSidebar
				title={getSidebarTitle()}
				triggerTitle='Фильтры выборки'
				triggerIcon={Users}
				isOpen={isSidebarOpen}
				setIsOpen={setIsSidebarOpen}
			>
				<div className='w-full h-full overflow-y-auto flex flex-col gap-3 pr-1'>
					{/* Шаг 1: Курсы */}
					{!courseId && (
						<div className='flex flex-col gap-2'>
							{courses?.map(course => (
								<CourseMiniCard
									key={course.id}
									data={course}
									onClick={() => updateParams({ course_id: course.id })}
								/>
							))}
						</div>
					)}

					{/* Шаг 2: Группы */}
					{courseId && !groupId && (
						<div className='flex flex-col gap-2'>
							<SubmitButton
								className={'flex items-center gap-1'}
								invert
								onClick={handleBackToCourses}
							>
								<ArrowLeft className='w-4 h-4 text-[var(--black)]' />К курсам
							</SubmitButton>

							<div className='flex flex-col gap-2 mt-2'>
								{groups?.map(group => (
									<div
										key={group.id}
										onClick={() => updateParams({ group_id: group.id })}
										className='p-3 bg-[var(--white)] rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors'
									>
										<p className='font-semibold text-sm text-[var(--black)]'>
											{group.name || group.title || `Группа ${group.id}`}
										</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Шаг 3: Студенты */}
					{courseId && groupId && (
						<div className='flex flex-col gap-2'>
							<SubmitButton
								className={'flex items-center gap-1'}
								invert={true}
								onClick={handleBackToGroups}
							>
								<ArrowLeft className='w-4 h-4 text-[var(--black)]' />К группам
							</SubmitButton>

							<div className='flex flex-col gap-2 mt-2'>
								{students?.map(user => (
									<UserCard
										key={user.id}
										FullName={user?.personal_data}
										avatar_url={user?.image_path}
										onClick={() => {
											updateParams({ student_id: user.id, task_id: null })
											setIsSidebarOpen(false)
										}}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</ResponsiveSidebar>

			{/* ОСНОВНАЯ РАБОЧАЯ ЗОНА */}
			<div className='flex-1 bg-[var(--white)] shadow-lg rounded-3xl p-6 overflow-y-auto h-full border border-gray-100 flex flex-col'>
				{!studentId ? (
					// Состояние: Не выбран студент
					<div className='flex items-center justify-center h-full text-[var(--middle)] text-base'>
						Выберите курс, группу и студента в панели слева
					</div>
				) : !taskId ? (
					// Состояние: Студент выбран -> Отображаем список его тасков
					<div className='flex flex-col h-full gap-4'>
						<div className='border-b pb-4 flex items-center justify-between'>
							<h1 className='text-xl font-bold text-[var(--black)]'>
								Задания студента
							</h1>
							<span className='text-sm text-[var(--middle)]'>
								Всего заданий: {tasks?.length || 0}
							</span>
						</div>

						{tasks?.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto p-2'>
								{tasks.map(task => {
									const actualTaskId =
										task.id || task.task_id || task.assignment_id
									return (
										<TaskCard
											key={actualTaskId}
											data={task}
											isSelected={false}
											onClick={() => updateParams({ task_id: actualTaskId })}
										/>
									)
								})}
							</div>
						) : (
							<div className='flex items-center justify-center h-full text-[var(--middle)] text-sm'>
								У данного студента пока нет заданий
							</div>
						)}
					</div>
				) : (
					<div className='flex flex-col h-full gap-4'>
						<div className='border-b border-[var(--light-middle)] pb-4 flex items-center justify-between'>
							<button
								onClick={handleBackToTasks}
								className='flex items-center gap-1 text-sm font-medium text-[var(--hero)] hover:underline'
							>
								<ChevronLeft className='w-4 h-4' /> К списку заданий
							</button>
						</div>

						{/* Отображаем проверку теста */}
						<div className='flex-1 overflow-y-auto p-4 rounded-2xl'>
							<TestCheckingView id={taskId} studentId={studentId} />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default TestChecking
