import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import Modal from '../../Atoms/Modal'
import { Show } from '../../Atoms/Show'
import { Text } from '../../Atoms/Text'
import { Loader } from '../../Atoms/Loaders/Loader'
import { ChangeUserRoles, GetUserRoles } from '../../../api/ChangeRoles'

export const SelectRoleModal = ({ isOpen, onClose }) => {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false)
	const [openIndex, setOpenIndex] = useState(null)
	const [userRoles, setUserRoles] = useState({
		roles: [],
		directions: [],
	})

	// Загружаем роли при открытии модалки
	useEffect(() => {
		if (isOpen) {
			fetchUserRoles()
		}
	}, [isOpen])

	const fetchUserRoles = async () => {
		setIsLoading(true)
		try {
			// Added 'await' here
			const data = await GetUserRoles()
			console.log('getRoles: ', data)

			// GetUserRoles already returns res.data, so access roles directly from data
			setUserRoles(data)
		} catch (error) {
			console.error('Ошибка загрузки ролей:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSelectRole = async (name, id) => {
		handleClose()

		try {
			const res = ChangeUserRoles(name, id)

			if (name === 'moderator') {
				navigate('/moderation-courses/')
			} else if (name === 'student') {
				navigate('/catalog/courses')
			} else if (name === 'teacher') {
				navigate('/catalog/courses')
			}

			if (res.data) {
				window.location.reload()
			}
		} catch (error) {
			console.error('Ошибка смены роли:', error)
		}
	}

	const handleClose = () => {
		setOpenIndex(null)
		onClose?.()
	}

	// Формируем структурированный массив ролей
	const roles = (userRoles.roles || [])
		.map(role => {
			if (role.profile_name === 'student') {
				const directions = (userRoles.directions || []).map(dir => ({
					name: dir.group_name,
					id: dir.student_profile_id,
				}))

				return {
					name: 'Студент',
					type: 'student',
					id: directions.length === 1 ? directions[0].id : null,
					directions,
				}
			}
			if (role.profile_name === 'teacher') {
				return {
					name: 'Преподаватель',
					type: 'teacher',
					id: role.profile_id,
				}
			}
			if (role.profile_name === 'moderator') {
				return {
					name: 'Модератор',
					type: 'moderator',
					id: role.profile_id,
				}
			}
			return null
		})
		.filter(Boolean)

	return (
		<Modal width={'w-full max-w-lg'} isOpen={Boolean(isOpen)}>
			<Show when={Boolean(isOpen)}>
				<div className='relative flex flex-col items-center justify-center gap-5 p-2'>
					{/* Кнопка закрытия */}
					<button
						type='button'
						onClick={handleClose}
						className='absolute -top-1 -right-1 p-1 text-[var(--black)] hover:text-red-500 transition-colors cursor-pointer'
					>
						<X size={20} />
					</button>

					{/* Заголовок */}
					<Text size={'xl'} font={'medium'} style={'primary'}>
						Смена роли
					</Text>

					{/* Контент модалки */}
					<Show when={!isLoading} fallback={<Loader />}>
						<div className='flex flex-col items-center gap-3 w-full'>
							{roles.map((item, index) => {
								const hasMultipleDirections =
									item.type === 'student' && item.directions?.length > 1
								const isDropdownOpen = openIndex === index

								if (hasMultipleDirections) {
									return (
										<div key={index} className='w-full relative'>
											<button
												type='button'
												onClick={() =>
													setOpenIndex(isDropdownOpen ? null : index)
												}
												className='relative w-full flex justify-center items-center gap-2 px-4 py-3 font-medium rounded-lg bg-[var(--white)] shadow-[var(--shadow)] hover:bg-[var(--hero)] hover:text-white transition-all cursor-pointer'
											>
												<span>{item.name}</span>
												<ChevronDown
													size={20}
													strokeWidth={2.5}
													className={`transition-transform ${
														isDropdownOpen ? 'rotate-180' : ''
													}`}
												/>
											</button>

											{/* Выпадающий список направлений */}
											<Show when={isDropdownOpen}>
												<div className='flex flex-col absolute top-full left-0 mt-2 z-10 bg-[var(--white)] shadow-[var(--shadow)] text-[var(--black)] rounded-lg w-full overflow-hidden'>
													{item.directions.map((dir, i) => (
														<button
															type='button'
															key={dir.id || i}
															onClick={() =>
																handleSelectRole(item.type, dir.id)
															}
															className='py-2 px-4 text-center hover:bg-[var(--light-gray)] text-[var(--black)] transition-all w-full cursor-pointer'
														>
															{dir.name}
														</button>
													))}
												</div>
											</Show>
										</div>
									)
								}

								return (
									<button
										type='button'
										key={index}
										onClick={() =>
											handleSelectRole(
												item.type,
												item.id || item.directions?.[0]?.id,
											)
										}
										className='w-full rounded-lg bg-[var(--white)] shadow-[var(--shadow)] flex items-center justify-center py-3 font-medium hover:bg-[var(--hero)] hover:text-white transition-all cursor-pointer'
									>
										{item.directions?.length === 1
											? `${item.name} (${item.directions[0].name})`
											: item.name}
									</button>
								)
							})}
						</div>
					</Show>
				</div>
			</Show>
		</Modal>
	)
}
