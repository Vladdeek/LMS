import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { ButtonCase } from '../../Atoms/Buttons/ButtonCase'

export const OpenQuestionCheckView = ({
	studentAnswer,
	score,
	maxScore,
	onGrade,
}) => {
	return (
		<div className='flex flex-col gap-5 w-full max-w-2xl'>
			<div className='flex flex-col gap-2'>
				<label className='text-sm font-medium text-[var(--middle)]'>
					Ответ студента:
				</label>
				<div className='p-4 bg-gray-50 border border-gray-200 rounded-2xl min-h-[120px] text-base whitespace-pre-line text-[var(--black)]'>
					{studentAnswer || (
						<span className='italic text-gray-400'>
							Студент не предоставил развернутый ответ
						</span>
					)}
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				<p className='text-sm font-medium text-[var(--middle)] text-center'>
					Оценить ответ
				</p>
				<div className='grid grid-cols-2 gap-4 w-full'>
					<ButtonCase
						className='w-full flex items-center justify-center gap-3 py-3'
						backgroundColor={'var(--green-base)'}
						textColor={'var(--green-pale)'}
						hoverStyles={'hover:bg-[var(--green-hover)]'}
						onClick={() => onGrade(maxScore || 1)}
					>
						<CheckCircle2 size={24} />
						<span className='font-semibold'>Засчитать (Правильно)</span>
					</ButtonCase>
					<ButtonCase
						className='w-full flex items-center justify-center gap-3 py-3'
						backgroundColor={'var(--red-base)'}
						textColor={'var(--red-pale)'}
						hoverStyles={'hover:bg-[var(--red-hover)]'}
						onClick={() => onGrade(0)}
					>
						<XCircle size={24} />
						<span className='font-semibold'>Отклонить (Неправильно)</span>
					</ButtonCase>
				</div>
			</div>
		</div>
	)
}
