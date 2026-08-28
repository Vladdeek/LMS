import React from 'react'
import {
	Clock,
	RefreshCw,
	HelpCircle,
	Award,
	Database,
	Timer,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Text } from '../../Atoms/Text'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { TimeLimitInput } from '../../Molecules/InputFields/TimeLimitInput'
import { Checkbox } from '../../Molecules/CheckBox'
import { useTestForm } from '../../../hooks/useTestForm'
import { TEST_CONFIG } from '../../../Constants/testConfig'
import { InputNumber } from '../../Molecules/InputFields/InputNumber'
import { RadioGroup } from '../../Molecules/RadioGroup'

export const TestForm = props => {
	const { state, actions } = useTestForm(props)

	const DIFFICULTY_OPTIONS = [
		{ value: 0, label: 'Высший балл' },
		{ value: 1, label: 'Средний балл' },
		{ value: 2, label: 'Последняя попытка' },
	]

	return (
		<form
			onSubmit={actions.handleSubmit}
			className='w-125 max-w-5xl mx-auto p-2 sm:p-4 space-y-6'
		>
			{/* СЕКЦИЯ: ВРЕМЯ И ПОПЫТКИ */}
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
					{/* Лимит времени */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<Timer size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Лимит времени'
								checked={state.hasTimeLimit}
								onChange={e => actions.setHasTimeLimit(e.target.checked)}
							/>
						</div>

						{state.hasTimeLimit && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<TimeLimitInput
									name='timeLimit'
									COUNT_QUESTION={
										state.isQuestionBank
											? Number(state.questionsToUse) || 0
											: state.totalQuestionsCount || 0
									}
									value={state.timeLimit}
									onChange={actions.setTimeLimit}
								/>
							</motion.div>
						)}
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

						{state.hasAttemptsLimit && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								className='flex flex-col gap-3'
							>
								<InputNumber
									name='attemptsCount'
									placeholder={`Максимум ${TEST_CONFIG.MAX_ATTEMPTS}`}
									title='Максимум попыток'
									min={1}
									max={TEST_CONFIG.MAX_ATTEMPTS}
									value={state.attemptsCount}
									onChange={e => actions.setAttemptsCount(e.target.value)}
								/>

								<RadioGroup
									options={DIFFICULTY_OPTIONS}
									value={state.gradingStrategy}
									onChange={actions.setGradingStrategy}
									style='alt'
									className='flex gap-3'
									wfull
								/>
							</motion.div>
						)}
					</div>
				</div>

				{/* СЕКЦИЯ: ВОПРОСЫ И ОЦЕНИВАНИЕ */}
				<div className='w-full flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
					<div className='p-1.5 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
						<HelpCircle size={18} />
					</div>
					<h3 className='text-base font-bold text-[var(--black)]'>
						Вопросы и оценивание
					</h3>
				</div>

				<div className='space-y-4 w-full'>
					{/* Режим банка вопросов */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<Database size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Банк вопросов'
								checked={state.isQuestionBank}
								onChange={e => actions.setIsQuestionBank(e.target.checked)}
							/>
						</div>

						{state.isQuestionBank && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<InputNumber
									name='questionsToUse'
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
								title='Проходной балл'
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
									name='passingScore'
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

				{/* Отображение ответов студенту */}
				<Checkbox
					title='Отображать студенту его ответы и их верность'
					checked={state.showAnswersToStudent}
					onChange={e => actions.setShowAnswersToStudent(e.target.checked)}
				/>
			</div>

			{/* КНОПКА САБМИТА */}
			<div className='flex justify-end pt-4 border-t border-[var(--light-middle)]/30'>
				<SubmitButton
					type='submit'
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
