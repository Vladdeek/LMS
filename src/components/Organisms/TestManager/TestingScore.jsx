import { QuestionResultCard } from '../Cards/QuestionResultCard'

export const TestingScore = ({ score = 0, testResults = [] }) => {
	const scoreConfigs = {
		1: {
			val: 1,
			title: 'Неудовлетворительно',
			color: 'bg-[var(--red-base)] text-[var(--red-pale)]',
		},
		2: {
			val: 2,
			title: 'Неудовлетворительно',
			color: 'bg-[var(--orange-base)] text-[var(--orange-pale)]',
		},
		3: {
			val: 3,
			title: 'Удовлетворительно',
			color: 'bg-[var(--yellow-base)] text-[var(--yellow-pale)]',
		},
		4: {
			val: 4,
			title: 'Хорошо',
			color: 'bg-[var(--lime-base)] text-[var(--lime-pale)]',
		},
		5: {
			val: 5,
			title: 'Отлично',
			color: 'bg-[var(--green-base)] text-[var(--green-pale)]',
		},
	}

	const numericScore = Number(score) || 0
	const roundedScore = Math.min(Math.max(Math.round(numericScore), 1), 5)
	const scoreTitle = scoreConfigs[roundedScore]?.title || 'Неизвестно'
	const exactScore = numericScore.toFixed(2)

	const getScoreColor = scoreValue => {
		const config = scoreConfigs[scoreValue]
		if (config) {
			const match = config.color.match(/--(.*?)-base/)
			if (match) return `var(--${match[1]}-base)`
		}
		return 'var(--middle)'
	}

	const getColorPercentage = totalScore => {
		const remainder = totalScore - Math.floor(totalScore)
		return (1 - remainder) * 100
	}

	const getGrayPercentage = (index, totalScore) => {
		if (index < Math.floor(totalScore)) return 0
		if (index === Math.floor(totalScore)) return getColorPercentage(totalScore)
		return 100
	}

	const primaryScoreColor = getScoreColor(roundedScore)

	return (
		<div className='w-full p-8 grid grid-cols-3 gap-10'>
			<div className='col-span-3 flex items-center justify-center text-4xl font-semibold text-[var(--black)]'>
				<p>Результаты тестирования</p>
			</div>

			<div className='w-full flex flex-col col-span-1 items-center justify-start gap-10'>
				<div className='flex flex-col items-center gap-2 p-6 bg-[var(--light-middle)]/25 rounded-3xl w-full'>
					<p
						className='text-center text-9xl font-extrabold leading-none tracking-tight'
						style={{
							color: primaryScoreColor,
							backgroundImage: `linear-gradient(135deg, ${primaryScoreColor} 25%, var(--light-middle) 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						{roundedScore}
					</p>
					<p className='text-center text-md font-light text-[var(--middle)]/75'>
						Подробная оценка: {exactScore}
					</p>
					<p className='text-center text-4xl font-semibold text-[var(--middle)]'>
						{scoreTitle}
					</p>
				</div>

				<div className='flex flex-col gap-6 w-full max-w-lg'>
					<div className='grid grid-cols-5 gap-3'>
						{Object.values(scoreConfigs).map((item, i) => {
							const grayPercent = getGrayPercentage(i, numericScore)
							return (
								<div
									key={item.val}
									className='relative flex flex-col gap-1 items-center'
								>
									<div
										className={`relative flex items-center justify-center w-full h-12 rounded-2xl ${item.color}`}
									>
										<span className='text-2xl font-bold'>{item.val}</span>
										<div
											className='absolute h-full right-0 backdrop-grayscale-90'
											style={{ width: `${grayPercent}%` }}
										/>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			<div className='col-span-2 bg-[var(--light-middle)]/25 rounded-3xl p-4 pb-0 flex flex-col gap-4 max-h-[calc(90vh-20rem)]'>
				<p className='text-center text-2xl font-semibold text-[var(--black)]'>
					Ваши ответы на вопросы
				</p>
				<div className='w-full bg-[var(--light-middle)]/25 rounded-3xl h-fit flex flex-col gap-3 overflow-y-auto p-2 pr-4'>
					<div className='flex flex-col gap-4'>
						{testResults.map((item, idx) => (
							<QuestionResultCard
								key={item.id || idx}
								id={idx + 1}
								question={item.question}
								correctAnswers={item.correctAnswers || item.correct_answers}
								studentAnswers={item.studentAnswers || item.student_answers}
								status={item.status}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
