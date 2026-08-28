import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TEST_CONFIG } from '../Constants/testConfig'
import { GetQuestions } from '../api/Test'

export const useTestForm = props => {
	const { initialData, onSubmit } = props
	const [searchParams] = useSearchParams()

	const testId = searchParams.get('section') || initialData?.id

	// Настройки прохождения
	const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || '')
	const [hasTimeLimit, setHasTimeLimit] = useState(
		Boolean(initialData?.timeLimit),
	)
	const [hasAttemptsLimit, setHasAttemptsLimit] = useState(
		Boolean(initialData?.attemptsCount),
	)
	const [attemptsCount, setAttemptsCount] = useState(
		initialData?.attemptsCount || '',
	)

	// Новые поля
	const [showAnswersToStudent, setShowAnswersToStudent] = useState(
		initialData?.showAnswersToStudent ?? false,
	)
	const [gradingStrategy, setGradingStrategy] = useState(
		initialData?.gradingStrategy ?? 1, // 0: Высший балл, 1: Средний балл, 2: Последняя попытка
	)

	// Вопросы
	const [questionsIds, setQuestionsIds] = useState([])
	const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
	const [isQuestionBank, setIsQuestionBank] = useState(
		Boolean(initialData?.isQuestionBank),
	)
	const [questionsToUse, setQuestionsToUse] = useState(
		initialData?.questionsToUse || '',
	)

	// Проходной балл
	const [hasPassingScore, setHasPassingScore] = useState(
		Boolean(initialData?.passingScore),
	)
	const [passingScore, setPassingScore] = useState(
		initialData?.passingScore || '',
	)

	const editMode = Boolean(testId)
	const totalQuestionsCount = questionsIds.length

	// Загрузка вопросов по ID из URL/props
	useEffect(() => {
		if (!testId) return

		const fetchQuestions = async () => {
			setIsLoadingQuestions(true)
			try {
				const res = await GetQuestions(testId)
				setQuestionsIds(Array.isArray(res) ? res : [])
			} catch (err) {
				console.error('Ошибка загрузки вопросов:', err)
			} finally {
				setIsLoadingQuestions(false)
			}
		}

		fetchQuestions()
	}, [testId])

	// Хэндлер для установки лимита времени
	const handleTimeLimitChange = val => {
		const nextVal =
			typeof val === 'object' && val?.target ? val.target.value : val
		setTimeLimit(nextVal)
	}

	// Хэндлеры с ограничением
	const handleQuestionsToUseChange = value => {
		const numValue = Number(value)
		if (
			isQuestionBank &&
			totalQuestionsCount > 0 &&
			numValue > totalQuestionsCount
		) {
			setQuestionsToUse(totalQuestionsCount)
		} else {
			setQuestionsToUse(value)
		}
	}

	const handleAttemptsCountChange = value => {
		const numValue = Number(value)
		if (numValue > TEST_CONFIG.MAX_ATTEMPTS) {
			setAttemptsCount(TEST_CONFIG.MAX_ATTEMPTS)
		} else {
			setAttemptsCount(value)
		}
	}

	const handleHasTimeLimitChange = checked => {
		setHasTimeLimit(checked)
		if (!checked) {
			setTimeLimit('')
		}
	}

	// Минимальное время в секундах
	const effectiveQuestionsCount = isQuestionBank
		? Number(questionsToUse) || 0
		: totalQuestionsCount

	const TIME_FOR_ONE_QUESTION_SECONDS = 90
	const minTimeLimit = effectiveQuestionsCount * TIME_FOR_ONE_QUESTION_SECONDS

	// Валидация
	const isAttemptsInvalid =
		hasAttemptsLimit &&
		(!attemptsCount ||
			Number(attemptsCount) <= 0 ||
			Number(attemptsCount) > TEST_CONFIG.MAX_ATTEMPTS)

	const isQuestionsBankInvalid =
		isQuestionBank &&
		(!questionsToUse ||
			Number(questionsToUse) <= 0 ||
			(totalQuestionsCount > 0 && Number(questionsToUse) > totalQuestionsCount))

	const isPassingScoreInvalid =
		hasPassingScore &&
		(!passingScore || Number(passingScore) <= 0 || Number(passingScore) > 100)

	const isTimeLimitInvalid =
		hasTimeLimit &&
		(!timeLimit || Number(timeLimit) <= 0 || Number(timeLimit) < minTimeLimit)

	const isSubmitDisabled =
		isAttemptsInvalid ||
		isQuestionsBankInvalid ||
		isPassingScoreInvalid ||
		isTimeLimitInvalid

	// Отправка
	const handleSubmit = e => {
		if (e && e.preventDefault) e.preventDefault()
		if (isSubmitDisabled) return

		const payload = {
			testId,
			hasTimeLimit,
			timeLimit: hasTimeLimit && timeLimit ? Number(timeLimit) : null,
			hasAttemptsLimit,
			attemptsCount: hasAttemptsLimit ? Number(attemptsCount) : null,
			gradingStrategy: hasAttemptsLimit ? gradingStrategy : null,
			showAnswersToStudent,
			isQuestionBank,
			questionsToUse: isQuestionBank ? Number(questionsToUse) : null,
			hasPassingScore,
			passingScore: hasPassingScore ? Number(passingScore) : null,
		}

		if (onSubmit) {
			onSubmit(payload)
		}
	}

	return {
		state: {
			testId,
			hasTimeLimit,
			timeLimit,
			hasAttemptsLimit,
			attemptsCount,
			gradingStrategy,
			showAnswersToStudent,
			isQuestionBank,
			questionsToUse,
			hasPassingScore,
			passingScore,
			editMode,
			isSubmitDisabled,
			questionsIds,
			totalQuestionsCount,
			isLoadingQuestions,
			minTimeLimit,
		},
		actions: {
			setHasTimeLimit: handleHasTimeLimitChange,
			setTimeLimit: handleTimeLimitChange,
			setHasAttemptsLimit,
			setAttemptsCount: handleAttemptsCountChange,
			setGradingStrategy,
			setShowAnswersToStudent,
			setIsQuestionBank,
			setQuestionsToUse: handleQuestionsToUseChange,
			setHasPassingScore,
			setPassingScore,
			handleSubmit,
		},
	}
}
