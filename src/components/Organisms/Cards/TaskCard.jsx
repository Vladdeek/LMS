import { LESSON_ICONS } from '../../../Constants/lessonTypes'

export const TaskCard = ({ data, onClick }) => {
	const scoreConfigs = {
		1: {
			title: 'Неудовлетворительно',
			color: 'bg-[var(--red-base)] text-[var(--red-surface)]',
		},
		2: {
			title: 'Неудовлетворительно',
			color: 'bg-[var(--orange-base)] text-[var(--orange-surface)]',
		},
		3: {
			title: 'Удовлетворительно',
			color: 'bg-[var(--yellow-base)] text-[var(--yellow-surface)]',
		},
		4: {
			title: 'Хорошо',
			color: 'bg-[var(--lime-base)] text-[var(--lime-surface)]',
		},
		5: {
			title: 'Отлично',
			color: 'bg-[var(--green-base)] text-[var(--green-surface)]',
		},
	}

	// Проверяем статус проверки
	const isPending = data.grade_status === 'pending'
	const score = !isPending ? scoreConfigs[data.score] : null

	// Безопасно получаем иконку (типы: assignment_type или type для обратной совместимости)
	const iconType = data.assignment_type || data.type
	const IconComponent = LESSON_ICONS[iconType]

	return (
		<div
			onClick={onClick}
			className='p-4 border border-[var(--light-middle)] shadow-[var(--shadow)] rounded-xl cursor-pointer hover:bg-[var(--light-middle)] transition-colors'
		>
			<div className='flex items-center gap-3'>
				{IconComponent}
				<div>
					<h3 className='font-medium'>{data.assignment_name}</h3>
					<span
						className={`text-xs px-2 py-0.5 rounded ${
							score
								? score.color
								: 'bg-[var(--light-middle)] text-[var(--middle)]'
						}`}
					>
						{score ? score.title : 'На проверке'}
					</span>
				</div>
			</div>
		</div>
	)
}
