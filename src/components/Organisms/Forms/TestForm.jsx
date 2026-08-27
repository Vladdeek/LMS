import React, { useEffect } from 'react'
import { Clock, RefreshCw, HelpCircle, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '../../Molecules/InputFields/Input'
import { Text } from '../../Atoms/Text'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { TimeLimitInput } from '../../Molecules/InputFields/TimeLimitInput'
import { Checkbox } from '../../Molecules/CheckBox'
import { useTestForm } from '../../../hooks/useTestForm'
import { TEST_CONFIG } from '../../../Constants/testConfig'
import { InputNumber } from '../../Molecules/InputFields/InputNumber'

export const TestForm = props => {
	const { state, actions } = useTestForm(props)

	return (
		<form
			onSubmit={actions.handleSubmit}
			className='w-125 max-w-5xl mx-auto p-2 sm:p-4'
		>
			{/* ОСНОВНАЯ СЕТКА В 2 КОЛОНКИ */}
			<div className='flex flex-col gap-6 w-full items-start'>
				<div className='w-full flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
					<div className='p-1.5 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
						<Clock size={18} />
					</div>
					<h3 className='text-base font-bold text-[var(--black)]'>
						Время и попытки
					</h3>
				</div>

				<div className='space-y-4 w-full'>
					{/* Ограничение по времени */}
					<div className='flex justify-between items-center p-3 bg-[var(--light-middle)]/10 rounded-xl border border-[var(--light-middle)]/20'>
						<Text size={'sm'} font={'semibold'} style={'primary'}>
							Лимит времени
						</Text>
						<TimeLimitInput
							COUNT_QUESTION={
								state.isQuestionBank
									? Number(state.questionsToUse) || 0
									: state.totalQuestionsCount || 0
							}
							value={state.timeLimit}
							onChange={actions.setTimeLimit}
						/>
					</div>

					{/* Количество попыток */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<RefreshCw size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Ограничить количество попыток'
								checked={state.hasAttemptsLimit}
								onChange={e => actions.setHasAttemptsLimit(e.target.checked)}
							/>
						</div>

						{/* Количество попыток */}
						{state.hasAttemptsLimit && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<InputNumber
									placeholder={`Максимум ${TEST_CONFIG.MAX_ATTEMPTS}`}
									title='Максимум попыток'
									min={1}
									max={TEST_CONFIG.MAX_ATTEMPTS}
									value={state.attemptsCount}
									onChange={e => actions.setAttemptsCount(e.target.value)}
								/>
							</motion.div>
						)}
					</div>
				</div>
				<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
					<div className='p-1.5 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
						<HelpCircle size={18} />
					</div>
					<h3 className='text-base font-bold text-[var(--black)]'>
						Вопросы и оценивание
					</h3>
				</div>

				<div className='space-y-4'>
					{/* Режим банка вопросов */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<Checkbox
							title='Использовать случайные вопросы (Банк вопросов)'
							checked={state.isQuestionBank}
							onChange={e => actions.setIsQuestionBank(e.target.checked)}
						/>

						{state.isQuestionBank && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<InputNumber
									placeholder={
										state.totalQuestionsCount
											? `Доступно вопросов: ${state.totalQuestionsCount}`
											: 'Количество вопросов'
									}
									title='Количество вопросов в тесте'
									min={1}
									max={state.totalQuestionsCount || undefined}
									value={state.questionsToUse}
									onChange={e => actions.setQuestionsToUse(e.target.value)}
								/>
							</motion.div>
						)}
					</div>

					{/* Проходной балл */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<Award size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Установить проходной балл'
								checked={state.hasPassingScore}
								onChange={e => actions.setHasPassingScore(e.target.checked)}
							/>
						</div>

						{state.hasPassingScore && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<InputNumber
									type='number'
									placeholder='Например: 80'
									title='Проходной балл (%)'
									min={1}
									max={100}
									value={state.passingScore}
									onChange={e => actions.setPassingScore(e.target.value)}
								/>
							</motion.div>
						)}
					</div>
				</div>
			</div>

			{/* КНОПКА САБМИТА */}
			<div className='flex justify-end pt-4 border-t border-[var(--light-middle)]/30'>
				<SubmitButton
					onClick={actions.handleSubmit}
					className='w-full sm:w-auto px-6 py-2.5'
					disabled={state.isSubmitDisabled}
				>
					<Text size={'md'} font={'semibold'}>
						{state.editMode ? 'Сохранить изменения' : 'Создать тест'}
					</Text>
				</SubmitButton>
			</div>
		</form>
	)
}
