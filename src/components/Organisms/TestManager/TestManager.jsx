import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Show } from '../../Atoms/Show'
import { Text } from '../../Atoms/Text'
import { TestHeader } from '../../Molecules/TestHeader'
import { TestView } from './TestView'
import { useUser } from '../../../context/UserContext'

export const TestManager = () => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const { role } = useUser()

	return (
		<Show when={role !== 'student'}>
			<TestHeader isEdit={role !== 'student'} />
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
		</Show>
	)
}
