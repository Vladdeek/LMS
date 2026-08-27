import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
	AddOptionOnQuestion,
	EditQuestion,
	GetDetailQuestion,
} from '../../../api/Test'
import { Loader } from '../../Atoms/Loaders/Loader'
import { Show } from '../../Atoms/Show'
import { Input } from '../../Molecules/InputFields/Input'
import { ChoiceQuestionView } from './ChoiceQuestionView'
import { OpenQuestionView } from './OpenQuestionView'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { useUser } from '../../../context/UserContext'
import { useDebounce } from '../../../hooks/useDebounce'
import { Text } from '../../Atoms/Text'
import { QUESTION_TYPES } from '../../../Constants/questionTypes'
import Modal from '../../Atoms/Modal'
import { CircleHelp } from 'lucide-react'

export const TestView = ({}) => {
	const [searchParams] = useSearchParams()
	const { role } = useUser()
	const activeQuestionId = searchParams.get('questionId')
	const activeSectionId = searchParams.get('section')

	const [data, setData] = useState(null)
	const [options, setOptions] = useState([])
	const [selectedOptions, setSelectedOptions] = useState(new Set())
	const [isHelpOpen, setIsHelpOpen] = useState(false)

	const isDataLoaded = useRef(false)
	const activeQuestionIdRef = useRef(activeQuestionId)

	useEffect(() => {
		activeQuestionIdRef.current = activeQuestionId
	}, [activeQuestionId])

	const getQuestionDetails = async () => {
		try {
			const res = await GetDetailQuestion(activeQuestionId)
			setData({
				title: res?.title,
				score: res?.score,
				question_type: res?.question_type,
			})
			setOptions(res?.question_options)
			isDataLoaded.current = true
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		if (activeQuestionId) {
			isDataLoaded.current = false
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
		// 1. Собираем все существующие коды в Set для быстрого поиска
		const existingCodes = new Set(options?.map(opt => opt.option_code))

		// 2. Ищем первое число, которого нет в Set
		let newCode = 1
		while (existingCodes.has(String(newCode))) {
			newCode++
		}
		try {
			const res = await AddOptionOnQuestion(activeQuestionId, String(newCode))

			setOptions(prev => [
				...prev,
				{
					id: res.id,
					name: res.name,
					option_code: res.option_code,
					correct: false,
				},
			])
		} catch (err) {
			console.error(err)
		}
	}

	const debouncedEditQuestion = useDebounce(async (q, s) => {
		try {
			await EditQuestion(activeQuestionId, q, s)
		} catch (error) {
			console.error('Ошибка сохранения:', error)
		}
	}, 1500)

	useEffect(() => {
		debouncedEditQuestion(data?.title, data?.score)
	}, [data])

	const toggleOption = optionCode => {
		setSelectedOptions(prev => {
			const next = new Set(prev)
			next.has(optionCode) ? next.delete(optionCode) : next.add(optionCode)
			return next
		})
	}

	const submitAnswer = async () => {
		try {
			await SubmitAnswer(
				activeQuestionId,
				data.question_type,
				data.question_type === 'choice'
					? Array.from(selectedOptions)
					: data.student_answer,
				activeSectionId,
			)
		} catch (err) {
			console.log(err)
		}
	}

	if (data === null)
		return (
			<div className='w-full flex items-center justify-center h-[30vh]'>
				<Loader />
			</div>
		)
	const instruction = QUESTION_TYPES.find(
		item => item.apiType === data?.question_type,
	)?.instruction

	return (
		<>
			<Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)}>
				<div className='flex flex-col gap-4 text-[var(--black)] p-2 max-w-lg'>
					<Text
						className={'text-[var(--hero)] text-center'}
						size={'4xl'}
						font={'black'}
					>
						Инструкция
					</Text>
					<Show when={Boolean(instruction?.title)}>
						<Text size={'lg'} font={'semibold'}>
							{instruction?.title}:
						</Text>
					</Show>
					<Show when={Boolean(instruction?.steps?.length)}>
						<div className='flex flex-col gap-2.5'>
							{instruction?.steps?.map((step, idx) => (
								<div key={idx} className='flex gap-1'>
									<Show when={instruction?.steps?.length > 1}>
										<Text
											className={'text-[var(--hero)]'}
											size={'sm'}
											key={idx}
										>
											{idx + 1}.
										</Text>
									</Show>

									<Text size={'sm'} key={idx}>
										{step}
									</Text>
								</div>
							))}
						</div>
					</Show>
					<Show when={Boolean(instruction?.description)}>
						<Text style={'secondary'} size={'sm'}>
							{instruction?.description}
						</Text>
					</Show>
				</div>
			</Modal>
			<div className='w-full flex flex-col gap-6 items-center'>
				{/* Шапка вопроса */}
				<Show
					when={role !== 'student'}
					fallback={
						<p className='text-[var(--black)] font-medium text-xl'>
							{data?.title || 'Вопрос не задан'}
						</p>
					}
				>
					<Show when={role !== 'student'}>
						<Show when={data?.question_type}>
							<Text
								className={'flex gap-3 items-center'}
								style={'secondary'}
								font={'light'}
							>
								Тип вопроса:{' '}
								{QUESTION_TYPES.find(
									item => item.apiType === data?.question_type,
								)?.label || ''}
								<CircleHelp
									onClick={() => setIsHelpOpen(true)}
									size={18}
									className='text-[var(--hero)] cursor-pointer hover:scale-105 transition-all'
								/>
							</Text>
						</Show>
					</Show>
					<div className='grid gap-4 grid-cols-[1fr_auto] w-full max-w-2xl'>
						<Input
							title='Введите вопрос'
							name='title'
							value={data?.title}
							onChange={handleChange}
						/>
						<div className='w-20'>
							<Input
								title='Оценка'
								name='score'
								value={data?.score}
								onChange={handleChange}
							/>
						</div>
					</div>
				</Show>

				{/* Контент вопроса в зависимости от типа */}
				<div className='w-full max-w-2xl flex flex-col items-center gap-4'>
					<Show when={data !== null}>
						<Show when={data?.question_type === 'choice'}>
							<ChoiceQuestionView
								isEdit={role !== 'student'}
								options={options}
								selectedOptions={selectedOptions}
								onToggleOption={toggleOption}
								onAddOption={addOption}
								onOptionUpdate={getQuestionDetails}
							/>
						</Show>
						<Show when={data?.question_type === 'open'}>
							<OpenQuestionView
								isEdit={role !== 'student'}
								studentAnswer={data?.student_answer}
								onChange={handleChange}
							/>
						</Show>
					</Show>

					<Show when={role === 'student'}>
						<SubmitButton onClick={submitAnswer} className='mt-2'>
							<p>Ответить на вопрос</p>
						</SubmitButton>
					</Show>
				</div>
			</div>
		</>
	)
}
