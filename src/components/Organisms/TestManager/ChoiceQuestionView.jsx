import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { QuestionOptionInput } from '../../Molecules/InputFields/QuestionOptionInput'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { TEST_CONFIG } from '../../../Constants/testConfig'
import {
	AddOptionOnQuestion,
	GetChoiceOptions,
	EditOptionName,
	EditOptionCorrectStatus,
	DeleteOption,
} from '../../../api/Test'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../../hooks/useDebounce'

export const ChoiceQuestionView = ({ onOptionUpdate }) => {
	const [searchParams] = useSearchParams()
	const activeQuestionId = searchParams.get('questionId')
	const [options, setOptions] = useState([])

	useEffect(() => {
		const fetchOptions = async () => {
			if (!activeQuestionId) return
			try {
				const res = await GetChoiceOptions(activeQuestionId)
				setOptions(res)
			} catch (error) {
				console.error(error)
			}
		}
		fetchOptions()
	}, [activeQuestionId])

	const debouncedSaveName = useDebounce(async (id, newText) => {
		try {
			await EditOptionName(id, newText)
		} catch (error) {
			console.error('Ошибка сохранения названия:', error)
		}
	}, 1000)

	const handleTextChange = (id, newText) => {
		setOptions(prev =>
			prev.map(opt => (opt.id === id ? { ...opt, name: newText } : opt)),
		)
		debouncedSaveName(id, newText)
	}

	const handleToggleCorrect = async (id, currentStatus) => {
		const nextStatus = !currentStatus
		setOptions(prev =>
			prev.map(opt => (opt.id === id ? { ...opt, correct: nextStatus } : opt)),
		)

		try {
			await EditOptionCorrectStatus(id, nextStatus)
		} catch (err) {
			console.error('Ошибка переключения статуса:', err)
			setOptions(prev =>
				prev.map(opt =>
					opt.id === id ? { ...opt, correct: currentStatus } : opt,
				),
			)
		}
	}

	const handleDeleteOption = async id => {
		try {
			await DeleteOption(id)
			setOptions(prev => prev.filter(opt => opt.id !== id))
			onOptionUpdate?.()
		} catch (err) {
			console.error('Ошибка удаления:', err)
		}
	}

	const addOption = async () => {
		const existingCodes = new Set(options?.map(opt => opt.option_code))
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

	const sortedOptions = [...options].sort((a, b) =>
		a.option_code.localeCompare(b.option_code, undefined, { numeric: true }),
	)

	return (
		<div className='flex flex-col items-center gap-3 w-full'>
			<div className='flex flex-col w-full items-center'>
				<p className='text-[var(--middle)] font-medium'>Варианты ответа</p>
			</div>

			<AnimatePresence mode='popLayout'>
				{sortedOptions.map((q, i) => (
					<motion.div
						key={q.id}
						layout
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.5, opacity: 0 }}
						transition={{
							duration: 0.3,
							delay: i * 0.05,
							ease: 'easeOut',
						}}
						className='w-full flex items-center gap-3'
					>
						<QuestionOptionInput
							value={q.name}
							isCorrect={q.correct}
							disabled={options.length <= TEST_CONFIG.MIN_OPTION_COUNT}
							onChangeText={newText => handleTextChange(q.id, newText)}
							onToggleCorrect={() => handleToggleCorrect(q.id, q.correct)}
							onDelete={() => handleDeleteOption(q.id)}
						/>
					</motion.div>
				))}
			</AnimatePresence>

			<SubmitButton
				onClick={addOption}
				className='mt-2 w-full flex justify-center items-center'
			>
				<Plus strokeWidth={3} />
				<p>Добавить вариант</p>
			</SubmitButton>
		</div>
	)
}
