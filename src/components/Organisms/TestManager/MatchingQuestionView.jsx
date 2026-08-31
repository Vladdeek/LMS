import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import { Show } from '../../Atoms/Show'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { useUser } from '../../../context/UserContext'
import { useDebounce } from '../../../hooks/useDebounce'
import { TEST_CONFIG } from '../../../Constants/testConfig'
import {
	AddOptionToMatchingQuestion,
	DeleteOption,
	GetMatchingOptions,
	EditOptionName,
	CreatePair,
} from '../../../api/Test'
import { MatchingQuestionOptionInput } from '../../Molecules/InputFields/MatchingQuestionOptionInput'

const PAIR_COLORS = [
	'var(--pair-color-1)',
	'var(--pair-color-2)',
	'var(--pair-color-3)',
	'var(--pair-color-4)',
	'var(--pair-color-5)',
	'var(--pair-color-6)',
	'var(--pair-color-7)',
	'var(--pair-color-8)',
	'var(--pair-color-9)',
	'var(--pair-color-10)',
]

export const MatchingQuestionView = () => {
	const [searchParams] = useSearchParams()
	const activeQuestionId = searchParams.get('questionId')
	const { role } = useUser()

	const [options, setOptions] = useState({
		left_options: [],
		right_options: [],
		correct_pairs: [],
	})

	const [selectedLeftId, setSelectedLeftId] = useState(null)

	const fetchOptions = async () => {
		if (!activeQuestionId) return
		try {
			const res = await GetMatchingOptions(activeQuestionId)
			setOptions({
				left_options: res.left_options || [],
				right_options: res.right_options || [],
				correct_pairs: res.correct_pairs || [],
			})
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
		// Безопасное извлечение строки, если пришел Event
		const textValue =
			typeof newText === 'object' && newText?.target
				? newText.target.value
				: newText

		setOptions(prev => {
			const updateList = list =>
				list.map(opt => (opt.id === id ? { ...opt, name: textValue } : opt))
			return {
				...prev,
				left_options: updateList(prev.left_options),
				right_options: updateList(prev.right_options),
			}
		})
		debouncedSaveName(id, textValue)
	}

	const handleDeleteOption = async id => {
		try {
			await DeleteOption(id)
			if (selectedLeftId === id) setSelectedLeftId(null)
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

	// Клики и формирование пар
	const handleLeftClick = id => {
		if (role === 'student') return

		if (selectedLeftId === id) {
			setSelectedLeftId(null)
			return
		}

		setSelectedLeftId(id)
		toast.info('Теперь выберите подходящий элемент из правого столбца', {
			duration: 3000,
		})
	}

	const handleRightClick = async rightId => {
		if (role === 'student' || !selectedLeftId) return

		try {
			await CreatePair(activeQuestionId, selectedLeftId, rightId)
			toast.success('Пара успешно сформирована')
			setSelectedLeftId(null)
			fetchOptions()
		} catch (error) {
			console.error('Ошибка при связывании элементов:', error)
			toast.error('Не удалось создать пару')
		}
	}

	// Цвет пары определяется её позицией в correct_pairs.
	// Главное: цвет привязывается к ID элементов, а не к их index в колонке.
	const getPairColor = pairIndex => {
		if (pairIndex === -1) return null

		return PAIR_COLORS[pairIndex % PAIR_COLORS.length]
	}

	const pairColors = useMemo(() => {
		const leftColors = new Map()
		const rightColors = new Map()

		options.correct_pairs.forEach(([leftId, rightId], pairIndex) => {
			const color = getPairColor(pairIndex)

			if (!leftColors.has(leftId)) {
				leftColors.set(leftId, [])
			}

			if (!rightColors.has(rightId)) {
				rightColors.set(rightId, [])
			}

			leftColors.get(leftId).push(color)
			rightColors.get(rightId).push(color)
		})

		return {
			leftColors,
			rightColors,
		}
	}, [options.correct_pairs])

	const getLeftStyle = leftId => {
		const colors = pairColors.leftColors.get(leftId)

		if (!colors?.length) {
			return {}
		}

		const color = colors[0]

		return {
			borderColor: color,
			backgroundColor: `${color}15`,
		}
	}

	const getRightStyle = rightId => {
		const colors = pairColors.rightColors.get(rightId)

		if (!colors?.length) {
			return {}
		}

		const color = colors[0]

		return {
			borderColor: color,
			backgroundColor: `${color}15`,
		}
	}
	return (
		<div className='flex flex-col items-center gap-4 w-full'>
			<p className='text-[var(--middle)] font-medium'>
				{role === 'student'
					? 'Варианты сопоставления'
					: 'Выберите элемент слева, затем кликните по соответствующему элементу справа'}
			</p>

			<div className='grid grid-cols-2 gap-8 w-full items-start'>
				{/* Левая колонка */}
				<div className='flex flex-col gap-3 w-full'>
					{options.left_options.map((item, i) => (
						<PairItem
							key={item.id || i}
							item={item}
							side='left'
							style={getLeftStyle(item.id)}
							isSelected={selectedLeftId === item.id}
							onClick={() => handleLeftClick(item.id)}
							onChangeText={text => handleTextChange(item.id, text)}
							onDelete={() => handleDeleteOption(item.id)}
							isDeleteDisabled={
								options.left_options.length <= TEST_CONFIG.MIN_OPTION_COUNT
							}
						/>
					))}

					<Show when={role !== 'student'}>
						<SubmitButton
							invert
							onClick={() => handleCreateOption('left')}
							className='mt-2 w-[88%] flex justify-center self-end items-center gap-2'
						>
							<Plus strokeWidth={3} size={18} />
							<span>Добавить левый элемент</span>
						</SubmitButton>
					</Show>
				</div>

				{/* Правая колонка */}
				<div className='flex flex-col gap-3 w-full'>
					{options.right_options.map((item, i) => (
						<MatchingQuestionOptionInput
							key={item.id || i}
							item={item}
							side='right'
							style={getRightStyle(item.id)}
							isSelectionActive={Boolean(selectedLeftId)}
							onClick={() => handleRightClick(item.id)}
							onChangeText={text => handleTextChange(item.id, text)}
							onDelete={() => handleDeleteOption(item.id)}
							isDeleteDisabled={
								options.right_options.length <= options.left_options.length + 1
							}
						/>
					))}

					<Show when={role !== 'student'}>
						<SubmitButton
							invert
							onClick={() => handleCreateOption('right')}
							className='mt-2 w-[88%] flex justify-center self-start items-center gap-2'
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
