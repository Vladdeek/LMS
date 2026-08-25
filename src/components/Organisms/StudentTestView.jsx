import { useEffect, useState } from 'react'
import { Loader } from '../Atoms/Loaders/Loader'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'
import { LevelsBar } from '../Molecules/LevelsBar'

export const StudentTestView = ({ activeSectionId }) => {
	const [sessionActive, setSessionActive] = useState(false)
	const [gradeStatus, setGradeStatus] = useState(null)
	const [score, setScore] = useState(null)
	const [questions, setQuestions] = useState([])
	const [activeIndex, setActiveIndex] = useState(0)
	const [answers, setAnswers] = useState(null)
	const [studentAnswers, setStudentAnswers] = useState([])
	const [statusLoading, setStatusLoading] = useState(true)

	const fetchTestSession = async () => {
		setStatusLoading(true)
		try {
			const sessionRes = await getSession(activeSectionId)
			setSessionActive(sessionRes.is_active)
			setGradeStatus(sessionRes.grade_status)
			setScore(sessionRes.score)

			if (sessionRes.is_active) {
				const qRes = await getQuestions(activeSectionId)
				setQuestions(qRes?.questions || [])
			}
		} catch (err) {
			console.error(err)
		} finally {
			setStatusLoading(false)
		}
	}

	useEffect(() => {
		if (activeSectionId) {
			fetchTestSession()
		}
	}, [activeSectionId])

	const handleStartSession = async () => {
		try {
			await startSession(activeSectionId)
			await fetchTestSession()
		} catch (err) {
			console.error(err)
		}
	}

	const handleAnswerSubmit = async () => {
		const currentQ = questions[activeIndex]
		if (!currentQ) return

		try {
			await updateStudentAnswers(activeSectionId, {
				question_id: currentQ.id,
				answers_data: answers,
			})

			setStudentAnswers(prev => [
				...prev,
				{ question_id: currentQ.id, answers_data: answers },
			])
			setQuestions(prev =>
				prev.map((q, idx) =>
					idx === activeIndex ? { ...q, filled: true } : q,
				),
			)

			if (activeIndex + 1 < questions.length) {
				setActiveIndex(prev => prev + 1)
			}
			setAnswers(null)
		} catch (err) {
			console.error(err)
		}
	}

	const handleEndTest = async () => {
		try {
			await endSession(activeSectionId)
			await fetchTestSession()
		} catch (err) {
			console.error(err)
		}
	}

	if (statusLoading) {
		return (
			<div className='w-full h-64 flex justify-center items-center'>
				<Loader />
			</div>
		)
	}

	if (gradeStatus === 'assessed') {
		return (
			<div className='w-full h-64 flex flex-col justify-center items-center gap-4'>
				<p className='text-lg font-semibold text-[var(--black)]'>
					Тест завершен
				</p>
				<p className='px-6 py-3 font-medium rounded-xl bg-[var(--hero-epta)] text-white text-2xl shadow-md'>
					{score} / 5
				</p>
			</div>
		)
	}

	if (gradeStatus === 'pending') {
		return (
			<div className='w-full h-64 flex flex-col justify-center gap-3 items-center'>
				<p className='px-6 py-3 font-medium rounded-xl bg-[var(--hero-epta)] text-white text-2xl shadow-md'>
					? / 5
				</p>
				<p className='font-light text-[var(--middle)] text-md'>
					(На рассмотрении преподавателем)
				</p>
			</div>
		)
	}

	if (!sessionActive) {
		return (
			<div className='w-full h-64 flex flex-col items-center justify-center gap-4'>
				<p className='text-[var(--middle)] text-lg'>
					Нажмите кнопку ниже, чтобы начать прохождение теста
				</p>
				<SubmitButton
					onClick={handleStartSession}
					className='w-fit px-8 py-3 text-lg'
				>
					Начать тест
				</SubmitButton>
			</div>
		)
	}

	const q = questions[activeIndex]

	return (
		<div className='w-full flex flex-col items-center gap-4'>
			<LevelsBar
				questions={questions}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
			/>

			<div className='w-full flex justify-center min-h-[250px] p-4 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)]'>
				{q?.type === 'multiple' && (
					<MoreVariantView testId={q?.id} onAnswerSelect={setAnswers} />
				)}
				{q?.type === 'single' && (
					<OneVariantView testId={q?.id} onAnswerSelect={setAnswers} />
				)}
				{q?.type === 'matching' && (
					<SortVariantView
						testId={q?.id}
						onAnswerSelect={setAnswers}
						Answered={q?.filled}
					/>
				)}
				{q?.type === 'open' && (
					<OpenQuestionView
						testId={q?.id}
						onChange={setAnswers}
						readOnly={q?.filled}
						studentAnswer={
							studentAnswers?.find(a => q?.id === a.question_id)?.answers_data
								?.student_answer
						}
					/>
				)}
			</div>

			<div className='flex justify-center gap-3 mt-4'>
				{questions?.every(item => item.filled) ? (
					<button
						onClick={handleEndTest}
						className='px-6 py-2.5 bg-[var(--black)] text-[var(--white)] rounded-xl font-medium hover:bg-[var(--hero-epta)] transition-all'
					>
						Завершить тест
					</button>
				) : (
					<div className='flex flex-col gap-2 items-center'>
						<button
							onClick={handleAnswerSubmit}
							disabled={q?.filled || !answers}
							className={`px-6 py-2 bg-[var(--black)] text-[var(--white)] rounded-xl font-medium flex ${
								q?.filled || !answers
									? 'opacity-30 cursor-not-allowed'
									: 'hover:bg-[var(--hero-epta)] hover:scale-105 transition-all'
							}`}
						>
							Ответить
						</button>
						<p className='text-[var(--middle)] text-xs font-light'>
							Внимание: после отправки ответ нельзя будет изменить.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
