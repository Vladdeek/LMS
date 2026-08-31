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
import { Show } from '../../Atoms/Show'

export const TestForm = props => {
	const { state, actions } = useTestForm(props)

	const DIFFICULTY_OPTIONS = [
		{ value: 'hight_score', label: 'Высший балл' },
		{ value: 'average_score', label: 'Средний балл' },
		{ value: 'last_attempt', label: 'Последняя попытка' },
	]

	const getCheckedValue = e =>
		e && typeof e === 'object' && 'target' in e ? e.target.checked : Boolean(e)

	return (
		<form className='max-w-5xl mx-auto p-2 sm:p-4 space-y-6'>
			{/* Сетка из двух колонок для десктопа */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
				{/* СЕКЦИЯ 1: ВРЕМЯ И ПОПЫТКИ */}
				<div className='flex flex-col gap-4 w-full'>
					<div className='w-full flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
						<div className='p-1.5 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
							<Clock size={18} />
						</div>
						<h3 className='text-base font-bold text-[var(--black)]'>
							Время и попытки
						</h3>
					</div>

					{/* Лимит времени */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<Timer size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Лимит времени'
								checked={state.hasTimeLimit}
								onChange={e => actions.setHasTimeLimit(getCheckedValue(e))}
							/>
						</div>
						<Show when={state.hasTimeLimit}>
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
						</Show>
					</div>

					{/* Количество попыток */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<RefreshCw size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Ограничить количество попыток'
								checked={state.hasAttemptsLimit}
								onChange={e => actions.setHasAttemptsLimit(getCheckedValue(e))}
							/>
						</div>
						<Show when={state.hasAttemptsLimit}>
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
									onChange={e =>
										actions.setAttemptsCount(e?.target ? e.target.value : e)
									}
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
						</Show>
					</div>
				</div>

				{/* СЕКЦИЯ 2: ВОПРОСЫ И ОЦЕНИВАНИЕ */}
				<div className='flex flex-col gap-4 w-full'>
					<div className='w-full flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
						<div className='p-1.5 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
							<HelpCircle size={18} />
						</div>
						<h3 className='text-base font-bold text-[var(--black)]'>
							Вопросы и оценивание
						</h3>
					</div>

					{/* Режим банка вопросов */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<Database size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Банк вопросов'
								checked={state.isQuestionBank}
								onChange={e => actions.setIsQuestionBank(getCheckedValue(e))}
							/>
						</div>

						<Show when={state.isQuestionBank}>
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
									onChange={e =>
										actions.setQuestionsToUse(e?.target ? e.target.value : e)
									}
								/>
							</motion.div>
						</Show>
					</div>

					{/* Проходной балл */}
					<div className='p-3 bg-[var(--light-middle)]/10 rounded-xl space-y-3 border border-[var(--light-middle)]/20'>
						<div className='flex items-center gap-2'>
							<Award size={16} className='text-[var(--middle)]' />
							<Checkbox
								title='Проходной балл'
								checked={state.hasPassingScore}
								onChange={e => actions.setHasPassingScore(getCheckedValue(e))}
							/>
						</div>
						<Show when={state.hasPassingScore}>
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<InputNumber
									name='passingScore'
									placeholder={
										state.maxScore !== null
											? `Макс. балл: ${state.maxScore}`
											: 'Например: 80'
									}
									title={
										state.maxScore !== null
											? `Проходной балл (из ${state.maxScore})`
											: 'Проходной балл'
									}
									min={1}
									max={state.maxScore ?? 100}
									value={state.passingScore}
									onChange={e =>
										actions.setPassingScore(e?.target ? e.target.value : e)
									}
								/>
							</motion.div>
						</Show>
					</div>
					<div className='pt-2 border-t border-[var(--light-middle)]/20'>
						<Checkbox
							title='Отображать студенту его ответы и их верность'
							checked={state.showAnswersToStudent}
							onChange={e =>
								actions.setShowAnswersToStudent(getCheckedValue(e))
							}
						/>
					</div>
				</div>
				{/* Общая опция под сеткой */}
			</div>

			{/* КНОПКА САБМИТА */}
			<div className='flex justify-end pt-4 border-t border-[var(--light-middle)]/30'>
				<SubmitButton
					onClick={actions.handleSubmit}
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
