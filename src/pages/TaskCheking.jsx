import {
	ArrowLeft,
	BookMarked,
	LaptopMinimalCheck,
	NotebookPen,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GetAllCoursesForTeacher } from '../../service/APIs/Couses'
import { CourseMiniCard } from '../components/Cards'
import { DefaultButton } from '../components/Buttons'
import { GetUsers } from '../../service/APIs/Moderation'

const UserCard = ({ FullName, avatar_url, email, role, onClick }) => {
	const roles = {
		student: 'Cтудент',
		teacher: 'Преподаватель',
		moderator: 'Модератор',
	}

	return (
		<>
			<div
				onClick={onClick}
				className='w-full h-fit flex gap-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] p-2'
			>
				{avatar_url ? (
					<img className='rounded-xl w-12.5 h-12.5' src={avatar_url} alt='' />
				) : (
					<ImageOff className='h-12 rounded-xl object-cover aspect-square w-auto p-3 text-[var(--middle)] bg-[var(--light-middle)]' />
				)}

				<div className='flex flex-col w-full'>
					<div className='flex flex-wrap w-full items-center justify-between'>
						<p className='text-lg text-[var(--black)]'>
							{FullName?.last_name} {FullName?.first_name[0]}
							{'. '}
							{FullName?.patronymic[0]}.
						</p>
						<p className='text-sm bg-[var(--transparent-hero)] text-[var(--hero)] px-2 rounded-full'>
							{role && <p>{roles[role]}</p>}
						</p>
					</div>

					<p className='text-sm text-[var(--middle)]'>{email}</p>
				</div>
			</div>
		</>
	)
}

const TaskCard = ({ data, onClick }) => {
	const scoreConfigs = {
		1: {
			val: 1,
			title: 'Неудовлетворительно',
			color: 'bg-[var(--red-base)] text-[var(--red-surface)]',
		},
		2: {
			val: 2,
			title: 'Неудовлетворительно',
			color: 'bg-[var(--orange-base)] text-[var(--orange-surface)]',
		},
		3: {
			val: 3,
			title: 'Удовлетворительно',
			color: 'bg-[var(--yellow-base)] text-[var(--yellow-surface)]',
		},
		4: {
			val: 4,
			title: 'Хорошо',
			color: 'bg-[var(--lime-base)] text-[var(--lime-surface)]',
		},
		5: {
			val: 5,
			title: 'Отлично',
			color: 'bg-[var(--green-base)] text-[var(--green-surface)]',
		},
	}

	const icon = {
		lecture: <BookMarked />,
		practice: <NotebookPen />,
		test: <LaptopMinimalCheck />,
	}[data.type]

	const score = scoreConfigs[data.score] // Используй свой объект scoreConfigs

	return (
		<div
			onClick={onClick}
			className='p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors'
		>
			<div className='flex items-center gap-3'>
				{icon}
				<div>
					<h3 className='font-medium'>{data.title}</h3>
					<span className={`text-xs px-2 py-0.5 rounded ${score?.color}`}>
						{score ? score.title : 'На проверке'}
					</span>
				</div>
			</div>
		</div>
	)
}

const TestChecking = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const courseId = searchParams.get('course_id')
	const userId = searchParams.get('student_id')
	const taskId = searchParams.get('task_id')

	const [courses, setCourses] = useState([])
	const [students, setStudents] = useState([]) // Добавь API для студентов курса

	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await GetUsers('teacher')
				setStudents(res)
			} catch (err) {}
		}
		getUsers()
	}, [])

	useEffect(() => {
		// Загрузка курсов
		GetAllCoursesForTeacher()
			.then(setCourses)
			.catch(() => {})
	}, [])

	const clearParams = () => setSearchParams({})

	return (
		<div className='grid grid-cols-[300px_500px_1fr] h-screen gap-6 pt-30 pb-10'>
			{/* 1 Колонна: Курсы и Студенты */}
			<div className='bg-[var(--white)] shadow-lg rounded-3xl p-4 flex flex-col gap-4 overflow-y-auto'>
				{!courseId ? (
					<>
						<h2 className='text-xl font-bold'>Выберите курс</h2>
						{courses?.map(course => (
							<CourseMiniCard
								key={course.id}
								data={course}
								onClick={() => setSearchParams({ course_id: course.id })}
							/>
						))}
					</>
				) : (
					<>
						<div className='flex items-center gap-2'>
							<DefaultButton
								paddings='px-2 py-1 gap-1'
								width='w-fit'
								flexParams='items-center'
								invert={true}
								onClick={() => {
									clearParams()
								}}
							>
								<ArrowLeft className='text-[var(--black)]' />
								Курсы
							</DefaultButton>
							<h2 className='font-bold'>Студенты курса</h2>
						</div>
						{/* Здесь список студентов этого курса */}
						{students?.items?.map(user => (
							<UserCard
								FullName={user?.full_name}
								avatar_url={user?.avatar_url}
								email={user?.email}
								role={user?.role}
								onClick={() => {
									const newParams = new URLSearchParams(searchParams)
									newParams.set('student_id', user.id)
									setSearchParams(newParams)
								}}
							/>
						))}
					</>
				)}
			</div>

			{/* 2 Колонна: Список заданий студента */}
			<div className='bg-[var(--white)] shadow-lg rounded-3xl p-4 overflow-y-auto'>
				{userId ? (
					<>
						<h2 className='text-xl font-bold mb-4'>Задания</h2>
						{/* Маппинг заданий пользователя */}
						{/* <TaskCard onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), task_id: task.id })} /> */}
					</>
				) : (
					<p className='text-[var(--middle)]'>Выберите студента</p>
				)}
			</div>

			{/* 3 Колонна: Область проверки */}
			<div className='bg-[var(--white)] shadow-lg rounded-3xl p-6'>
				{taskId ? (
					<div>
						{/* Здесь рендер контента для проверки конкретного задания */}
					</div>
				) : (
					<div className='flex items-center justify-center h-full text-[var(--middle)]'>
						Выберите задание для проверки
					</div>
				)}
			</div>
		</div>
	)
}
export default TestChecking
