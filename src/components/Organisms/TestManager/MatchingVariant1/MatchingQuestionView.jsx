import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
import { PairItem } from './MatchingItem'

export const MatchingQuestionView = () => {
	const [searchParams] = useSearchParams()
	const activeQuestionId = searchParams.get('questionId')
	const { role } = useUser()

	const [options, setOptions] = useState({
		left_options: [],
		right_options: [],
	})

	const containerRef = useRef(null)
	const leftRefs = useRef([])
	const rightRefs = useRef([])

	// Ref для хранения предыдущего состава пар
	const prevPairsRef = useRef([])

	const fetchOptions = async () => {
		if (!activeQuestionId) return
		try {
			const res = await GetMatchingOptions(activeQuestionId)
			setOptions({
				left_options: res.left_options || [],
				right_options: res.right_options || [],
			})
		} catch (error) {
			console.error(error)
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
		setOptions(prev => {
			const updateList = list =>
				list.map(opt => (opt.id === id ? { ...opt, name: newText } : opt))
			return {
				left_options: updateList(prev.left_options),
				right_options: updateList(prev.right_options),
			}
		})
		debouncedSaveName(id, newText)
	}

	const handleDeleteOption = async id => {
		try {
			await DeleteOption(id)
			fetchOptions()
		} catch (err) {
			console.error('Ошибка удаления:', err)
		}
	}

	const getNextCode = currentOptions => {
		const existingCodes = new Set([
			...(currentOptions.left_options || []).map(opt => opt.option_code),
			...(currentOptions.right_options || []).map(opt => opt.option_code),
		])
		let newCode = 1
		while (existingCodes.has(String(newCode))) {
			newCode++
		}
		return String(newCode)
	}

	const addLeftOption = async () => {
		const newCode = getNextCode(options)
		return await AddOptionToMatchingQuestion(activeQuestionId, newCode, 'left')
	}

	const addRightOption = async () => {
		const newCode = getNextCode(options)
		return await AddOptionToMatchingQuestion(activeQuestionId, newCode, 'right')
	}

	const handleCreatePair = async () => {
		try {
			await addRightOption()
			fetchOptions()
		} catch (err) {
			console.error('Ошибка при создании пары:', err)
		}
	}

	const handleCreate = async column => {
		try {
			if (column === 'left') {
				const diff = options.right_options.length - options.left_options.length
				if (diff === 1) {
					await addLeftOption()
					await addRightOption()
				} else {
					await addLeftOption()
				}
			} else if (column === 'right') {
				await addRightOption()
			}
			fetchOptions()
		} catch (err) {
			console.error('Ошибка при создании элемента:', err)
		}
	}

	const moveRightItem = (fromIndex, toIndex) => {
		if (toIndex < 0 || toIndex >= options.right_options.length) return
		setOptions(prev => {
			const newRight = [...prev.right_options]
			const [moved] = newRight.splice(fromIndex, 1)
			newRight.splice(toIndex, 0, moved)
			return { ...prev, right_options: newRight }
		})
	}

	const handleDragStart = (e, index) => {
		e.dataTransfer.setData('text/plain', index)
	}

	const handleDrop = (e, dropIndex) => {
		e.preventDefault()
		const dragIndex = Number(e.dataTransfer.getData('text/plain'))
		if (!isNaN(dragIndex) && dragIndex !== dropIndex) {
			moveRightItem(dragIndex, dropIndex)
		}
	}

	/**
	 * Функция проверки и сравнения пар.
	 * Сравнивает текущее состояние пар с сохраненным в prevPairsRef.
	 * Выводит в консоль ТОЛЬКО те пары, которые изменились.
	 */
	/**
	 * Проверка изменений и отправка новых/измененных пар на сервер
	 */
	const checkAndSyncChangedPairs = useCallback(async () => {
		if (!activeQuestionId) return

		const maxLen = Math.max(
			options.left_options.length,
			options.right_options.length,
		)

		const currentPairs = []
		const changedPairs = []

		for (let i = 0; i < maxLen; i++) {
			const leftOpt = options.left_options[i] || null
			const rightOpt = options.right_options[i] || null

			const currentPair = {
				index: i,
				leftId: leftOpt?.id || null,
				leftName: leftOpt?.name || null,
				rightId: rightOpt?.id || null,
				rightName: rightOpt?.name || null,
			}

			currentPairs.push(currentPair)

			const prevPair = prevPairsRef.current[i]

			// Проверяем, изменилась ли пара по сравнению с предыдущим рендером
			const isChanged =
				!prevPair ||
				prevPair.leftId !== currentPair.leftId ||
				prevPair.rightId !== currentPair.rightId

			if (isChanged) {
				changedPairs.push(currentPair)
			}
		}

		// Если есть изменения — отправляем валидные пары на сервер
		if (changedPairs.length > 0) {
			console.log('Изменившиеся пары:', changedPairs)

			for (const pair of changedPairs) {
				// Пара валидна только когда присутствуют и левый, и правый ID
				if (pair.leftId && pair.rightId) {
					try {
						await CreatePair(activeQuestionId, pair.leftId, pair.rightId)
						console.log(
							`Пара успешно сохранена: ${pair.leftName} <-> ${pair.rightName}`,
						)
					} catch (error) {
						console.error('Ошибка сохранения пары:', error)
					}
				}
			}
		}

		// Обновляем ref актуальными данными
		prevPairsRef.current = currentPairs
	}, [activeQuestionId, options.left_options, options.right_options])

	// Запускаем проверку пар при изменении столбцов
	useEffect(() => {
		checkAndSyncChangedPairs()
	}, [options.right_options, checkAndSyncChangedPairs])

	return (
		<div className='flex flex-col items-center gap-3 w-full'>
			<div className='flex flex-col w-full items-center'>
				<p className='text-[var(--middle)] font-medium'>Варианты ответа</p>
			</div>

			<div
				ref={containerRef}
				className='grid grid-cols-[1fr_auto_1fr] w-full items-start'
			>
				{/* Левая колонка */}
				<div className='flex flex-col gap-3 w-full z-10'>
					<AnimatePresence mode='popLayout'>
						{options.left_options.map((q, i) => (
							<motion.div
								key={q?.id || i}
								layout
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={{ duration: 0.3, delay: i * 0.05 }}
								className='w-full'
							>
								<PairItem
									ref={el => (leftRefs.current[i] = el)}
									pair={q.name}
									index={i}
									side='left'
									isDeleteDisabled={
										options.left_options.length <= TEST_CONFIG.MIN_OPTION_COUNT
									}
									onChangeText={newText => handleTextChange(q.id, newText)}
									onDelete={() => handleDeleteOption(q.id)}
								/>
							</motion.div>
						))}
					</AnimatePresence>

					<Show when={role !== 'student'}>
						<SubmitButton
							onClick={() => handleCreate('left')}
							className='mt-2 w-full flex justify-center items-center'
						>
							<Plus strokeWidth={3} />
							<p>Добавить вариант</p>
						</SubmitButton>
					</Show>
				</div>

				{/* Центральная колонка (Разделители и Кнопка "Создать пару") */}
				<div className='flex flex-col gap-3 min-w-[5rem] h-full z-10 items-center'>
					<AnimatePresence mode='popLayout'>
						{options.left_options.map((q, i) => {
							return (
								<motion.div
									key={q?.id || i}
									layout
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0.5, opacity: 0 }}
									transition={{ duration: 0.3, delay: i * 0.05 }}
									className='w-full h-14.5 flex items-center justify-center'
								>
									<div className='w-full h-full flex items-center justify-center'>
										<div className='bg-[var(--middle)] w-1/2 h-[2px] rounded-full' />
									</div>
								</motion.div>
							)
						})}
					</AnimatePresence>
				</div>

				{/* Правая колонка */}
				<div className='flex flex-col gap-3 w-full z-10'>
					<AnimatePresence mode='popLayout'>
						{options.right_options.map((q, i) => (
							<motion.div
								key={q?.id || i}
								layout
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={{ duration: 0.3, delay: i * 0.05 }}
								className='w-full'
							>
								<PairItem
									ref={el => (rightRefs.current[i] = el)}
									pair={q.name}
									index={i}
									side='right'
									length={options.right_options.length}
									moveUp={idx => moveRightItem(idx, idx - 1)}
									moveDown={idx => moveRightItem(idx, idx + 1)}
									onDragStart={handleDragStart}
									onDrop={handleDrop}
									isDeleteDisabled={
										options.right_options.length <=
										options.left_options.length + 1
									}
									onChangeText={newText => handleTextChange(q.id, newText)}
									onDelete={() => handleDeleteOption(q.id)}
								/>
							</motion.div>
						))}
					</AnimatePresence>

					<Show when={role !== 'student'}>
						<SubmitButton
							onClick={() => handleCreate('right')}
							className='mt-2 w-full flex justify-center items-center'
						>
							<Plus strokeWidth={3} />
							<p>Добавить вариант</p>
						</SubmitButton>
					</Show>
				</div>
			</div>
		</div>
	)
}
