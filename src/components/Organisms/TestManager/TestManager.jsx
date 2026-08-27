import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Show } from '../../Atoms/Show'
import { Text } from '../../Atoms/Text'
import { TestHeader } from '../../Molecules/TestHeader'
import { TestView } from './TestView'
import { TestingScore } from './TestingScore'
import { StartTestingButton } from '../../Atoms/Buttons/StartTestingButton'

export const TestManager = ({ isEdit }) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const [sessionIsStart, setSessionIsStart] = useState(false)
	const [accessToTheTest, setAccessToTheTest] = useState(false)

	const [timeLeft, setTimeLeft] = useState(0)

	const [role, setRole] = useState()

	return (
		<>
			{role === 'student' ? (
				<>
					{sessionIsStart ? (
						accessToTheTest ? (
							<>
								<TestHeader timeLeft={timeLeft} isEdit={role !== 'student'} />
								{activeQuestionId ? (
									<>
										<TestView />
									</>
								) : (
									<div className='flex justify-center items-center w-full h-full text-center text-[var(--middle)] font-medium'>
										Вопрос не выбран
									</div>
								)}
							</>
						) : (
							<TestingScore />
						)
					) : (
						<div className={`w-full h-150 flex justify-center items-center`}>
							<StartTestingButton
								title={'Начать тестирование'}
								onClick={startSession}
							/>
						</div>
					)}
				</>
			) : (
				<>
					<TestHeader timeLeft={timeLeft} isEdit={role !== 'student'} />
					<Show
						when={activeQuestionId}
						fallback={
							<div className='flex justify-center items-center w-full h-[50vh]'>
								<Text size={'xl'} style={'secondary'}>
									Вопрос не выбран
								</Text>
							</div>
						}
					>
						<TestView role={role} isEdit={role !== 'student'} />
					</Show>
				</>
			)}
		</>
	)
}
