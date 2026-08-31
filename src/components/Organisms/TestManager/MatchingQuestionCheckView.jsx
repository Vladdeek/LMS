import React from 'react'

export const MatchingQuestionCheckView = ({
	leftOptions = [],
	rightOptions = [],
	studentPairs = [], // Массив пар студента [[leftId, rightId], ...]
	correctPairs = [], // Эталонные пары [[leftId, rightId], ...]
}) => {
	const getRightOption = id =>
		rightOptions.find(r => String(r.id) === String(id))

	return (
		<div className='flex flex-col gap-4 w-full'>
			<p className='text-sm text-[var(--middle)] font-medium text-center'>
				Результаты сопоставления пар
			</p>
			<div className='flex flex-col gap-3 w-full'>
				{leftOptions.map(left => {
					// Находим, что связал студент
					const studentPair = studentPairs.find(
						p => String(p[0]) === String(left.id),
					)
					const studentRightId = studentPair ? studentPair[1] : null
					const studentRight = getRightOption(studentRightId)

					// Находим эталон
					const correctPair = correctPairs.find(
						p => String(p[0]) === String(left.id),
					)
					const correctRightId = correctPair ? correctPair[1] : null
					const correctRight = getRightOption(correctRightId)

					const isPairCorrect =
						studentRightId && String(studentRightId) === String(correctRightId)

					return (
						<div
							key={left.id}
							className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row gap-3 items-center justify-between ${
								isPairCorrect
									? 'border-[var(--correct-lvl)] bg-green-50'
									: 'border-[var(--not-correct-lvl)] bg-red-50'
							}`}
						>
							<div className='font-medium text-sm text-[var(--black)] w-full md:w-1/3'>
								{left.name}
							</div>
							<div className='text-xs text-gray-400 font-bold'>➔</div>
							<div className='flex flex-col w-full md:w-1/2 gap-1'>
								<div className='text-sm font-semibold'>
									Ответ:{' '}
									{studentRight ? (
										studentRight.name
									) : (
										<span className='italic text-gray-400'>Нет ответа</span>
									)}
								</div>
								{!isPairCorrect && correctRight && (
									<div className='text-xs text-gray-500'>
										Должно быть:{' '}
										<span className='font-medium text-gray-700'>
											{correctRight.name}
										</span>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
