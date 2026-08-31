import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
	DeleteQuestion,
	EditQuestion,
	GetDetailQuestion,
	SubmitAnswer,
} from '../../../api/Test'
import { Loader } from '../../Atoms/Loaders/Loader'
import { Show } from '../../Atoms/Show'
import { Input } from '../../Molecules/InputFields/Input'
import { ChoiceQuestionView } from './ChoiceQuestionView'

import { useUser } from '../../../context/UserContext'
import { useDebounce } from '../../../hooks/useDebounce'
import { Text } from '../../Atoms/Text'
import { QUESTION_TYPES } from '../../../Constants/questionTypes'
import Modal from '../../Atoms/Modal'
import { CircleHelp, ImagePlus, Trash2 } from 'lucide-react'
import { ConfirmModal } from '../Modals/ConfirmModal'
import { ButtonCase } from '../../Atoms/Buttons/ButtonCase'
import { toast } from 'sonner'

import { FileUploaderZone } from '../ConstructorViews/FileUploaderZone'
import { MediaUploader } from './MediaUploader'
import { MatchingQuestionView } from './MatchingQuestionView'

export const TestView = () => {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const { role } = useUser()
	const activeQuestionId = searchParams.get('questionId')
	const activeSectionId = searchParams.get('section')

	const [data, setData] = useState(null)
	const [isHelpOpen, setIsHelpOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const handleClearQuestion = () => {
		const newParams = new URLSearchParams(searchParams)
		newParams.delete('questionId')
		setSearchParams(newParams)
	}

	const getQuestionDetails = async () => {
		try {
			const res = await GetDetailQuestion(activeQuestionId)
			setData({
				title: res?.title || '',
				score: res?.score || 0,
				media: res?.media || null,
				question_type: res?.question_type,
				student_answer: res?.student_answer || '',
			})
		} catch (err) {
			console.error('Ошибка загрузки вопроса:', err)
		}
	}

	// Загрузка деталей вопроса
	useEffect(() => {
		getQuestionDetails()
	}, [activeQuestionId])

	// Сохраняем актуальный ID в ref
	const activeQuestionIdRef = useRef(activeQuestionId)

	useEffect(() => {
		activeQuestionIdRef.current = activeQuestionId
	}, [activeQuestionId])

	const debouncedEditQuestion = useDebounce(async (title, score) => {
		// Берём id из ref на момент фактического вызова API
		const currentId = activeQuestionIdRef.current
		if (!currentId) return

		try {
			await EditQuestion(currentId, title, score)
		} catch (error) {
			console.error('Ошибка сохранения вопроса:', error)
		}
	}, 1500)

	const handleChange = e => {
		const { name, value } = e.target
		setData(prev => {
			const updated = { ...prev, [name]: value }
			if (role !== 'student') {
				debouncedEditQuestion(updated.title, updated.score)
			}
			return updated
		})
	}

	const handleDeleteQuestion = async () => {
		console.log('delete')
		try {
			await DeleteQuestion(activeQuestionId)
			handleClearQuestion()
			window.dispatchEvent(new Event('question:deleted'))
			toast.warning('Вопрос удален!')
		} catch (err) {
			toast.error('Не получилось удалить вопрос!')
			console.error('Ошибка удаления вопроса:', err)
		}
	}

	const submitAnswer = async () => {
		if (!activeQuestionId) return
		try {
			await SubmitAnswer(
				activeQuestionId,
				data.question_type,
				data.student_answer,
				activeSectionId,
			)
		} catch (err) {
			console.error('Ошибка отправки ответа:', err)
		}
	}

	useEffect(() => {
		const handleReload = () => {
			getQuestionDetails()
		}

		window.addEventListener('question:detail:update', handleReload)
		return () =>
			window.removeEventListener('question:detail:update', handleReload)
	}, [getQuestionDetails])

	if (!data) {
		return (
			<div className='w-full flex items-center justify-center h-[30vh]'>
				<Loader />
			</div>
		)
	}

	const instruction = QUESTION_TYPES.find(
		item => item.apiType === data?.question_type,
	)?.instruction

	return (
		<>
			{/* Модалка с инструкцией */}
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
										<Text className={'text-[var(--hero)]'} size={'sm'}>
											{idx + 1}.
										</Text>
									</Show>
									<Text size={'sm'}>{step}</Text>
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

			{/* Модалка подтверждения удаления */}
			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title='Удаление вопроса'
				text='Вы уверены, что хотите удалить этот вопрос? Это действие нельзя будет отменить.'
				confirmLabel='Удалить'
				confirmStyle='danger'
				action={() => handleDeleteQuestion()}
			/>

			<div className='w-full flex flex-col gap-6 items-center'>
				{/* Шапка вопроса (Заголовок / Редактирование / Удаление) */}

				<ButtonCase
					onClick={() => setIsDeleteModalOpen(true)}
					sizeButton='sm'
					backgroundColor={'var(--red-text)'}
					textColor='var(--red-bg)'
					className='self-end'
				>
					Удалить вопрос
				</ButtonCase>
				<Show
					when={role !== 'student'}
					fallback={
						<p className='text-[var(--black)] font-medium text-xl'>
							{data?.title || 'Вопрос не задан'}
						</p>
					}
				>
					<MediaUploader media={data.media} />
					<Show when={Boolean(data?.question_type)}>
						<Text
							className={'flex gap-3 items-center'}
							style={'secondary'}
							font={'light'}
						>
							Тип вопроса:{' '}
							{QUESTION_TYPES.find(item => item.apiType === data?.question_type)
								?.label || ''}
							<CircleHelp
								onClick={() => setIsHelpOpen(true)}
								size={18}
								className='text-[var(--hero)] cursor-pointer hover:scale-105 transition-all'
							/>
						</Text>
					</Show>
					<div className='grid gap-4 grid-cols-[1fr_auto_auto] items-end w-full max-w-2xl'>
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

				{/* Контент вопроса */}
				<div className='w-full max-w-2xl flex flex-col items-center gap-4'>
					<Show when={data?.question_type === 'choice'}>
						<ChoiceQuestionView />
					</Show>
					<Show when={data?.question_type === 'matching'}>
						<MatchingQuestionView />
					</Show>
				</div>
			</div>
		</>
	)
}
