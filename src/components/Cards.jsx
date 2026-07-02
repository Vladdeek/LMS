import { ImageOff, RussianRuble } from 'lucide-react'
import { data } from 'react-router-dom'

const CourseCard = ({ data, onClick, status }) => {
	console.log(data)
	// Функция для красивого форматирования дат
	const formatDate = dateStr => {
		return new Date(dateStr).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
		})
	}
	const statuses = {
		draft: {
			title: 'В разработке',
			color: 'text-[var(--yellow-base)] border-[var(--yellow-base)]',
		},
		pending_review: {
			title: 'На модерации',
			color: 'text-[var(--hero)] border-[var(--hero)]',
		},
		approved: {
			title: 'Опубликован',
			color: 'text-[var(--green-base)] border-[var(--green-base)]',
		},
		rejected: {
			title: 'Доработка',
			color: 'text-[var(--yellow-base)] border-[var(--yellow-base)]',
		},
		rejected_preview: {
			title: 'Отклонен',
			color: 'text-[var(--red-base)] border-[var(--red-base)]',
		},
	}

	return (
		<div
			onClick={onClick}
			className='flex flex-col bg-[var(--white)] h-full w-full p-3 rounded-4xl shadow-lg cursor-pointer transition-all hover:scale-[101.5%] hover:shadow-md'
		>
			<img
				className='rounded-3xl aspect-[16/9] object-cover w-full'
				src={data?.preview_url}
				alt={''}
			/>
			<div className='flex flex-col h-full p-3 mt-3 gap-3'>
				{/* Секция Тега и Заголовка */}
				<div className='flex flex-col gap-3'>
					<p
						className='text-2xl font-medium text-[var(--black)]'
						title={data.name}
					>
						{data.name}
					</p>
					{/* Рендерим тег, если он пришел с бэка */}
					{data.tag && (
						<p className='flex items-center text-sm font-normal border border-[var(--hero)] w-fit px-4 py-1 rounded-full text-[var(--hero)] opacity-80 group-hover:opacity-100 transition-opacity'>
							{data.tag}
						</p>
					)}
					<p
						className='text-sm font-normal text-[var(--middle)] line-clamp-2'
						title={data.description}
					>
						{data.description}
					</p>
				</div>

				{/* Характеристики курса */}
				<div className='grid grid-cols-2 gap-y-3 text-sm border-y border-[var(--light-middle)] py-4'>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)]'>Формат</span>
						<span className='font-medium text-[var(--black)]'>
							{data.format_name}
						</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)] '>Сертификат</span>
						<span
							className='font-medium truncate text-[var(--black)]'
							title={data.certificate_type_name}
						>
							{data.certificate_type_name}
						</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)]'>Старт курса</span>
						<span className='font-medium text-[var(--black)]'>
							{formatDate(data.start_date)}
						</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)] text-orange-500'>
							Регистрация до
						</span>
						<span className='font-medium text-orange-600'>
							{formatDate(data.registration_end)}
						</span>
					</div>
				</div>

				{/* Цена и Автор */}
				<div className='flex justify-between items-end mt-2'>
					<div className='flex gap-3 items-center'>
						{data.creator?.avatar_url ? (
							<img
								className='rounded-xl aspect-square object-cover w-12 bg-gray-100'
								src={data.creator?.avatar_url}
								alt='author'
							/>
						) : (
							<ImageOff className='rounded-xl aspect-square object-cover w-12 h-auto p-3 text-[var(--middle)] bg-gray-100' />
						)}

						<div className='flex flex-col'>
							<p className='text-md font-medium leading-tight text-[var(--black)]'>
								{`${data?.creator?.first_name || ''} ${data?.creator?.last_name ? `${data.creator.last_name[0]}.` : ''}${data?.creator?.patronymic ? ` ${data.creator.patronymic[0]}.` : ''}`}
							</p>
							<p className='text-xs font-normal text-[var(--middle)]'>
								Автор курса
							</p>
						</div>
					</div>

					<div className='text-right'>
						<p className='text-2xl flex gap-1 items-center font-medium text-[var(--hero)]'>
							{data.is_free ? 'Бесплатно' : `${data.price.toLocaleString()}`}
							{!data.is_free && <RussianRuble size={18} strokeWidth={3} />}
						</p>
					</div>
				</div>
				{status && (
					<div className='flex'>
						<p
							className={`flex items-center text-sm font-normal border w-fit px-4 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity ${statuses[status]?.color}`}
						>
							{statuses[status]?.title}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export const CourseMiniCard = ({ data, onClick }) => {
	const formatDate = dateStr => {
		return new Date(dateStr).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
		})
	}

	return (
		<div
			onClick={onClick}
			className='flex gap-4 bg-[var(--white)] p-2 rounded-3xl shadow-[var(--shadow)] border border-[var(--light-middle)] transition-all cursor-pointer group items-center'
		>
			<div className='relative shrink-0'>
				<img
					className='rounded-2xl w-28 h-28 object-cover'
					src={data.preview_url}
					alt={data.name}
				/>
				{data.student_request_count
					? data.student_request_count && (
							<span className='absolute -top-2 -left-2 bg-[var(--hero)] text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm'>
								Заявок: {data.student_request_count}
							</span>
						)
					: data.tag && (
							<span className='absolute -top-2 -left-2 bg-[var(--hero)] text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm'>
								{data.tag}
							</span>
						)}
				{}
			</div>

			<div className='flex flex-col flex-1 h-full min-w-0 justify-between'>
				<div>
					<div className='flex justify-between items-start gap-2'>
						<p
							className='text-lg font-bold h-12 text-[var(--black)]'
							title={data.name}
						>
							{data.name}
						</p>
					</div>
				</div>

				<div className='flex justify-between items-center mt-3 pt-2 border-t border-[var(--light-middle)]/50'>
					<div className='flex gap-3 items-center'>
						{data.creator?.avatar_url ? (
							<img
								className='rounded-lg w-6 h-6 object-cover bg-gray-100'
								src={data.creator?.avatar_url}
								alt='author'
							/>
						) : (
							<ImageOff className='w-6 h-6 p-1 text-[var(--middle)] bg-gray-100 rounded-lg' />
						)}
						<p className='text-xs text-[var(--middle)] truncate'>
							{data?.creator?.first_name} {data?.creator?.last_name[0]}.{' '}
						</p>
					</div>

					<div className='flex items-center gap-0.5 text-[var(--hero)] font-semibold'>
						<span className='text-md'>
							{data.is_free
								? 'Бесплатно'
								: Math.round(data.price).toLocaleString()}
						</span>
						{!data.is_free && <RussianRuble size={14} strokeWidth={3.5} />}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CourseCard
