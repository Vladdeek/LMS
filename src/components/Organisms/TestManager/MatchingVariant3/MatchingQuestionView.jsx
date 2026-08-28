import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Show } from '../../../Atoms/Show'
import { SubmitButton } from '../../../Atoms/Buttons/SubmitButton'
import { useUser } from '../../../../context/UserContext'
import { useDebounce } from '../../../../hooks/useDebounce'
import { TEST_CONFIG } from '../../../../Constants/testConfig'
import {
	AddOptionToMatchingQuestion,
	DeleteOption,
	GetMatchingOptions,
	EditOptionName,
} from '../../../../api/Test'
import { PairItem } from './MatchingItem'

export const MatchingQuestionView = () => {
	const [searchParams] = useSearchParams()
	const activeQuestionId = searchParams.get('questionId')
	const { role } = useUser()

	const [options, setOptions] = useState({
		left_options: [],
		right_options: [],
	})

	// Формирование и сопоставление списков левых и правых элементов на основе correct_pairs
	const alignOptions = (leftList = [], rightList = [], pairs = []) => {
		const usedLeftIds = new Set()
		const usedRightIds = new Set()

		const alignedLeft = []
		const alignedRight = []

		const leftMap = new Map(leftList.map(item => [item.id, item]))
		const rightMap = new Map(rightList.map(item => [item.id, item]))

		// 1. Заполняем пары строго друг напротив друга
		pairs.forEach(([leftId, rightId]) => {
			if (leftMap.has(leftId) && rightMap.has(rightId)) {
				alignedLeft.push(leftMap.get(leftId))
				alignedRight.push(rightMap.get(rightId))
				usedLeftIds.add(leftId)
				usedRightIds.add(rightId)
			}
		})

		// 2. Добавляем оставшиеся несвязанные левые элементы
		leftList.forEach(item => {
			if (!usedLeftIds.has(item.id)) {
				alignedLeft.push(item)
			}
		})

		// 3. Добавляем оставшиеся несвязанные правые элементы в конец правого столбца
		rightList.forEach(item => {
			if (!usedRightIds.has(item.id)) {
				alignedRight.push(item)
			}
		})

		return {
			left_options: alignedLeft,
			right_options: alignedRight,
		}
	}

	const fetchOptions = async () => {
		if (!activeQuestionId) return
		try {
			const res = await GetMatchingOptions(activeQuestionId)
			const alignedData = alignOptions(
				res.left_options,
				res.right_options,
				res.correct_pairs,
			)
			setOptions(alignedData)
		} catch (error) {
			console.error('Ошибка загрузки данных:', error)
		}
	}

	useEffect(() => {
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
		const textValue =
			typeof newText === 'object' && newText?.target
				? newText.target.value
				: newText

		setOptions(prev => {
			const updateList = list =>
				list.map(opt => (opt.id === id ? { ...opt, name: textValue } : opt))
			return {
				left_options: updateList(prev.left_options),
				right_options: updateList(prev.right_options),
			}
		})
		debouncedSaveName(id, textValue)
	}

	const handleDeleteOption = async id => {
		try {
			await DeleteOption(id)
			fetchOptions()
		} catch (err) {
			console.error('Ошибка удаления:', err)
		}
	}

	const handleCreateOption = async side => {
		try {
			await AddOptionToMatchingQuestion(activeQuestionId, '', side)
			fetchOptions()
		} catch (err) {
			console.error('Ошибка создания варианта:', err)
		}
	}

	return (
		<div className='flex flex-col items-center gap-4 w-full'>
			<div className='grid grid-cols-2 gap-8 w-full items-start'>
				{/* Левая колонка */}
				<div className='flex flex-col gap-3 w-full'>
					{options.left_options.map((item, i) => (
						<PairItem
							key={item.id || i}
							item={item}
							side='left'
							onChangeText={text => handleTextChange(item.id, text)}
							onDelete={() => handleDeleteOption(item.id)}
							isDeleteDisabled={
								options.left_options.length <= TEST_CONFIG.MIN_OPTION_COUNT
							}
						/>
					))}

					<Show when={role !== 'student'}>
						<SubmitButton
							onClick={() => handleCreateOption('left')}
							className='mt-2 w-full flex justify-center items-center gap-2'
						>
							<Plus strokeWidth={3} size={18} />
							<span>Добавить левый элемент</span>
						</SubmitButton>
					</Show>
				</div>

				{/* Правая колонка */}
				<div className='flex flex-col gap-3 w-full'>
					{options.right_options.map((item, i) => (
						<PairItem
							key={item.id || i}
							item={item}
							side='right'
							onChangeText={text => handleTextChange(item.id, text)}
							onDelete={() => handleDeleteOption(item.id)}
							isDeleteDisabled={
								options.right_options.length <= options.left_options.length + 1
							}
						/>
					))}

					<Show when={role !== 'student'}>
						<SubmitButton
							onClick={() => handleCreateOption('right')}
							className='mt-2 w-full flex justify-center items-center gap-2'
						>
							<Plus strokeWidth={3} size={18} />
							<span>Добавить правый элемент</span>
						</SubmitButton>
					</Show>
				</div>
			</div>
		</div>
	)
}
