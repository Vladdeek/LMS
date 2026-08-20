import { Calendar, Clock, Pen, Trash } from 'lucide-react'
import { MEDIA_API_URL } from '../../../API'
import { NavLink } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import { ConfirmModal } from '../Modals/ConfirmModal'
import { useState } from 'react'
import { deleteWebinar } from '../../../api/Webinars'

export const WebinarCard = ({
	img_path,
	id,
	title,
	start,
	end,
	to,
	edit,
	webinarId,
}) => {
	const { role } = useUser()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const now = new Date()
	const startTime = start ? new Date(start) : null
	const endTime = end ? new Date(end) : null

	// Проверка доступности
	const isAvailable = startTime && endTime && now >= startTime && now <= endTime
	const isEnded = endTime && now > endTime
	const isUpcoming = startTime && now < startTime

	// Форматирование даты и времени
	const formatDate = date =>
		date ? new Date(date).toLocaleDateString('ru-RU') : 'Не определена'

	const formatTime = date =>
		date
			? new Date(date).toLocaleTimeString('ru-RU', {
					hour: '2-digit',
					minute: '2-digit',
				})
			: 'Не определено'

	// Конфигурация динамического бэйджа статуса
	const getStatusConfig = () => {
		if (isAvailable) {
			return {
				text: 'Идет сейчас',
				styles: 'text-[var(--green-text)] bg-[var(--green-bg)] animate-pulse',
			}
		}
		if (isUpcoming) {
			return {
				text: 'Запланирован',
				styles: 'text-[var(--yellow-text)] bg-[var(--yellow-bg)]',
			}
		}
		if (isEnded) {
			return {
				text: 'Завершен',
				styles: 'text-[var(--red-text)] bg-[var(--red-bg)]',
			}
		}
		return null
	}

	const status = getStatusConfig()

	// Извлечение изображения
	const imageSrc = img_path
		? img_path.startsWith('http')
			? img_path
			: `${MEDIA_API_URL}${img_path}`
		: '/placeholder-webinar.jpg'

	const DeleteWebinar = async () => {
		try {
			await deleteWebinar(id)
		} catch (err) {}
	}

	return (
		<>
			<ConfirmModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Удаление вебинара'
				text='Точно ли вы хотите удалить видео-конференцию?'
				confirmLabel='Удалить'
				confirmStyle='danger'
				action={() => DeleteWebinar()}
			/>
			<div className='w-full h-full'>
				<div className='flex flex-col h-full w-full rounded-4xl overflow-hidden border border-white/40 bg-white/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12)]'>
					{/* Блок с изображением */}
					<div className='relative w-full h-48 overflow-hidden bg-gray-100 shrink-0'>
						<img
							className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
							src={imageSrc}
							alt={title}
						/>

						{/* Бэйдж статуса */}
						{status && (
							<span
								className={`absolute top-3 right-3 py-1 px-2.5 rounded-lg text-xs font-medium tracking-wide shadow-sm backdrop-blur-sm ${status.styles}`}
							>
								{status.text}
							</span>
						)}
					</div>

					{/* Контентная часть */}
					<div className='flex flex-col flex-1 p-5 justify-between gap-4'>
						<div className='flex flex-col gap-3'>
							<h3 className='font-bold text-xl leading-snug text-[var(--black)] tracking-tight line-clamp-2'>
								{title}
							</h3>

							{/* Временные интервалы */}
							<div className='flex flex-col gap-2 text-sm text-[var(--middle)]'>
								<div className='flex items-center gap-2'>
									<Calendar className='w-4 h-4 text-[var(--hero)] shrink-0' />
									<span>
										Старт:{' '}
										<strong className='font-medium text-[var(--black)]'>
											{formatDate(start)}
										</strong>{' '}
										в {formatTime(start)}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									<Clock className='w-4 h-4 text-[var(--hero)] shrink-0' />
									<span>
										Конец:{' '}
										<strong className='font-medium text-[var(--black)]'>
											{formatDate(end)}
										</strong>{' '}
										в {formatTime(end)}
									</span>
								</div>
							</div>
						</div>

						{/* Панель действий */}
						<div className='pt-3 border-t border-gray-100/60 mt-auto'>
							{role === 'teacher' ? (
								<div className='flex items-center gap-2 w-full'>
									<button
										type='button'
										onClick={edit}
										className='flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-[var(--black)] text-white hover:bg-[var(--hero)] transition-colors cursor-pointer'
									>
										<Pen className='w-4 h-4' />
										<span>Редактировать</span>
									</button>
									<button
										type='button'
										onClick={() => setIsModalOpen(true)}
										className='flex justify-center items-center p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer'
										title='Удалить'
									>
										<Trash className='w-4 h-4' />
									</button>
								</div>
							) : (
								<NavLink
									to={isAvailable ? to : '#'}
									onClick={e => {
										if (!isAvailable) {
											e.preventDefault()
										}
									}}
									className={`w-full flex justify-center items-center py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
										isAvailable
											? 'bg-[var(--black)] text-white hover:bg-[var(--hero)] cursor-pointer shadow-sm'
											: 'bg-gray-100 text-gray-400 cursor-not-allowed'
									}`}
								>
									{isAvailable
										? 'Присоединиться'
										: isUpcoming
											? 'Еще не начался'
											: 'Время истекло'}
								</NavLink>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
