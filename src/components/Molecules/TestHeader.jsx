import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TestHeaderBlock } from '../Atoms/TestHeaderBlock'
import { CheckSquare, MessageSquare, ArrowRightLeft, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { AddQuestion, DeleteQuestion, GetQuestions } from '../../api/Test'
import { Show } from '../Atoms/Show'
import Modal from '../Atoms/Modal'
import { Text } from '../Atoms/Text'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'
import { toast } from 'sonner'

const QUESTION_TYPES = [
	{
		id: 'choice',
		icon: <CheckSquare size={48} />,
		label: 'Выбор ответа',
		description:
			'Тестовый вопрос с выбором одного или нескольких правильных вариантов',
		apiType: 'choice',
	},
	{
		id: 'open',
		icon: <MessageSquare size={48} />,
		label: 'Открытый ответ',
		description:
			'Вопрос, предполагающий развернутый текстовый ответ в свободной форме',
		apiType: 'open',
	},
	{
		id: 'matching',
		icon: <ArrowRightLeft size={48} />,
		label: 'Сопоставление',
		description:
			'Задание на установление соответствия между элементами двух списков',
		apiType: 'matching',
	},
]

export const TestHeader = ({ isEdit }) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const [isOpen, setIsOpen] = useState(false)
	const [questionsData, setQuestionsData] = useState([])

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

	const handleCreateQuestion = async type => {
		try {
			const res = await AddQuestion(activeSection, type)
			toast.success(
				`Вопрос типа "${QUESTION_TYPES.find(item => item.apiType === type)?.label || ''}" успешно создан!`,
			)
			setIsOpen(false)
			if (res) {
				handleBlockClick(res.id)
			}
		} catch (error) {
			toast.error('Не удалось создать вопрос!')
			console.error(error)
		}
	}
	useEffect(() => {
		const fetchAllQuestionIds = async () => {
			try {
				const res = await GetQuestions(activeSection)
				setQuestionsData(res)
			} catch (error) {
				console.error(error)
			}
		}
		fetchAllQuestionIds()
	}, [])

	return (
		<>
			<Modal width={'w-175'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<Text size={'xl'} className={'text-center'} font={'black'}>
					Создание вопроса
				</Text>
				<div className='flex items-center justify-center gap-3 w-full p-4'>
					{QUESTION_TYPES?.map((item, idx) => (
						<button
							onClick={() => handleCreateQuestion(item.apiType)}
							key={idx}
							className='bg-[var(--light-middle)]/75 rounded-2xl shadow-[var(--shadow)] text-[var(--middle)] hover:bg-[var(--hero-pale)] hover:text-[var(--hero)] flex flex-col gap-1 items-center justify-center w-full h-auto aspect-square cursor-pointer p-3 transition-all'
						>
							{item.icon}
							<Text size={'xl'} font={'black'}>
								{item.label}
							</Text>
							<Text size={'xs'} font={'light'}>
								{item.description}
							</Text>
						</button>
					))}
				</div>
			</Modal>
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

						<Show when={isEdit}>
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
									onClick={() => setIsOpen(true)} // Передаем UUID вопроса при клике
									className={`w-10 h-10 flex items-center justify-center rounded-[10px] font-semibold text-xl shadow-[var(--shadow)] select-none cursor-pointer transition-all bg-[var(--white)] text-[var(--middle)] hover:bg-[var(--hero)] hover:text-white hover:scale-101 active:scale-99 active:shadow-inner`}
								>
									<Plus strokeWidth={3} />
								</div>
							</motion.div>
						</Show>
					</div>
				)}
				<div className='flex gap-1 items-center w-fit'></div>
			</div>
		</>
	)
}
