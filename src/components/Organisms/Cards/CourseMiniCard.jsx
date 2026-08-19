import { ImageOff, RussianRuble } from 'lucide-react'

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
