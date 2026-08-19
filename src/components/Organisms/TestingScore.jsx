export const TestingScore = ({ score = 4.1, min = 1, max = 5 }) => {
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

	const roundedScore = Math.round(score)
	const floorScore = Math.floor(score)
	const scoreTitle = scoreConfigs[roundedScore]
		? scoreConfigs[roundedScore].title
		: 'Неизвестно'
	const exactScore = score.toFixed(2)

	const getScoreColor = scoreValue => {
		const config = scoreConfigs[scoreValue]
		if (config) {
			// Here we extract only the color, for example 'bg-[var(--red-base)]' -> 'red'
			const colorName = config.color.match(/--(.*?)-base/)[1]
			return `var(--${colorName}-base)`
		}
		return 'var(--middle)' // Default color
	}

	// Логика расчета процента
	const getColorPercentage = totalScore => {
		const remainder = totalScore - Math.floor(totalScore)
		return (1 - remainder) * 100
	}
	const getGrayPercentage = (index, totalScore) => {
		// 1. Карточки до текущей (полностью цветные)
		if (index < Math.floor(totalScore)) return 0

		// 2. Карточка, на которой находится "срез"
		if (index === Math.floor(totalScore)) {
			return getColorPercentage(totalScore)
		}

		// 3. Карточки после среза (полностью серые)
		return 100
	}

	const primaryScoreColor = getScoreColor(roundedScore)

	const testResults = [
		{
			id: 1,
			question: 'Какой цвет получается при смешивании синего и желтого?',
			correctAnswers: ['Зеленый'],
			studentAnswers: ['Зеленый'],
			status: 'correct',
		},
		{
			id: 2,
			question: 'Выберите все языки программирования высокого уровня:',
			correctAnswers: ['Python', 'JavaScript', 'C++'],
			studentAnswers: ['Python', 'PHP'],
			status: 'middle',
		},
		{
			id: 3,
			question: 'Столица Франции — это...',
			correctAnswers: ['Париж'],
			studentAnswers: ['Берлин'],
			status: 'uncorrect',
		},
	]

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
							const grayPercent = getGrayPercentage(i, score)

							return (
								<div
									key={item.val}
									className='relative flex flex-col gap-1 items-center'
								>
									<div
										className={`relative flex items-center justify-center w-full h-12 rounded-2xl ${item.color} `}
									>
										<span className={`text-2xl font-bold `}>{item.val}</span>

										<div
											className='absolute h-full right-0 backdrop-grayscale-90'
											style={{
												width: `${grayPercent}%`,
											}}
										/>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			<div
				className={`col-span-2 bg-[var(--light-middle)]/25 rounded-3xl p-4 pb-0 flex flex-col  gap-4 max-h-[calc(90vh-20rem)]`}
			>
				<p className='text-center text-2xl font-semibold text-[var(--black)]'>
					Ваши ответы на вопросы
				</p>
				<div className='w-full bg-[var(--light-middle)]/25 rounded-3xl h-fit flex flex-col gap-3 overflow-y-auto p-2 pr-4'>
					<div className='flex flex-col gap-4'>
						{testResults.map((item, idx) => (
							<QuestionResultCard
								key={idx}
								id={idx + 1}
								question={item.question}
								correctAnswers={item.correctAnswers}
								studentAnswers={item.studentAnswers}
								status={item.status}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
