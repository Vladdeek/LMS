export const QuestionResultCard = ({
	id,
	question,
	correctAnswers,
	studentAnswers,
	status,
}) => {
	// Выносим цвет для градиента в зависимости от статуса
	const statusColors = {
		correct: {
			color: 'var(--green-base)',
			icon: <Check strokeWidth={3.5} size={256} />,
		},
		uncorrect: {
			color: 'var(--red-base)',
			icon: <X strokeWidth={3.5} size={256} />,
		},
		middle: {
			color: 'var(--yellow-base)',
			icon: <Check strokeWidth={3.5} size={256} />,
		},
		default: {
			color: 'var(--light-middle)',
			icon: <X strokeWidth={3.5} size={256} />,
		},
	}

	const primaryScoreColor = statusColors[status].color || statusColors.default
	const primaryScoreIcon =
		statusColors[status].icon || statusColors.default.icon

	const formatAnswers = arr =>
		Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : 'Нет ответа'

	return (
		<div
			className={`w-full relative overflow-hidden bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl p-4 flex gap-3 items-center transition-all border-l-8`}
			style={{ borderColor: primaryScoreColor }}
		>
			<p
				className='text-center text-8xl pr-2 font-black tracking-tighter'
				style={{
					color: `${primaryScoreColor}`,
				}}
			>
				{id}
			</p>

			{/* Контент */}
			<div className='flex flex-col gap-3 flex-grow '>
				<p className='text-md font-semibold text-[var(--black)]'>
					{question || 'Вопрос без текста'}
				</p>

				<div className='flex flex-col gap-1 bg-[var(--light-middle)]/25 p-3 z-10 backdrop-blur-sm rounded-xl'>
					<p className='text-sm text-[var(--middle)]'>
						{correctAnswers?.length > 1
							? 'Правильные ответы:'
							: 'Правильный ответ:'}
						<span className='font-semibold ml-1 text-[var(--black)]'>
							{formatAnswers(correctAnswers)}
						</span>
					</p>
					<p className='text-sm text-[var(--middle)]'>
						{studentAnswers?.length > 1 ? 'Ваши ответы:' : 'Ваш ответ:'}
						<span
							className='font-semibold ml-1'
							style={{ color: primaryScoreColor }}
						>
							{formatAnswers(studentAnswers)}
						</span>
					</p>
				</div>
			</div>
			{primaryScoreIcon && (
				<div
					className='absolute -bottom-20 right-2 opacity-75 z-1'
					style={{ color: primaryScoreColor }}
				>
					{primaryScoreIcon}
				</div>
			)}
		</div>
	)
}
