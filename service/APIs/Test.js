import api, { API } from '../../src/API'

// ---> GetQuestions - Отдает массив id'шников вопросов теста <---
export const GetQuestions = async test_id => {
	const response = await api.get(`${API}/test-content/content/${test_id}`)
	return response.data
}

// ---> GetDetailQuestion - Отдает детали вопроса (сам вопрос, тип, массив вариантов ответов и т.д.) <---
export const GetDetailQuestion = async question_id => {
	const response = await api.get(
		`${API}/test-content/question/${question_id}/details`,
	)
	return response.data
}
// ---> AddQuestion - Создает вопрос (изначально типа "open") <---
export const AddQuestion = async test_id => {
	const response = await api.post(`${API}/test-content/question/${test_id}`, {})
	return response.data
}
// ---> EditQuestion - Обновляет поле name(сам вопрос) и score(оценка) <---
export const EditQuestion = async (question_id, name, max_score) => {
	const response = await api.put(
		`${API}/test-content/question/${question_id}`,
		{ name, max_score },
	)
	return response.data
}
// ---> DeleteQuestion - Удалить вопрос полностью <---
export const DeleteQuestion = async question_id => {
	const response = await api.delete(
		`${API}/test-content/question/${question_id}`,
	)
	return response.data
}

// ---> EditQuestionType - Меняет тип вопроса (open <-> choice { добавляет по умолчанию два варианта ответа }) <---
export const EditQuestionType = async (question_id, type) => {
	const response = await api.patch(
		`${API}/test-content/question/${question_id}/type`,
		{ type },
	)
	return response.data
}

// ---> AddOptionOnQuestion - создает вариант ответа <---
export const AddOptionOnQuestion = async (question_id, option_code) => {
	const response = await api.post(
		`${API}/test-content/question/option/${question_id}`,
		{ name: '', option_code },
	)
	return response.data
}
// ---> EditOptionName - обновляет вариант ответа (name) <---
export const EditOptionName = async (option_id, name) => {
	const response = await api.patch(
		`${API}/test-content/question/option/${option_id}/name`,
		{ name },
	)
	return response.data
}
// ---> EditOptionCorrectStatus - обновляет статус варианта ответа (correct/) <---
export const EditOptionCorrectStatus = async (
	question_id,
	correct_option_id,
) => {
	const response = await api.patch(
		`${API}/test-content/question/${question_id}/correct-options`,
		{ correct_option_id },
	)
	return response.data
}
// ---> DeleteOption - Удаляет вариант ответа <---
export const DeleteOption = async option_id => {
	const response = await api.delete(
		`${API}/test-content/question/option/${option_id}`,
	)
	return response.data
}

// ---> SubmitAnswer - Отправляет ответ студента <---
export const SubmitAnswer = async (question_id, type, answer, test_id) => {
	const response = await api.post(
		`${API}/test-content/question/${question_id}/student-answer/submit`,
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
	const response = await api.put(`${API}/test-content/${test_id}`, {
		name,
		description,
		time_limit,
		passing_score,
	})
	return response.data
}

// ---> GetSession - Отправляет данные сессии теста <---
export const GetSession = async test_id => {
	const response = await api.get(
		`${API}/test-content/student-session/active/${test_id}`,
	)
	return response.data
}
// ---> StartSession - начинает сессию тестирования <---
export const StartSession = async test_id => {
	const response = await api.post(
		`${API}/test-content/student-session/start/${test_id}`,
		{},
	)
	return response.data
}
// ---> GetStudentAnswers - отдает ответы студента <---
export const GetStudentAnswers = async test_id => {
	const response = await api.get(
		`${API}/test-content/student-session/active/${test_id}/question-answers`,
	)
	return response.data
}
