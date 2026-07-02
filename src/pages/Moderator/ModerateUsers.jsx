import { useScroll } from 'framer-motion'
import { InputDefault } from '../../components/Inputs'
import { useEffect, useState } from 'react'
import {
	ArrowLeft,
	Camera,
	ImageOff,
	Key,
	Mail,
	Plus,
	RefreshCw,
	Send,
	ShieldCheck,
	Trash,
	Trash2,
	User,
} from 'lucide-react'
import { DefaultButton } from '../../components/Buttons'
import {
	AddNewUser,
	DeleteUsersById,
	EditUserInfo,
	GetCreatedCoursesByUserId,
	GetUsers,
	GetUsersById,
	ToSendTheMessageAgainUserById,
} from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import CourseCard from '../../components/Cards'
import Modal from '../../components/Modal'

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
							{FullName?.last_name} {FullName?.first_name}{' '}
							{FullName?.patronymic}
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

const UserForm = ({ mode, userId, onChange }) => {
	const [isModalOpen, setIsModalOpen] = useState(null)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		patronymic: '',
		email: '',
	})
	const [avatarUrl, setAvatarUrl] = useState('')

	const [logined, setLogined] = useState(null)

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	useEffect(() => {
		const getUsersById = async () => {
			try {
				const res = await GetUsersById(userId)

				setFormData(prev => ({
					...prev,
					first_name: res.full_name.first_name,
					last_name: res.full_name.last_name,
					patronymic: res.full_name.patronymic,
					email: res.email,
				}))

				setAvatarUrl(res.avatar_url)
				setLogined(res.last_login_at)
			} catch (err) {
				console.error(err)
			}
		}
		userId && getUsersById()
	}, [userId])

	const addNewUser = async () => {
		try {
			const res = await AddNewUser(
				formData.first_name,
				formData.last_name,
				formData.patronymic,
				formData.email,
			)
			onChange?.(res.id)
		} catch (err) {}
	}

	const editUserInfo = async () => {
		try {
			const res = await EditUserInfo(
				formData.first_name,
				formData.last_name,
				formData.patronymic,
				formData.email,
				userId,
			)
			onChange?.(userId)
		} catch (err) {}
	}

	const deleteUsersById = async () => {
		try {
			const res = await DeleteUsersById(userId)
			onChange?.('delete')
		} catch (err) {}
	}

	const toSendTheMessageAgainUserById = async () => {
		try {
			const res = await ToSendTheMessageAgainUserById(userId)
		} catch (err) {}
	}

	const states = [
		'to-send-the-message-again',
		'generate-new-password',
		'delete-user',
	]

	const MODAL_CONFIG = {
		'to-send-the-message-again': {
			title: 'Повторная отправка',
			text: 'Вы уверены, что хотите отправить письмо еще раз? Проверьте папку "Спам".',
			confirmLabel: 'Отправить',
			confirmClass: 'bg-[var(--green-base)] hover:bg-[var(--green-hover)]',
			action: () => toSendTheMessageAgainUserById(),
		},
		'generate-new-password': {
			title: 'Новый пароль',
			text: 'Старый пароль перестанет действовать. Сгенерировать новый?',
			confirmLabel: 'Создать',
			confirmClass: 'bg-[var(--green-base)] hover:bg-[var(--green-hover)]',
			action: () => toSendTheMessageAgainUserById(),
		},
		'delete-user': {
			title: 'Удаление аккаунта',
			text: 'Это действие нельзя отменить. Все данные будут удалены навсегда.',
			confirmLabel: 'Удалить',
			confirmClass: 'bg-[var(--red-base)] hover:bg-[var(--red-hover)]',
			action: () => deleteUsersById(),
		},
	}

	return (
		<>
			<Modal width={'w-100'} isOpen={isModalOpen !== null}>
				{isModalOpen && (
					<div className='flex flex-col gap-4'>
						{/* 1. Заголовок и Предупреждение */}
						<div>
							<h2 className='text-xl text-[var(--black)] font-semibold mb-2'>
								{MODAL_CONFIG[isModalOpen].title}
							</h2>
							<p className='text-[var(--middle)]'>
								{MODAL_CONFIG[isModalOpen].text}
							</p>
						</div>

						{/* 2. Кнопки */}
						<div className='flex justify-end gap-3 mt-4'>
							{/* Кнопка отмены всегда одинаковая */}
							<button
								onClick={() => setIsModalOpen(null)}
								className='px-4 py-2 text-[var(--middle)] hover:bg-[var(--light-middle)] cursor-pointer rounded-xl transition-all'
							>
								Отмена
							</button>

							{/* Кнопка подтверждения берет данные из конфига */}
							<button
								onClick={() => {
									MODAL_CONFIG[isModalOpen].action()
									setIsModalOpen(null)
								}}
								className={`px-4 py-2 text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${MODAL_CONFIG[isModalOpen].confirmClass}`}
							>
								{MODAL_CONFIG[isModalOpen].confirmLabel}
							</button>
						</div>
					</div>
				)}
			</Modal>
			<div className='max-w-5xl mx-auto p-8 rounded-[32px]'>
				<div className='grid grid-cols-12 gap-10'>
					{/* ЛЕВАЯ КОЛОНКА: Виджет профиля */}
					<div className='col-span-12 lg:col-span-4 flex flex-col items-center text-center space-y-6 border-r border-gray-100/50 pr-4'>
						<div className='relative group'>
							<div className='w-48 h-48 rounded-[24px] overflow-hidden bg-[var(--light-middle)] flex items-center justify-center border-4 border-[var(--white)] shadow-lg'>
								{avatarUrl ? (
									<img
										src={avatarUrl}
										alt='Avatar'
										className='w-full h-full object-cover transition-transform duration-500 '
									/>
								) : (
									<User
										size={64}
										strokeWidth={1}
										className='text-[var(--middle)]'
									/>
								)}
							</div>
						</div>

						<div className='space-y-1'>
							<h2 className='text-2xl font-semibold text-[var(--black)] break-words leading-tight'>
								{formData.last_name || 'Фамилия'} {formData.first_name || 'Имя'}
								<br /> {formData.patronymic || 'Отчество'}
							</h2>
							<p className='text-sm text-[var(--middle)] font-medium'>
								{formData.email || 'example@mail.com'}
							</p>
						</div>

						{/* Управление доступом */}
						<div className='w-full pt-6 space-y-2 border-t border-gray-100/50'>
							{/* 1. Повторная отправка письма (если не пришло) */}
							<button
								onClick={() => setIsModalOpen(states[0])}
								disabled={logined !== null || mode === 'create'}
								className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all text-[var(--black)] ${logined !== null || mode === 'create' ? 'opacity-40 cursor-not-allowed' : ' hover:bg-[var(--light-middle)] hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Mail size={16} className='text-[var(--hero)]' />
								Повторить отправку письма
							</button>

							{/* 2. Генерация нового пароля (если забыл) */}
							<button
								onClick={() => setIsModalOpen(states[1])}
								disabled={logined === null || mode === 'create'}
								className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all text-[var(--black)] ${logined === null || mode === 'create' ? 'opacity-40 cursor-not-allowed' : ' hover:bg-[var(--light-middle)] hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Key size={16} className='text-[var(--middle-correct-lvl)]' />
								Сгенерировать новый пароль
							</button>

							{/* 3. Удаление аккаунта */}
							<button
								onClick={() => setIsModalOpen(states[2])}
								disabled={mode === 'create'}
								className={`w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all ${mode === 'create' ? 'opacity-40 cursor-not-allowed' : 'text-[var(--red-base)] bg-[var(--red-surface)] hover:text-[var(--red-surface)] hover:bg-[var(--red-base)] hover:scale-101 hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Trash2
									size={16}
									className='text-[var(--red-base)] group-hover:text-[var(--red-surface)] transition-all'
								/>
								Удалить аккаунт
							</button>
						</div>
					</div>

					{/* ПРАВАЯ КОЛОНКА: Основные поля */}
					<div className='col-span-12 lg:col-span-8 flex flex-col justify-between space-y-8'>
						<div className='space-y-6'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='p-2 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
									<ShieldCheck size={20} />
								</div>
								<h3 className='text-lg font-medium text-[var(--black)]'>
									Личные данные
								</h3>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
								<div className='md:col-span-2'>
									<InputDefault
										title='Электронная почта'
										name='email'
										placeholder='mail@example.com'
										value={formData.email}
										onChange={handleChange}
									/>
								</div>
								<InputDefault
									title='Фамилия'
									name='last_name' // Исправлено
									placeholder='Иванов'
									value={formData.last_name}
									onChange={handleChange}
								/>
								<InputDefault
									title='Имя'
									name='first_name' // Исправлено
									placeholder='Иван'
									value={formData.first_name}
									onChange={handleChange}
								/>
								<div className='md:col-span-2'>
									<InputDefault
										title='Отчество'
										name='patronymic'
										placeholder='Иванович'
										value={formData.patronymic}
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>

						{/* Главная кнопка внизу */}
						<div className='flex justify-end pt-4'>
							<DefaultButton
								width='w-full md:w-auto px-12 py-4'
								onClick={() =>
									mode === 'create' ? addNewUser() : editUserInfo()
								}
							>
								<span className='text-base font-semibold'>
									{mode === 'create'
										? 'Создать аккаунт'
										: 'Сохранить изменения'}
								</span>
							</DefaultButton>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
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
							<DefaultButton width='w-fit' onClick={() => setMode('create')}>
								<div className='flex items-center justify-center gap-3 w-full'>
									<Plus />
									<span style={{ fontSize: '16px' }}>
										Зарегистрировать пользователя
									</span>
								</div>
							</DefaultButton>
						</div>
					) : (
						<div className='flex flex-col gap-5 h-full w-full'>
							<div className='flex items-center w-full justify-between'>
								<DefaultButton
									paddings='p-3'
									width='w-fit aspect-square'
									flexParams='items-center'
									invert={true}
									onClick={() => {
										clearParams()
									}}
								>
									<ArrowLeft className='text-[var(--black)]' />
								</DefaultButton>
								<p className='text-[var(--black)] text-xl font-medium'>
									{mode === 'edit'
										? 'Редактирование пользователя'
										: 'Регистрация пользователя'}
								</p>
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
