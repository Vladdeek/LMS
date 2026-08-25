import { NavLink } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import { MEDIA_API_URL } from '../../../API'

export const CourseCard = ({ courseInfo }) => {
	const { role } = useUser()

	// Деструктуризируем все необходимые данные из пропса courseInfo
	const {
		name,
		description,
		course_status,
		semester,
		study_level,
		course,
		image_url,
		study_year,
		created_from_load,
	} = courseInfo

	// Настройки статусов публикации
	const statusConfig = {
		approved: {
			text: 'Опубликован',
			styles: 'text-[var(--green-text)] bg-[var(--green-bg)]',
		},
		in_development: {
			text: 'Не опубликован',
			styles: 'text-[var(--red-text)] bg-[var(--red-bg)]',
		},
		pending: {
			text: 'На рассмотрении',
			styles: 'text-[var(--yellow-text)] bg-[var(--yellow-bg)]',
		},
	}

	const currentStatus = statusConfig[course_status]

	return (
		<div className='w-full h-full'>
			<NavLink
				to={`/course/${courseInfo.id}`}
				className='flex flex-col h-full w-full rounded-4xl overflow-hidden border border-white/40 bg-white/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12)] cursor-pointer'
			>
				{/* Блок с изображением */}
				<div className='relative w-full h-[45%] overflow-hidden bg-gray-100'>
					<img
						className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
						src={`${MEDIA_API_URL}${image_url}`}
						alt={name}
					/>

					{/* Статус отображается только для преподавателя или модератора */}
					{(role === 'teacher' || role === 'moderator') && currentStatus && (
						<span
							className={`absolute top-3 right-3 py-1 px-2.5 rounded-lg text-xs font-medium tracking-wide shadow-sm backdrop-blur-sm ${currentStatus.styles}`}
						>
							{currentStatus.text}
						</span>
					)}
				</div>

				{/* Контентная часть */}
				<div className='flex flex-col flex-1 p-5 justify-between'>
					<div className='flex flex-col gap-2'>
						<h3 className='font-bold text-xl leading-snug text-[var(--black)] tracking-tight line-clamp-2'>
							{name}
						</h3>
						<p className='text-sm leading-relaxed text-[var(--middle)] line-clamp-3'>
							{description}
						</p>
					</div>

					<div className='flex gap-2 flex-wrap mt-4 pt-4 text-sm border-t border-gray-100/60'>
						{(course || study_level) && (
							<span className='py-1 px-2.5 rounded-lg  font-medium text-[var(--hero)] bg-[var(--hero-pale)]'>
								{`${course && `${course}-й курс`} ${study_level !== 'undefined' ? `• ${study_level}` : ''}`}
							</span>
						)}

						{semester && (
							<span className='py-1 px-2.5 rounded-lg font-medium text-[var(--hero)] bg-[var(--hero-pale)]'>
								{`${semester}-й семестр`}
							</span>
						)}

						{study_year && (
							<span className='py-1 px-2.5 rounded-lg font-medium text-[var(--hero)] bg-[var(--hero-pale)]'>
								{study_year}
							</span>
						)}

						{created_from_load && (
							<span className='py-1 px-2.5 rounded-lg font-medium text-blue-600 bg-blue-50'>
								Из нагрузки
							</span>
						)}
					</div>
				</div>
			</NavLink>
		</div>
	)
}
