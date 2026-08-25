import { formatDateTime, formatDuration } from '../../utils/formatters'

export const ActivityTableRow = ({
	name,
	group,
	lecture,
	activity,
	last_activity,
}) => {
	return (
		<>
			{/* Desktop View */}
			<div className='max-lg:hidden w-full text-[var(--black)] flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] h-10 px-4'>
				<p className='w-1/4 h-full flex items-center justify-center'>{name}</p>
				<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
					{group}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center'>
					{lecture}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
					{formatDuration(activity)}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center'>
					{formatDateTime(last_activity)}
				</p>
			</div>

			{/* Mobile View */}
			<div className='min-lg:hidden w-full rounded-lg shadow-[var(--shadow)] p-4 flex justify-between items-start transition-transform transform hover:scale-105 hover:shadow-2xl'>
				<div className='flex flex-col gap-1'>
					<p className='font-semibold text-lg text-[var(--black)]'>
						{name}{' '}
						<span className='font-normal text-[var(--middle)]'>({group})</span>
					</p>
					<p className='text-[var(--middle)] font-medium text-sm'>
						Занятие: {lecture}
					</p>
				</div>

				<div className='flex flex-col items-end gap-1'>
					<p className='font-medium text-[var(--black)] flex items-center'>
						Активность:
						<span className='ml-1 font-semibold bg-[var(--green-status-bg)] text-[var(--green-status-text)] px-2 rounded-md whitespace-nowrap'>
							{formatDuration(activity)}
						</span>
					</p>
					<p className='text-[var(--middle)] text-sm'>
						{formatDateTime(last_activity)}
					</p>
				</div>
			</div>
		</>
	)
}
