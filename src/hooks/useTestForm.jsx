import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TEST_CONFIG } from '../Constants/testConfig'
import { GetQuestions, GetTestSettings, ChangeTestSettings } from '../api/Test'

export const useTestForm = props => {
	const { initialData, onSubmit } = props
	const [searchParams] = useSearchParams()

	const testId = searchParams.get('section') || initialData?.id

	// Поля настроек
	const [timeLimit, setTimeLimit] = useState('')
	const [hasTimeLimit, setHasTimeLimit] = useState(false)

	const [hasAttemptsLimit, setHasAttemptsLimit] = useState(false)
	const [attemptsCount, setAttemptsCount] = useState('')

	const [showAnswersToStudent, setShowAnswersToStudent] = useState(false)
	const [gradingStrategy, setGradingStrategy] = useState('average_score')

	const [isQuestionBank, setIsQuestionBank] = useState(false)
	const [questionsToUse, setQuestionsToUse] = useState('')

	const [hasPassingScore, setHasPassingScore] = useState(false)
	const [passingScore, setPassingScore] = useState('')

	// Вопросы и загрузка
	const [questionsIds, setQuestionsIds] = useState([])
	const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
	const [isLoadingSettings, setIsLoadingSettings] = useState(false)

	const editMode = Boolean(testId)
	const totalQuestionsCount = questionsIds.length

	// 1. Загрузка настроек теста (GET)
	useEffect(() => {
		if (!testId) return

		const fetchSettings = async () => {
			setIsLoadingSettings(true)
			try {
				const settings = await GetTestSettings(testId)
				if (settings) {
					// Time Limit
					const hasTime =
						settings.time_limit_sec !== null &&
						settings.time_limit_sec !== undefined
					setHasTimeLimit(hasTime)
					setTimeLimit(hasTime ? settings.time_limit_sec : '')

					// Attempts Limit
					const hasAttempts =
						settings.max_attempts !== null &&
						settings.max_attempts !== undefined
					setHasAttemptsLimit(hasAttempts)
					setAttemptsCount(hasAttempts ? settings.max_attempts : '')

					// Assessment / Grading Strategy
					if (
						settings.assessment_method !== null &&
						settings.assessment_method !== undefined
					) {
						setGradingStrategy(settings.assessment_method)
					}

					// Question Bank Count
					const hasBank =
						settings.bank_question_count !== null &&
						settings.bank_question_count !== undefined
					setIsQuestionBank(hasBank)
					setQuestionsToUse(hasBank ? settings.bank_question_count : '')

					// Passing Score
					const hasScore =
						settings.passing_score !== null &&
						settings.passing_score !== undefined
					setHasPassingScore(hasScore)
					setPassingScore(hasScore ? settings.passing_score : '')
				}
			} catch (err) {
				console.error('Ошибка при получении настроек теста:', err)
			} finally {
				setIsLoadingSettings(false)
			}
		}

		fetchSettings()
	}, [testId])

	// 2. Загрузка списка вопросов
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

	// Обработчики ввода
	const handleTimeLimitChange = val => {
		const nextVal =
			typeof val === 'object' && val?.target ? val.target.value : val
		setTimeLimit(nextVal)
	}

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
		if (!checked) setTimeLimit('')
	}

	const handleHasAttemptsLimitChange = val => {
		const checked =
			typeof val === 'object' && val?.target ? val.target.checked : Boolean(val)
		setHasAttemptsLimit(checked)
		if (!checked) setAttemptsCount('')
	}

	const handleIsQuestionBankChange = val => {
		const checked =
			typeof val === 'object' && val?.target ? val.target.checked : Boolean(val)
		setIsQuestionBank(checked)
		if (!checked) setQuestionsToUse('')
	}

	const handleHasPassingScoreChange = val => {
		const checked =
			typeof val === 'object' && val?.target ? val.target.checked : Boolean(val)
		setHasPassingScore(checked)
		if (!checked) setPassingScore('')
	}

	// Расчет минимального времени
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
		isTimeLimitInvalid ||
		isLoadingSettings

	// 3. Отправка формы (PUT)
	const handleSubmit = async e => {
		console.log('Попытка сабмита. Состояние валидации:', {
			isSubmitDisabled,
			isAttemptsInvalid,
			isQuestionsBankInvalid,
			isPassingScoreInvalid,
			isTimeLimitInvalid,
			isLoadingSettings,
			editMode,
			testId,
		})

		if (e && e.preventDefault) e.preventDefault()

		const payload = {
			assessment_method: attemptsCount !== null ? gradingStrategy : null,
			time_limit_sec:
				hasTimeLimit && timeLimit !== '' ? Number(timeLimit) : null,
			passing_score:
				hasPassingScore && passingScore !== '' ? Number(passingScore) : null,
			max_attempts:
				hasAttemptsLimit && attemptsCount !== '' ? Number(attemptsCount) : null,
			bank_question_count:
				isQuestionBank && questionsToUse !== '' ? Number(questionsToUse) : null,
		}

		try {
			if (editMode) {
				const updatedSettings = await ChangeTestSettings(testId, payload)
				if (onSubmit) onSubmit(updatedSettings)
			} else if (onSubmit) {
				onSubmit(payload)
			}
		} catch (err) {
			console.error('Ошибка при сохранении настроек:', err)
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
			isLoadingSettings,
			minTimeLimit,
		},
		actions: {
			setHasTimeLimit: handleHasTimeLimitChange,
			setTimeLimit: handleTimeLimitChange,
			setHasAttemptsLimit: handleHasAttemptsLimitChange,
			setAttemptsCount: handleAttemptsCountChange,
			setGradingStrategy,
			setShowAnswersToStudent,
			setIsQuestionBank: handleIsQuestionBankChange,
			setQuestionsToUse: handleQuestionsToUseChange,
			setHasPassingScore: handleHasPassingScoreChange,
			setPassingScore,
			handleSubmit,
		},
	}
}
