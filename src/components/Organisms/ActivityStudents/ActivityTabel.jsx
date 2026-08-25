import { ActivityTableRow } from '../../Molecules/ActivityTabelRow'

export const ActivityTable = ({ students = [] }) => {
	return (
		<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(77.5vh-100px)] overflow-hidden flex flex-col p-2'>
			{/* Header Desktop */}
			<div className='max-lg:hidden w-full flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] text-[var(--black)] h-12 px-4'>
				<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
					<span className='truncate'>ФИО</span>
				</p>
				<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
					<span className='truncate'>Группа</span>
				</p>
				<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
					<span className='truncate'>Занятие</span>
				</p>
				<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
					<span className='truncate'>Время нахождения</span>
				</p>
				<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
					<span className='truncate'>Последняя активность</span>
				</p>
			</div>

			{/* List Content */}
			<div className='flex flex-col p-2 gap-2'>
				{students?.length === 0 ? (
					<p className='text-center text-2xl text-[var(--middle)]'>Пусто</p>
				) : (
					students.map(item => (
						<ActivityTableRow
							key={item.id || `${item.last_name}-${item.end_date}`}
							name={`${item?.last_name} ${item?.first_name?.[0] || ''}. ${
								item?.middle_name?.[0] || ''
							}.`}
							group={item?.group_name}
							lecture={item?.module_section_title}
							activity={item?.session_time}
							last_activity={item?.end_date}
						/>
					))
				)}
			</div>
		</div>
	)
}
