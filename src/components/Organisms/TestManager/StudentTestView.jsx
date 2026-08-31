import { useSearchParams } from 'react-router-dom'
import { Show } from '../../Atoms/Show'
import { Text } from '../../Atoms/Text'
import { useTestSession } from '../../../hooks/useTestSession'
import { MatchingStudentQuestionView } from './MatchingStudentQuestionView'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { useUser } from '../../../context/UserContext'
import { ChoiceQuestionStudentView } from './ChoiceQuestionStudentView'
import { TextArea } from '../../Molecules/InputFields/TextArea'
import { MediaUploader } from './MediaUploader'
import { StartButton } from '../../Atoms/Buttons/StartButton'
import { TestingScore } from './TestingScore'

export const StudentTestView = () => {
	const [searchParams] = useSearchParams()
	const testId = searchParams.get('section')
	const { role } = useUser()

	const {
		session,
		resultData,
		questionData,
		studentAnswer,
		setStudentAnswer,
		selectedOptions,
		isLoading,
		isSubmitting,
		isLastQuestion,
		startSession,
		submitAnswer,
	} = useTestSession(testId)

	const attemptsUsed = resultData?.attempts_left ?? 0
	const maxAttempts = resultData?.attempts ?? '∞'
	const status = resultData?.status

	// Fallback-экран для разных состояний вне прохождения теста
	const FallbackContent = () => {
		// 1. Статус "accessed" — показываем результаты
		if (status === 'accessed') {
			return (
				<TestingScore
					score={resultData?.score}
					testResults={resultData?.questions || resultData?.results || []}
				/>
			)
		}

		// 2. Статус "pending" — результат находится на проверке
		if (status === 'pending') {
			return (
				<div className='w-full h-[60vh] flex flex-col items-center justify-center p-4'>
					<div className='flex flex-col items-center gap-4 p-8 bg-[var(--light-middle)]/25 rounded-3xl max-w-md text-center'>
						<Text size={'2xl'} font={'semibold'} style={'primary'}>
							Тест отправлен на проверку
						</Text>
						<p className='text-sm text-[var(--middle)]'>
							Преподаватель проверяет ваши ответы на открытые вопросы.
							Результаты будут доступны позже.
						</p>
					</div>
				</div>
			)
		}

		// 3. Стандартный экран старта тестирования
		return (
			<div className='w-full h-[60vh] flex flex-col items-center justify-center p-4'>
				<div className='w-fit flex flex-col gap-2 p-6 rounded-4xl items-center'>
					<StartButton onClick={startSession} disabled={isLoading} />
					<p className='flex flex-col items-center justify-center leading-5'>
						<span className='text-xs font-semibold text-[var(--middle)] uppercase tracking-wider'>
							Попытки
						</span>
						<span className='text-lg font-bold text-[var(--black)]'>
							{attemptsUsed} / {maxAttempts}
						</span>
					</p>

					<Show when={isLoading}>
						<Text size={'sm'} style={'secondary'}>
							Загрузка сессии...
						</Text>
					</Show>
				</div>
			</div>
		)
	}

	return (
		<Show when={session !== null} fallback={<FallbackContent />}>
			<div className='w-full h-[50vh] mt-20 flex flex-col gap-3 items-center justify-center'>
				<Show when={questionData?.media !== null}>
					<MediaUploader media={questionData?.media} />
				</Show>

				<Text size={'2xl'} font={'semibold'} style={'primary'}>
					{questionData?.title}
				</Text>

				<div className='w-full max-w-2xl flex flex-col items-center gap-4'>
					<Show when={questionData?.question_type === 'choice'}>
						<ChoiceQuestionStudentView
							selectedOptions={selectedOptions}
							onToggleOption={setStudentAnswer}
							options={questionData?.options}
						/>
					</Show>
					<Show when={questionData?.question_type === 'matching'}>
						<MatchingStudentQuestionView
							leftOptions={questionData?.left_options}
							rightOptions={questionData?.right_options}
							onAnswerChange={setStudentAnswer}
						/>
					</Show>
					<Show when={questionData?.question_type === 'open'}>
						<TextArea
							title='Ваш ответ'
							placeholder='Введите ответ...'
							value={studentAnswer || ''}
							onChange={e => setStudentAnswer(e.target.value)}
							readOnly={role !== 'student'}
						/>
					</Show>

					<Show when={role === 'student'}>
						<div className='flex gap-3 mt-4 w-full justify-center'>
							<SubmitButton onClick={submitAnswer} disabled={isSubmitting}>
								<p>
									{isLastQuestion
										? 'Ответить на последний вопрос'
										: 'Ответить на вопрос'}
								</p>
							</SubmitButton>
						</div>
					</Show>
				</div>
			</div>
		</Show>
	)
}
