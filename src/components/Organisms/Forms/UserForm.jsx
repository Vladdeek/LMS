import { useEffect, useState } from 'react'
import { Key, Mail, ShieldCheck, Trash2, User } from 'lucide-react'
import { ConfirmModal } from '../Modals/ConfirmModal'
import { Input } from '../../Molecules/InputFields/Input'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { Text } from '../../Atoms/Text'

export const UserForm = ({ mode, userId, onChange }) => {
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
			confirmStyle: 'peaceful',
			action: () => toSendTheMessageAgainUserById(),
		},
		'generate-new-password': {
			title: 'Новый пароль',
			text: 'Старый пароль перестанет действовать. Сгенерировать новый?',
			confirmLabel: 'Создать',
			confirmStyle: 'peaceful',
			action: () => toSendTheMessageAgainUserById(),
		},
		'delete-user': {
			title: 'Удаление аккаунта',
			text: 'Это действие нельзя отменить. Все данные будут удалены навсегда.',
			confirmLabel: 'Удалить',
			confirmStyle: 'danger',
			action: () => deleteUsersById(),
		},
	}

	return (
		<>
			<ConfirmModal
				title={MODAL_CONFIG.isModalOpen.title}
				text={MODAL_CONFIG.isModalOpen.text}
				confirmLabel={MODAL_CONFIG.isModalOpen.confirmLabel}
				confirmStyle={MODAL_CONFIG.isModalOpen.confirmStyle}
				action={MODAL_CONFIG.isModalOpen.action}
				isOpen={isModalOpen}
				onClose={setIsModalOpen}
			/>
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
								className={`w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all ${mode === 'create' ? 'opacity-40 cursor-not-allowed' : 'text-[var(--red-base)] bg-[var(--red-pale)] hover:text-[var(--red-pale)] hover:bg-[var(--red-base)] hover:scale-101 hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Trash2
									size={16}
									className='text-[var(--red-base)] group-hover:text-[var(--red-pale)] transition-all'
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
									<Input
										title='Электронная почта'
										name='email'
										placeholder='mail@example.com'
										value={formData.email}
										onChange={handleChange}
									/>
								</div>
								<Input
									title='Фамилия'
									name='last_name' // Исправлено
									placeholder='Иванов'
									value={formData.last_name}
									onChange={handleChange}
								/>
								<Input
									title='Имя'
									name='first_name' // Исправлено
									placeholder='Иван'
									value={formData.first_name}
									onChange={handleChange}
								/>
								<div className='md:col-span-2'>
									<Input
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
							<SubmitButton
								className='w-full md:w-auto px-12 py-4'
								onClick={() =>
									mode === 'create' ? addNewUser() : editUserInfo()
								}
							>
								<Text font='semibold'>
									{mode === 'create'
										? 'Создать аккаунт'
										: 'Сохранить изменения'}
								</Text>
							</SubmitButton>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
