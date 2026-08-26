import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronLeft, User } from 'lucide-react'

import Modal from '../../Atoms/Modal'
import { Loader } from '../../Atoms/Loaders/Loader'
import { Show } from '../../Atoms/Show'
import { MEDIA_API_URL } from '../../../API'
import {
	getStudentAttendanceOnWebinar,
	getWebinars,
} from '../../../api/Webinars'
import { Text } from '../../Atoms/Text'

export const WebinarHistory = ({ isOpen, onClose }) => {
	const [isOpenWarning, setIsOpenWarning] = useState(false)
	const [webinars, setWebinars] = useState([])
	const [students, setStudents] = useState([])
	const [activeWebinar, setActiveWebinar] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	console.log(webinars)

	useEffect(() => {
		if (!isOpen) return

		const fetchWebinars = async () => {
			setIsLoading(true)
			try {
				const res = await getWebinars('closed')
				setWebinars(res)
			} catch (error) {
				console.error('Ошибка при загрузке вебинаров:', error)
			} finally {
				setIsLoading(false)
			}
		}

		const fetchStudents = async () => {
			setIsLoading(true)
			try {
				const res = await getStudentAttendanceOnWebinar(activeWebinar)
				setStudents(res.data || [])
			} catch (error) {
				console.error('Ошибка при загрузке посещаемости:', error)
			} finally {
				setIsLoading(false)
			}
		}

		if (activeWebinar === null) {
			fetchWebinars()
		} else {
			fetchStudents()
		}
	}, [isOpen, activeWebinar])

	const cardMotion = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
		transition: { duration: 0.2, ease: 'easeOut' },
	}

	return (
		<Modal width='w-200' isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-5 p-2'>
				<h2 className='text-2xl font-medium text-[var(--black)] text-center'>
					История видео-конференций
				</h2>

				{/* Предупреждение */}
				<div
					onClick={() => setIsOpenWarning(prev => !prev)}
					className='border-dashed border-2 border-[var(--hero)] flex flex-col font-medium text-[var(--hero)] bg-[var(--hero-pale)] p-3 rounded-2xl cursor-pointer transition-all'
				>
					<span className='text-center text-xl'>Предупреждение!</span>
					<span
						className={`text-start text-sm font-normal overflow-hidden transition-all duration-300 ease-in-out ${
							isOpenWarning ? 'max-h-120 opacity-100 mt-2' : 'max-h-0 opacity-0'
						}`}
					>
						Посещение видео-конференции фиксируется только если студент заходит
						на неё по ссылке из СДО МелГУ. Если вход выполнен через сторонний
						сервис или по ссылке, отправленной в чате, посещение не может быть
						учтено, так как у СДО нет интеграций со стриминговыми платформами и
						доступа к их данным. Учёт посещаемости носит ориентировочный
						характер и позволяет лишь примерно определить, кто присутствовал на
						вебинаре.
					</span>
					<div
						className={`w-full flex justify-center mt-1 ${
							isOpenWarning ? 'rotate-180' : ''
						} transition-transform`}
					>
						<ChevronDown />
					</div>
				</div>

				{/* Заголовок списка */}
				<div className='text-[var(--black)] text-xl font-normal'>
					{activeWebinar ? (
						<div className='grid grid-cols-3 items-center'>
							<button
								type='button'
								onClick={() => setActiveWebinar(null)}
								className='flex justify-start hover:scale-110 transition-transform cursor-pointer w-fit'
							>
								<ChevronLeft size={32} />
							</button>
							<p className='text-center font-medium'>Список посещений</p>
						</div>
					) : (
						<p className='text-center font-medium'>Список видео-конференций</p>
					)}
				</div>

				{/* Уменьшенная зона со скроллом и лоадером */}
				<div className='h-[35vh] bg-[var(--light-middle)] rounded-3xl overflow-y-auto hide-scrollbar flex flex-col gap-3 p-2 relative'>
					{webinars.length !== 0 ? (
						<AnimatePresence mode='wait'>
							{activeWebinar ? (
								<motion.div
									key='students'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className='flex flex-col gap-3'
								>
									{students.map(item => (
										<motion.div
											key={item.id}
											{...cardMotion}
											className='flex gap-3 p-3 rounded-2xl shadow-[var(--shadow)] items-center bg-[var(--white)]'
										>
											{item?.avatar_url ? (
												<img
													className='h-16 w-16 object-cover rounded-xl shrink-0'
													src={`${FILE_API}${item.avatar_url}`}
													alt=''
												/>
											) : (
												<div className='h-16 w-16 flex items-center justify-center bg-[var(--light-gray)] rounded-xl text-[var(--middle)] p-2 shrink-0'>
													<User className='w-full h-full' />
												</div>
											)}

											<div className='flex justify-between w-full items-center'>
												<div className='flex flex-col gap-1'>
													<p className='text-[var(--black)] text-lg font-medium'>
														{item?.first_name}{' '}
														{item?.last_name?.[0]
															? `${item.last_name[0]}.`
															: ''}{' '}
														{item?.middle_name?.[0]
															? `${item.middle_name[0]}.`
															: ''}
													</p>
													<p className='text-[var(--middle)] text-sm font-medium'>
														{item?.group_name}
													</p>
												</div>

												<p className='text-[var(--middle)] text-sm font-light'>
													{item?.attendance_date
														? new Date(item.attendance_date).toLocaleString(
																'ru-RU',
																{
																	day: 'numeric',
																	month: 'short',
																	year: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																},
															)
														: '—'}
												</p>
											</div>
										</motion.div>
									))}
								</motion.div>
							) : (
								<motion.div
									key='webinars'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className='flex flex-col gap-3'
								>
									{webinars.map(item => {
										console.log('item', item)
										return (
											<motion.div
												key={item.id}
												{...cardMotion}
												onClick={() => setActiveWebinar(item.id)}
												className='flex gap-3 p-3 rounded-2xl shadow-[var(--shadow)] ring-[var(--hero)] hover:ring-1 hover:shadow-[var(--hero-shadow)] cursor-pointer group items-center bg-[var(--white)]'
											>
												<img
													className='h-16 w-16 object-cover rounded-xl group-hover:scale-105 transition shrink-0'
													src={`${MEDIA_API_URL}${item?.image_url}`}
													alt=''
												/>

												<div className='flex justify-between w-full items-center'>
													<p className='text-[var(--black)] text-lg font-medium'>
														{item?.name}
													</p>

													<div className='flex flex-col items-end gap-1'>
														<p
															className={`${
																item?.students_attended === 0
																	? 'text-[var(--red-status-text)]'
																	: 'text-[var(--green-status-text)]'
															} text-base font-medium`}
														>
															{item?.students_attended} посещений
														</p>
														<p className='text-[var(--middle)] text-sm font-light'>
															{item?.end_date
																? new Date(item.end_date).toLocaleString(
																		'ru-RU',
																		{
																			day: 'numeric',
																			month: 'short',
																			year: 'numeric',
																			hour: '2-digit',
																			minute: '2-digit',
																		},
																	)
																: '—'}
														</p>
													</div>
												</div>
											</motion.div>
										)
									})}
								</motion.div>
							)}
						</AnimatePresence>
					) : (
						<div className='h-full w-full flex items-center justify-center'>
							<Text size={'xl'} style={'secondary'}>
								Пусто
							</Text>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}
