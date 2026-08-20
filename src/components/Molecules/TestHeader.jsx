import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TestHeaderBlock } from '../Atoms/TestHeaderBlock'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export const TestHeader = ({ isEdit }) => {
	const [searchParams, setSearchParams] = useSearchParams()

	// Достаем текущий questionId из URL (строка, содержащая UUID)
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const handleBlockClick = id => {
		// Создаем копию текущих параметров, чтобы НЕ СТЕРЕТЬ существующий параметр ?section=...
		const newParams = new URLSearchParams(searchParams)

		// Добавляем или обновляем только questionId
		newParams.set('questionId', id)

		// Обновляем URL строки браузера
		setSearchParams(newParams)
	}

	const [questionsData, setQuestionsData] = useState([])

	const getQuestions = async () => {
		try {
			const res = await GetQuestions(activeSection)
			setQuestionsData(res.question_ids)
		} catch (err) {
			console.log(err)
		}
	}

	const addQuestion = async () => {
		try {
			const res = await AddQuestion(activeSection)
			if (res) {
				handleBlockClick(res.question_id)
			}
		} catch (err) {
			console.log(err)
		} finally {
			getQuestions()
		}
	}

	useEffect(() => {
		activeSection && getQuestions()
	}, [activeSection])

	const deleteQuestion = async e => {
		// Передаем ID конкретного вопроса
		e.stopPropagation()
		try {
			await DeleteQuestion(activeQuestionId)

			// После успешного удаления сбрасываем параметры URL
			setSearchParams({})

			// Если нужно обновить список вопросов
			await getQuestions()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className='flex gap-4 w-full mb-15 items-center'>
			{questionsData && (
				<div className='flex flex-wrap w-full gap-2'>
					{questionsData?.map((q, idx) => (
						<motion.div
							key={q}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: idx * 0.1,
								ease: 'easeOut',
							}}
						>
							<TestHeaderBlock
								isEdit={isEdit}
								key={q}
								num={idx + 1}
								questionId={q}
								// Сверяем UUID из URL с UUID текущего вопроса в цикле
								isActive={q === activeQuestionId}
								onClick={handleBlockClick}
								delQuestion={e => deleteQuestion(e)}
							/>
						</motion.div>
					))}
					{isEdit && (
						<motion.div
							key={questionsData?.length + 1}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: questionsData?.length * 0.1,
								ease: 'easeOut',
							}}
						>
							<div
								onClick={() => addQuestion()} // Передаем UUID вопроса при клике
								className={`w-10 h-10 flex items-center justify-center rounded-[10px] font-semibold text-xl shadow-[var(--shadow)] select-none cursor-pointer transition-all bg-[var(--white)] text-[var(--middle)] hover:bg-[var(--hero)] hover:text-white hover:scale-101 active:scale-99 active:shadow-inner`}
							>
								<Plus strokeWidth={3} />
							</div>
						</motion.div>
					)}
				</div>
			)}
			<div className='flex gap-1 items-center w-fit'></div>
		</div>
	)
}
