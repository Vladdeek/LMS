import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '../Molecules/InputFields/Input'
import { AnimatePresence, motion } from 'framer-motion'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'

export const TestView = ({ isEdit, role }) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const activeSectionId = searchParams.get('section')
	const [data, setData] = useState({
		question: '',
		max_score: 1,
		options: [],
		type: '',
		student_answer: '',
	})
	const isDataLoaded = useRef(false)

	const getQuestionDetails = async () => {
		try {
			const res = await GetDetailQuestion(activeQuestionId)
			// При загрузке отключаем проверку, устанавливаем данные
			setData({
				question: res?.name || '',
				max_score: res?.max_score || 1,
				options: res?.options || [],
				type: res?.type || '',
			})
			// После установки данных ставим флаг в true
			isDataLoaded.current = true
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		if (activeQuestionId) {
			isDataLoaded.current = false // Сбрасываем флаг при смене вопроса
			getQuestionDetails()
		}
	}, [activeQuestionId])

	const handleChange = (e, customValue) => {
		if (e?.target) {
			const { name, value, type: inputType, files } = e.target
			setData(prev => ({
				...prev,
				[name]: inputType === 'file' ? files[0] : value,
			}))
		} else if (typeof e === 'string') {
			setData(prev => ({ ...prev, [e]: customValue }))
		}
	}

	const addOption = async () => {
		try {
			// 1. Собираем все существующие коды в Set для быстрого поиска
			const existingCodes = new Set(data?.options?.map(opt => opt.option_code))

			// 2. Ищем первое число, которого нет в Set
			let newCode = 1
			while (existingCodes.has(String(newCode))) {
				newCode++
			}

			// 3. Отправляем найденный свободный код
			await AddOptionOnQuestion(activeQuestionId, String(newCode))
		} catch (err) {
			console.error(err)
		} finally {
			getQuestionDetails()
		}
	}

	const handleChangeTypeOnOption = async type => {
		try {
			await EditQuestionType(activeQuestionId, type)
		} catch (err) {
			console.error(err)
		} finally {
			getQuestionDetails()
		}
	}
	// 1. Создаем ref для хранения актуального ID, чтобы не зависеть от замыканий
	const activeQuestionIdRef = useRef(activeQuestionId)

	// 2. Обновляем ref каждый раз, когда ID меняется
	useEffect(() => {
		activeQuestionIdRef.current = activeQuestionId
	}, [activeQuestionId])

	// 3. Ваша дебаунс-функция (теперь берет ID из ref)
	const debouncedEditQuestion = useDebounce(async (q, s) => {
		const currentId = activeQuestionIdRef.current // Берем актуальный ID
		if (!currentId) {
			console.warn('ID отсутствует, сохранение пропущено')
			return
		}
		try {
			await EditQuestion(currentId, q, s)
		} catch (error) {
			console.error('Ошибка сохранения:', error)
		}
	}, 1500)

	// 4. Эффект для вызова дебаунса
	useEffect(() => {
		if (!isDataLoaded.current) return
		debouncedEditQuestion(data.question, data.max_score)
	}, [data.question, data.max_score]) // activeQuestionId здесь больше не нужен для запуска

	const [selectedOptions, setSelectedOptions] = useState(new Set())

	const toggleOption = optionCode => {
		setSelectedOptions(prev => {
			const next = new Set(prev)
			if (next.has(optionCode)) {
				next.delete(optionCode)
			} else {
				next.add(optionCode)
			}
			return next
		})
	}

	const submitAnswer = async () => {
		try {
			await SubmitAnswer(
				activeQuestionId,
				data.type,
				Array.from(selectedOptions),
				activeSectionId,
			)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className='w-full flex flex-col gap-6 items-center'>
			{/* Верхняя часть с вопросом и оценкой */}
			{isEdit ? (
				<div className='grid gap-4 grid-cols-[1fr_auto] w-full max-w-2xl'>
					<Input
						title='Введите вопрос'
						name='question'
						value={data.question}
						onChange={handleChange}
					/>
					<div className='w-20'>
						<Input
							title='Оценка'
							name='max_score'
							value={data.max_score}
							onChange={handleChange}
						/>
					</div>
				</div>
			) : (
				<p className='text-[var(--black)] font-medium text-xl'>
					{data.question || 'Вопрос не задан'}
				</p>
			)}

			{/* Блок управления типами */}
			<div className='w-full max-w-2xl flex flex-col items-center gap-4 '>
				{data?.type === 'choice' ? (
					<div className='flex flex-col items-center gap-3 w-full'>
						<div className='flex flex-col w-full items-center'>
							<p className='text-[var(--middle)] font-medium'>
								Варианты ответа
							</p>
							{/* Кнопка смены на открытый тип */}
							{isEdit && (
								<button
									onClick={() => handleChangeTypeOnOption('open')}
									className='text-xs text-red-500 opacity-75 hover:opacity-100 hover:underline self-end cursor-pointer transition-all'
								>
									Убрать варианты ответа (сделать открытым)
								</button>
							)}
						</div>

						<AnimatePresence mode='popLayout'>
							{data?.options?.map((q, i) => {
								console.log('isEdit: ', isEdit)
								const abcdefg = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
								return (
									<motion.div
										key={q.id} // Уникальный ключ здесь
										layout // Плавная перестановка при изменении порядка/удалении
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.5, opacity: 0 }} // Анимация при удалении
										transition={{
											duration: 0.3,
											delay: i * 0.05, // Немного уменьшил задержку для отзывчивости
											ease: 'easeOut',
										}}
										className='w-full flex items-center gap-3'
									>
										{isEdit ? (
											<QuestionOptionInput
												id={q.id}
												initialText={q.name}
												initialIsCorrect={q.is_correct}
												onOptionUpdate={getQuestionDetails}
												disabled={data?.options?.length <= 2}
											/>
										) : (
											<>
												<p className='uppercase text-xl'>{abcdefg[i] + ').'}</p>
												<QuestionOptionButton
													id={q.id}
													initialText={q.name}
													onHandleAnswer={() => toggleOption(q.option_code)}
													initialIsSelected={selectedOptions.has(q.option_code)}
												/>
											</>
										)}
									</motion.div>
								)
							})}
						</AnimatePresence>
						{isEdit && (
							<SubmitButton onClick={addOption} className='mt-2'>
								<Plus strokeWidth={3} />
								<p>Добавить вариант</p>
							</SubmitButton>
						)}
					</div>
				) : (
					<div className='flex flex-col items-center gap-4 w-full'>
						{isEdit ? (
							<SubmitButton onClick={() => handleChangeTypeOnOption('choice')}>
								Добавить варианты ответа
							</SubmitButton>
						) : (
							<div className={`w-full`}>
								<Input
									title='Введите ответ'
									name='student_answer'
									value={data.student_answer}
									onChange={handleChange}
								/>
							</div>
						)}
					</div>
				)}
				{role === 'student' && (
					<>
						<SubmitButton onClick={submitAnswer} className='mt-2'>
							<p>Ответить на вопрос</p>
						</SubmitButton>
					</>
				)}
			</div>
		</div>
	)
}
