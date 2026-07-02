import { useEffect, useState } from 'react'
import {
	AddNewUser,
	DeleteUsersById,
	EditUserInfo,
	GetUsersById,
	ToSendTheMessageAgainUserById,
} from '../../service/APIs/Moderation'
import {
	Camera,
	Edit3,
	Key,
	Mail,
	ShieldCheck,
	Trash2,
	User,
} from 'lucide-react'
import { InputDefault } from '../components/Inputs'
import { DefaultButton } from '../components/Buttons'
import { Me } from '../../service/APIs/Authorization'
import Modal from '../components/Modal'

const Profile = ({ mode, userId, onChange }) => {
	const roles = {
		student: 'Cтудент',
		teacher: 'Преподаватель',
		moderator: 'Модератор',
	}

	const [isModalOpen, setIsModalOpen] = useState(null)
	const [userInfo, setUserInfo] = useState(null)
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

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setUserInfo(res)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	console.log(userInfo)

	return (
		<>
			<Modal width={'w-100'} isOpen={isModalOpen !== null}>
				{isModalOpen && (
					<div className='flex flex-col gap-4 p-2'>
						<div>
							<h2 className='text-xl text-[var(--black)] font-semibold mb-2'>
								{MODAL_CONFIG[isModalOpen].title}
							</h2>
							<p className='text-[var(--middle)]'>
								{MODAL_CONFIG[isModalOpen].text}
							</p>
						</div>
						<div className='flex justify-end gap-3 mt-4'>
							<button
								onClick={() => setIsModalOpen(null)}
								className='px-4 py-2 text-[var(--middle)] hover:bg-[var(--light-middle)] cursor-pointer rounded-xl transition-all'
							>
								Отмена
							</button>
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

			<div className='min-h-screen w-full pt-30 pb-10 flex justify-center'>
				<div className='max-w-5xl w-full bg-[var(--white)] rounded-3xl shadow-sm border border-[var(--light-middle)] flex flex-col overflow-hidden'>
					{/* 1. HEADER: Аватар + ФИО + РОЛЬ */}
					<div className='p-8 border-b border-[var(--light-middle)] bg-[var(--white-hover)] flex flex-col md:flex-row items-center gap-10'>
						<div className='relative group'>
							<div className='w-40 h-40 rounded-3xl overflow-hidden bg-[var(--light-middle)] border-4 border-[var(--white)] shadow-md'>
								{avatarUrl ? (
									<img
										src={avatarUrl}
										alt='Avatar'
										className='w-full h-full object-cover transition-all group-hover:scale-105'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center'>
										<User
											size={56}
											strokeWidth={1}
											className='text-[var(--middle)]'
										/>
									</div>
								)}
							</div>
							<button
								className='absolute -bottom-2 -right-2 p-3 bg-[var(--hero)] text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-[var(--white)]'
								onClick={() => {
									/* Логика выбора файла */
								}}
							>
								<Camera size={20} />
							</button>
						</div>

						<div className='flex flex-col text-center md:text-left flex-1'>
							<div className='flex flex-col md:flex-row md:items-center gap-3 mb-1 justify-center md:justify-start'>
								<h2 className='text-3xl font-bold text-[var(--black)]'>
									{userInfo.last_name} {userInfo.first_name}{' '}
									{userInfo.patronymic || 'Отчество'}
								</h2>
								{/* РОЛЬ: Аккуратный бейдж */}
							</div>
							<div className='inline-flex w-fit items-center justify-center px-3 py-1 rounded-lg bg-[var(--transparent-hero)] text-[var(--hero)] text-xs font-bold uppercase tracking-wider self-center md:self-auto'>
								{roles[userInfo.role]}
							</div>

							<h3 className='text-xl text-[var(--middle)] mb-6'></h3>

							{/* Кнопки управления */}
							<div className='flex flex-wrap gap-3 justify-center md:justify-start'>
								<button
									onClick={() => setIsModalOpen(states[1])}
									className='flex items-center gap-2 px-4 py-2 bg-[var(--white)] border border-[var(--light-middle)] rounded-xl text-sm font-medium hover:bg-[var(--light-middle)] transition-all cursor-pointer'
								>
									<Key size={14} /> Сменить пароль
								</button>
								<button
									onClick={() => {
										/* Редактирование */
									}}
									className='flex items-center gap-2 px-5 py-2 bg-[var(--hero)] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:opacity-90 transition-all cursor-pointer'
								>
									<Edit3 size={14} /> Изменить данные
								</button>
							</div>
						</div>
					</div>

					{/* 2. BODY: Данные (ReadOnly) */}
					<div className='p-8 grid grid-cols-1 lg:grid-cols-12 gap-12'>
						<div className='lg:col-span-8 space-y-8'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* Email на всю ширину */}
								<div className='md:col-span-2'>
									<InputDefault
										title='Электронная почта'
										value={userInfo.email}
										readOnly={true}
									/>
								</div>
								<InputDefault
									title='Фамилия'
									value={userInfo.last_name}
									readOnly={true}
								/>
								<InputDefault
									title='Имя'
									value={userInfo.first_name}
									readOnly={true}
								/>
								<div className='md:col-span-2'>
									<InputDefault
										title='Отчество'
										value={userInfo.patronymic}
										readOnly={true}
									/>
								</div>
							</div>
						</div>

						{/* Боковая панель инфо */}
						<div className='lg:col-span-4'>
							<div className='p-6 rounded-3xl bg-[var(--white-hover)] border border-[var(--light-middle)] space-y-4'>
								<div className='flex items-center gap-3 text-[var(--black)] font-semibold'>
									<ShieldCheck size={20} className='text-[var(--hero)]' />
									Статус аккаунта
								</div>
								<div className='space-y-3'>
									<div className='flex justify-between text-sm'>
										<span className='text-[var(--middle)]'>Тип доступа:</span>
										<span className='font-medium text-[var(--black)]'>
											{formData.role || 'Basic'}
										</span>
									</div>
									<div className='flex justify-between text-sm'>
										<span className='text-[var(--middle)]'>
											ID пользователя:
										</span>
										<span className='font-mono text-[var(--hero)]'>#42910</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 3. FOOTER */}
					<div className='p-8 mt-auto border-t border-[var(--light-middle)] flex flex-col md:flex-row justify-between items-center gap-6'>
						<button
							onClick={() => setIsModalOpen(states[2])}
							className='group flex items-center gap-2 text-[var(--red-base)] font-medium hover:text-[var(--red-hover)] transition-all cursor-pointer'
						>
							<div className='p-2 rounded-lg group-hover:bg-[var(--red-surface)] transition-all'>
								<Trash2 size={20} />
							</div>
							Удалить аккаунт
						</button>

						{mode === 'create' && (
							<DefaultButton
								width='w-full md:w-auto px-10'
								onClick={addNewUser}
							>
								Создать аккаунт
							</DefaultButton>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
export default Profile
