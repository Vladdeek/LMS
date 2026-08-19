import { Pen, Trash } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export const WebinarCard = ({
	img_path,
	title,
	start,
	end,
	to,
	edit,
	del,
	webinarId,
}) => {
	const now = new Date()
	const startTime = start ? new Date(start) : null
	const endTime = end ? new Date(end) : null

	const isAvailable =
		startTime && endTime && isAfter(now, startTime) && isBefore(now, endTime)

	const location = useLocation()

	// const studentAttendance = async () => {
	// 	try {
	// 		const res = await api.post(
	// 			`${API}/webinar/${webinarId}/student/attendance`,
	// 			{
	// 				withCredentials: true,
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 				},
	// 			},
	// 		)
	// 	} catch (error) {}
	// }

	return (
		<div className='aspect-9/16 w-full p-[10px] rounded-xl flex flex-col justify-between shadow-[var(--shadow)] bg-[var(--white)] transition-all cursor-pointer'>
			<div className='inline-flex flex-col'>
				<img
					className='aspect-square h-auto w-full rounded-md object-cover'
					src={img_path}
					alt=''
				/>

				<p className={`font-bold text-[20px] mt-3 text-[var(--black)]`}>
					{title}
				</p>
				<p className='text-[var(--middle)] text-sm font-normal mb-[10px]'>
					Начало видео-конференции: <br />
					Дата -{' '}
					<span className='font-medium'>
						{start
							? new Date(startTime).toLocaleDateString('ru-RU')
							: 'Не определен'}
					</span>
					{'  '}
					Время -{' '}
					<span className='font-medium'>
						{start
							? new Date(startTime).toLocaleTimeString('ru-RU', {
									hour: '2-digit',
									minute: '2-digit',
								})
							: 'Не определен'}
					</span>
				</p>
				<p className='text-[var(--middle)] text-sm font-normal mb-[10px]'>
					Окончание видео-конференции: <br />
					Дата -{' '}
					<span className='font-medium'>
						{end
							? new Date(endTime).toLocaleDateString('ru-RU')
							: 'Не определен'}
					</span>
					{'  '}
					Время -{' '}
					<span className='font-medium'>
						{end
							? new Date(endTime).toLocaleTimeString('ru-RU', {
									hour: '2-digit',
									minute: '2-digit',
								})
							: 'Не определен'}
					</span>
				</p>
			</div>

			{location.pathname === '/catalogt/webinars' ? (
				<div className='w-full flex gap-1'>
					<button
						className={` flex justify-center items-center gap-1 p-2 w-full rounded-lg transition-all bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hero)] hover:text-white cursor-pointer `}
						onClick={edit}
					>
						<Pen className='p-0.5' />
						<p className='pt-1'>Редактировать</p>
					</button>
					<button
						className={` flex justify-center items-center p-2 rounded-lg transition-all bg-[var(--black)] text-[var(--white)] hover:bg-red-600 hover:text-white cursor-pointer `}
						onClick={del}
					>
						<Trash />
					</button>
				</div>
			) : (
				<NavLink
					to={isAvailable ? to : '#'}
					className={`flex justify-center items-center p-2 rounded-lg transition-all ${
						isAvailable
							? 'bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hero)] hover:text-white cursor-pointer'
							: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
					}`}
					onClick={e => {
						if (!isAvailable) {
							e.preventDefault()
						} else {
							studentAttendance()
						}
					}}
				>
					{isAvailable ? 'Присоединиться' : 'Время истекло'}
				</NavLink>
			)}
		</div>
	)
}
