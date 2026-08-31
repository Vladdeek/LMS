import React from 'react'
import { Check, X } from 'lucide-react'

export const ChoiceQuestionCheckView = ({
	options = [],
	studentAnswers = [],
}) => {
	// studentAnswers - массив ID или option_code, выбранных студентом
	return (
		<div className='flex flex-col gap-3 w-full'>
			<p className='text-sm text-[var(--middle)] font-medium text-center'>
				Ответы студента и правильные варианты
			</p>
			{options.map(option => {
				const isSelectedByStudent =
					studentAnswers.includes(option.id) ||
					studentAnswers.includes(option.option_code)
				const isCorrectOption = option.correct

				let borderStyle = 'border-transparent bg-gray-50'
				let statusBadge = null

				if (isSelectedByStudent && isCorrectOption) {
					// Студент ответил верно
					borderStyle =
						'border-[var(--correct-lvl)] bg-green-50 text-[var(--black)]'
					statusBadge = (
						<span className='flex items-center gap-1 text-xs font-semibold text-[var(--correct-lvl)]'>
							<Check className='w-4 h-4' /> Верный выбор
						</span>
					)
				} else if (isSelectedByStudent && !isCorrectOption) {
					// Студент ошибся
					borderStyle =
						'border-[var(--not-correct-lvl)] bg-red-50 text-[var(--black)]'
					statusBadge = (
						<span className='flex items-center gap-1 text-xs font-semibold text-[var(--not-correct-lvl)]'>
							<X className='w-4 h-4' /> Ошибка студента
						</span>
					)
				} else if (!isSelectedByStudent && isCorrectOption) {
					// Правильный ответ, который студент пропустил
					borderStyle = 'border-dashed border-green-400 bg-white'
					statusBadge = (
						<span className='text-xs font-medium text-gray-500'>
							(Эталонный ответ)
						</span>
					)
				}

				return (
					<div
						key={option.id}
						className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${borderStyle}`}
					>
						<span className='text-sm sm:text-base font-medium'>
							{option.name}
						</span>
						{statusBadge}
					</div>
				)
			})}
		</div>
	)
}
