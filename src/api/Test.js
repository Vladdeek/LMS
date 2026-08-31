import { API_URL } from '../API'
import api from './client'

// ---> GetQuestions - Отдает массив id'шников вопросов теста <---
export const GetQuestions = async test_id => {
	const response = await api.get(`${API_URL}/tests/${test_id}/questions/ids`)
	return response.data
}

// ---> GetDetailQuestion - Отдает детали вопроса (сам вопрос, тип, оценку за вопрос) <---
export const GetDetailQuestion = async question_id => {
	const response = await api.get(`${API_URL}/questions/${question_id}/details`)
	return response.data
}

// ---> GetChoiceOptions - Отдает варианты ответа (choice) <---
export const GetChoiceOptions = async question_id => {
	const response = await api.get(
		`${API_URL}/questions/options/choice/${question_id}`,
	)
	return response.data
}

// ---> GetChoiceOptions - Отдает варианты ответа (matching) <---
export const GetMatchingOptions = async question_id => {
	const response = await api.get(
		`${API_URL}/questions/options/matching/${question_id}`,
	)
	return response.data
}

// ---> AddQuestion - Создает вопрос (изначально типа "open") <---
export const AddQuestion = async (test_id, type) => {
	const response = await api.post(`${API_URL}/questions/test/${test_id}`, {
		type,
	})
	return response.data
}
// ---> EditQuestion - Обновляет поле name(сам вопрос) и score(оценка) <---
export const EditQuestion = async (question_id, title, score) => {
	const response = await api.put(`${API_URL}/questions/${question_id}`, {
		title,
		score,
	})
	return response.data
}
// ---> DeleteQuestion - Удалить вопрос полностью <---
export const DeleteQuestion = async question_id => {
	const response = await api.delete(`${API_URL}/questions/${question_id}`)
	return response.data
}

// ---> AddOptionOnQuestion - создает вариант ответа <---
export const AddOptionOnQuestion = async (question_id, option_code) => {
	const response = await api.post(
		`${API_URL}/questions/options/${question_id}`,
		{ name: '', option_code },
	)
	return response.data
}

// ---> AddOptionOnQuestion - создает вариант ответа <---
export const AddOptionToMatchingQuestion = async (
	question_id,
	option_code,
	column,
) => {
	const response = await api.post(
		`${API_URL}/questions/options/matching/${question_id}`,
		{ name: '', option_code, column },
	)
	return response.data
}

// ---> CreatePair - создает пару <---
export const CreatePair = async (
	question_id,
	left_option_id,
	right_option_id,
) => {
	const response = await api.post(
		`${API_URL}/questions/options/matching/${question_id}/correct`,
		{ left_option_id, right_option_id },
	)
	return response.data
}

// ---> AddMediaToQuestion - создает пару <---
export const AddMediaToQuestion = async (question_id, file_metadata_id) => {
	const response = await api.post(`${API_URL}/questions/${question_id}/media`, {
		file_metadata_id,
	})
	return response.data
}

// ---> AddMediaToQuestion - создает пару <---
export const DeleteMediaInQuestion = async (question_id, file_metadata_id) => {
	const response = await api.delete(
		`${API_URL}/questions/${question_id}/media`,
		{
			file_metadata_id,
		},
	)
	return response.data
}

// ---> GetMaxScore - отдает настройки теста <---
export const GetMaxScore = async id => {
	const response = await api.get(
		`${API_URL}/tests/${id}/questions/max-score`,
		{},
	)
	return response.data
}

// ---> GetTestSettings - отдает настройки теста <---
export const GetTestSettings = async id => {
	const response = await api.get(`${API_URL}/tests/${id}/settings`, {})
	return response.data
}

// ---> ChangeTestSettings - изменяет настройки теста <---
export const ChangeTestSettings = async (id, data) => {
	const response = await api.put(`${API_URL}/tests/${id}/settings`, data)
	return response.data
}

// ---> EditOptionName - обновляет вариант ответа (name) <---
export const EditOptionName = async (option_id, name) => {
	const response = await api.patch(
		`${API_URL}/questions/options/${option_id}/name`,
		{ name },
	)
	return response.data
}
// ---> EditOptionCorrectStatus - обновляет статус варианта ответа (correct/) <---
export const EditOptionCorrectStatus = async (question_id, correct) => {
	const response = await api.patch(
		`${API_URL}/questions/options/${question_id}/choice/correct-status`,
		{ correct },
	)
	return response.data
}
// ---> DeleteOption - Удаляет вариант ответа <---
export const DeleteOption = async option_id => {
	const response = await api.delete(`${API_URL}/questions/options/${option_id}`)
	return response.data
}

// ---> SubmitAnswer - Отправляет ответ студента <---
export const SubmitAnswer = async (question_id, type, answer, test_id) => {
	const response = await api.post(
		`${API_URL}/test-content/question/${question_id}/student-answer/submit`,
		{
			data: { type, answer },
			test_id,
		},
	)
	return response.data
}

// ---> EditTest - Редактирование всех данных теста <---
export const EditTest = async (
	test_id,
	name,
	description,
	time_limit,
	passing_score,
) => {
	const response = await api.put(`${API_URL}/test-content/${test_id}`, {
		name,
		description,
		time_limit,
		passing_score,
	})
	return response.data
}

// ---> GetSession - Отправляет данные сессии теста <---
export const GetActiveSession = async test_id => {
	const response = await api.get(
		`${API_URL}/tests/${test_id}/student-attempt/active`,
	)
	return response.data
}
// ---> StartSession - начинает сессию тестирования <---
export const StartSession = async test_id => {
	const response = await api.post(
		`${API_URL}/tests/${test_id}/student-attempt/`,
		{},
	)
	return response.data
}

// ---> GetQuestion - начинает сессию тестирования <---
export const GetQuestion = async (test_id, attempt_id) => {
	const response = await api.get(
		`${API_URL}/tests/${test_id}/student-passing/${attempt_id}/question`,
	)
	return response.data
}

// ---> EndSession - заканчивает сессию тестирования <---
export const EndSession = async (test_id, student_attempt_id) => {
	const response = await api.post(
		`${API_URL}/tests/${test_id}/student-attempt/${student_attempt_id}/finish`,
		{},
	)
	return response.data
}
// ---> GetStudentAnswers - отдает ответы студента <---
export const GetStudentAnswer = async (test_id, question_id) => {
	const response = await api.get(
		`${API_URL}/test-content/student-session/active/${test_id}/question-answer/${question_id}`,
	)
	return response.data
}
// ---> GetResultStudentAnswers - отдает результаты тестирования студента <---
export const GetResultStudentAnswers = async test_id => {
	const response = await api.get(`${API_URL}/test-content/${test_id}/result`)
	return response.data
}

export const PostStudentAnswer = async (
	test_id,
	student_attempt_id,
	question_id,
	answers,
) => {
	const response = await api.post(
		`${API_URL}/tests/${test_id}/student-passing/${student_attempt_id}/student-answer/${question_id}`,
		{
			answers,
		},
	)
	return response.data
}

// ---> EndSession - заканчивает сессию тестирования <---
export const GetResult = async test_id => {
	const response = await api.get(`${API_URL}/tests/${test_id}/student/result`)
	return response.data
}
