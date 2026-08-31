import { useState, useEffect, useCallback } from 'react'
import {
	GetActiveSession,
	StartSession,
	GetQuestion,
	PostStudentAnswer,
	EndSession,
	GetResult,
} from '../api/Test'

export const useTestSession = testId => {
	const [session, setSession] = useState(null)
	const [resultData, setResultData] = useState(null)
	const [questionData, setQuestionData] = useState(null)
	const [studentAnswer, setStudentAnswer] = useState(null)
	const [selectedOptions, setSelectedOptions] = useState(new Set())
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState(null)

	const handleEndSession = useCallback(async () => {
		if (!session?.id) return
		try {
			await EndSession(testId, session.id)
			setSession(null)
			setQuestionData(null)
			setStudentAnswer(null)
			// После завершения запрашиваем обновленные результаты
			const res = await GetResult(testId)
			setResultData(res)
		} catch (err) {
			console.error('Failed to end session:', err)
		}
	}, [testId, session?.id])

	const fetchQuestion = useCallback(
		async attemptId => {
			if (!testId || !attemptId) return
			try {
				const res = await GetQuestion(testId, attemptId)
				setQuestionData(res)
			} catch (err) {
				console.error(err?.response?.data?.detail)
				if (err?.response?.data?.detail === 'Question not found by ID: ') {
					await handleEndSession()
				}
			}
		},
		[testId, handleEndSession],
	)

	const fetchSession = useCallback(async () => {
		if (!testId) return
		setIsLoading(true)
		try {
			const res = await GetActiveSession(testId)
			setSession(res)
			setError(null)

			if (!res) {
				try {
					const resResult = await GetResult(testId)
					setResultData(resResult)
				} catch (resultErr) {
					console.error('Failed to get result:', resultErr)
				}
			}
			return res
		} catch (err) {
			console.error('Failed to get active session:', err)
			setError(err)
			try {
				const resResult = await GetResult(testId)
				setResultData(resResult)
			} catch (resultErr) {
				console.error('Failed to get result:', resultErr)
			}
		} finally {
			setIsLoading(false)
		}
	}, [testId])

	useEffect(() => {
		fetchSession()
	}, [fetchSession])

	useEffect(() => {
		if (session?.id) {
			fetchQuestion(session.id)
		}
	}, [session?.id, fetchQuestion])

	const startSession = async () => {
		if (!testId) return
		setIsLoading(true)
		try {
			const newSession = await StartSession(testId)
			setSession(newSession)
			setError(null)
			if (newSession?.id) {
				await fetchQuestion(newSession.id)
			}
			return newSession
		} catch (err) {
			console.error('Failed to start session:', err)
			setError(err)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const submitAnswer = async () => {
		if (isSubmitting || !session?.id || !questionData?.id) return
		setIsSubmitting(true)
		try {
			await PostStudentAnswer(
				testId,
				session.id,
				questionData.id,
				studentAnswer,
			)
			setStudentAnswer(null)

			if (questionData?.next_question_id === null) {
				await handleEndSession()
			} else {
				await fetchQuestion(session.id)
			}
		} catch (err) {
			console.error(err?.response?.data?.detail)
			if (err?.response?.data?.detail === 'Student answer already exists') {
				await handleEndSession()
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const isLastQuestion = questionData?.next_question_id === null

	return {
		session,
		resultData,
		questionData,
		studentAnswer,
		setStudentAnswer,
		selectedOptions,
		setSelectedOptions,
		isLoading,
		isSubmitting,
		isLastQuestion,
		error,
		startSession,
		submitAnswer,
		handleEndSession,
		refetchSession: fetchSession,
	}
}
