import { useEffect, useState } from 'react'
import api from '../../../api/client'
import { API_URL } from '../../../API'
import { Loader } from '../../Atoms/Loaders/Loader'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'

import { LevelsBar } from '../../Molecules/LevelsBar'
import { ChoiceQuestionCheckView } from './ChoiseQuestionCheckView'
import { MatchingQuestionCheckView } from './MatchingQuestionCheckView'
import { OpenQuestionCheckView } from './OpenQuestionCheckView'

export const TestCheckingView = ({ id, studentId }) => {
	const [activeIndex, setActiveIndex] = useState(null)
	const [questions, setQuestions] = useState([])
	const [questionData, setQuestionData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [grade, setGrade] = useState(null)

	const fetchQuestions = async () => {
		try {
			const res = await api.get(
				`${API_URL}/student-profile/${studentId}/assignment/test/preview?test_id=${id}`,
			)
			setQuestions(res.data.questions || [])
			setGrade({
				score: res.data.score,
				grade_status: res.data.grade_status,
			})
			if (res.data.questions?.length > 0 && activeIndex === null) {
				setActiveIndex(0)
			}
		} catch (e) {
			console.error('Ошибка загрузки списка вопросов:', e)
		}
	}

	const finishCheck = async () => {
		try {
			await api.put(
				`${API_URL}/student-profile/${studentId}/assignment/test/grade?test_id=${id}`,
			)
			fetchQuestions()
		} catch (e) {
			console.error('Ошибка завершения оценивания:', e)
		}
	}

	useEffect(() => {
		if (id && studentId) {
			fetchQuestions()
		}
	}, [id, studentId])

	useEffect(() => {
		const fetchQuestionDetail = async () => {
			if (activeIndex === null || !questions[activeIndex]?.question_id) return
			setLoading(true)
			try {
				const currentQId = questions[activeIndex].question_id
				const res = await api.get(
					`${API_URL}/student-profile/${studentId}/assignment/test/question/answer?test_id=${id}&question_id=${currentQId}`,
				)
				setQuestionData(res.data)
			} catch (e) {
				console.error('Ошибка загрузки вопроса:', e)
			} finally {
				setLoading(false)
			}
		}

		fetchQuestionDetail()
	}, [activeIndex, id, studentId, questions])

	const currentQuestionId = questions[activeIndex]?.question_id

	return (
		<div className='w-full flex flex-col gap-5'>
			{/* Шапка с навигацией по вопросам и итоговой оценкой */}
			<div className='w-full flex justify-between items-center gap-4'>
				<LevelsBar
					questions={questions}
					activeIndex={activeIndex}
					setActiveIndex={setActiveIndex}
				/>

				{grade !== null &&
					(grade.grade_status === 'assessed' ? (
						<div
							className={`text-white text-lg font-bold aspect-square flex justify-center items-center h-12 w-12 rounded-xl shadow-sm ${
								grade.score > 3
									? 'bg-[var(--correct-lvl)]'
									: grade.score > 2
										? 'bg-[var(--middle-correct-lvl)]'
										: grade.score > 0
											? 'bg-[var(--not-correct-lvl)]'
											: 'bg-gray-400'
							}`}
						>
							{grade.score}
						</div>
					) : (
						<SubmitButton onClick={finishCheck}>
							Завершить оценивание
						</SubmitButton>
					))}
			</div>

			{/* Тело проверяемого вопроса */}
			<div className='w-full flex justify-center pt-2'>
				{loading ? (
					<div className='flex items-center justify-center h-40'>
						<Loader />
					</div>
				) : (
					(() => {
						if (!questionData) return null

						const {
							type,
							question,
							media,
							answers,
							score,
							correctness_status,
						} = questionData

						if (type === 'multiple' || type === 'single' || type === 'choice') {
							return (
								<ChoiceQuestionCheckView
									question={question}
									media={media}
									answers={answers}
								/>
							)
						}

						if (type === 'matching') {
							return (
								<MatchingQuestionCheckView
									question={question}
									media={media}
									answers={answers}
								/>
							)
						}

						if (type === 'open') {
							return (
								<OpenQuestionCheckView
									question={question}
									media={media}
									value={answers}
									info={{
										studentId,
										testId: id,
										questionId: currentQuestionId,
										score,
										correctness_status,
									}}
									reloadFetch={fetchQuestions}
								/>
							)
						}

						return null
					})()
				)}
			</div>
		</div>
	)
}
