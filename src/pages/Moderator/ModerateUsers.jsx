import { useEffect, useState } from 'react'
import Modal from '../../components/Atoms/Modal'
import {
	ArrowLeft,
	Key,
	Mail,
	Plus,
	ShieldCheck,
	Trash2,
	User,
} from 'lucide-react'
import { Input } from '../../components/Molecules/InputFields/Input'
import { SubmitButton } from '../../components/Atoms/Buttons/SubmitButton'
import { UserCard } from '../../components/Organisms/Cards/UserCard'
import { BasicPagination } from '../../components/Molecules/Pagination'
import { Text } from '../../components/Atoms/Text'
import { UserForm } from '../../components/Organisms/Forms/UserForm'

const ModerateUsers = () => {
	const [mode, setMode] = useState(null)
	const [page, setPage] = useState(1)
	const [users, setUsers] = useState([])
	const [courses, setCourses] = useState([])

	const [searchParams, setSearchParams] = useSearchParams()
	const activeUserId = searchParams.get('user_id')
	const handleUserClick = id => {
		// Обновляем query-параметр.
		// { replace: true } нужен, чтобы не спамить в историю браузера при каждом клике
		setSearchParams({ user_id: id }, { replace: true })
	}
	const clearParams = () => {
		setSearchParams({}, { replace: true })
		setMode(null)
	}

	useEffect(() => {
		if (activeUserId !== null) {
			setMode('edit')
		} else {
			setMode(null)
		}
	}, [activeUserId])

	const getUsers = async () => {
		try {
			const res = await GetUsers('teacher')
			setUsers(res)
		} catch (err) {}
	}

	useEffect(() => {
		getUsers()
	}, [])

	return (
		<>
			<div className='grid grid-cols-[500px_1fr] h-screen gap-6 pt-30 pb-10 '>
				{/* Боковая панель (Sidebar) */}
				<div className='w-full h-full overflow-y-auto bg-[var(--white)] shadow-lg rounded-3xl p-4 flex flex-col justify-between'>
					<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)]'>
						Существующие пользователи
					</h2>
					<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
						{users?.items?.map((user, index) => (
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.125,
									ease: 'easeOut',
								}}
							>
								<UserCard
									FullName={user?.full_name}
									avatar_url={user?.avatar_url}
									email={user?.email}
									role={user?.role}
									onClick={() => {
										handleUserClick(user.id)
									}}
								/>
							</motion.div>
						))}
					</div>

					<BasicPagination
						count={users?.total_pages}
						page={page}
						onPageChange={setPage}
						siblingCount={0}
					/>
				</div>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
					{mode === null ? (
						<div className='flex items-center justify-center w-full h-full'>
							<SubmitButton onClick={() => setMode('create')}>
								<div className='flex items-center justify-center gap-3 w-full'>
									<Plus />
									<span style={{ fontSize: '16px' }}>
										Зарегистрировать пользователя
									</span>
								</div>
							</SubmitButton>
						</div>
					) : (
						<div className='flex flex-col gap-5 h-full w-full'>
							<div className='flex items-center w-full justify-between'>
								<ButtonCase
									onClick={() => {
										clearParams()
									}}
									backgroundColor='var(--white)'
									textColor='var(--black)'
									hoverStyles='hover:bg-[var(--hero)] hover:text-white'
									className={`aspect-square p-3 flex items-center`}
								>
									<ArrowLeft className='text-[var(--black)]' />
								</ButtonCase>
								<Text size={'xl'} font={'medium'} style={'primary'}>
									{mode === 'edit'
										? 'Редактирование пользователя'
										: 'Регистрация пользователя'}
								</Text>
								<div className='w-10'></div>
							</div>

							<UserForm
								mode={mode}
								userId={activeUserId}
								onChange={data => {
									if (data === 'delete') {
										clearParams()
									} else {
										handleUserClick(data)
									}
									getUsers()
								}}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
export default ModerateUsers
