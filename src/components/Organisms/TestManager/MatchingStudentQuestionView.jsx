import { useState, useEffect, useMemo } from 'react'
import { MatchingStudentOptionButton } from '../../Atoms/Buttons/MatchingQuestionOptionButton'

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

export const MatchingStudentQuestionView = ({
	onAnswerChange,
	leftOptions = [],
	rightOptions = [],
}) => {
	const [selectedLeft, setSelectedLeft] = useState(null)
	const [userPairs, setUserPairs] = useState({}) // { [leftId]: rightId }

	useEffect(() => {
		setUserPairs({})
		setSelectedLeft(null)
	}, [leftOptions, rightOptions])

	// Вспомогательная функция для форматирования данных под Pydantic MatchingAnswer
	const notifyParent = updatedPairs => {
		const pairsArray = Object.entries(updatedPairs).map(([leftId, rightId]) => [
			leftId,
			rightId,
		])
		onAnswerChange?.(pairsArray)
	}

	const handleLeftClick = id => {
		if (userPairs[id]) {
			const updated = { ...userPairs }
			delete updated[id]
			setUserPairs(updated)
			notifyParent(updated)
			setSelectedLeft(null)
		} else {
			setSelectedLeft(prev => (prev === id ? null : id))
		}
	}

	const handleRightClick = rightId => {
		const existingLeftId = Object.keys(userPairs).find(
			lId => userPairs[lId] === rightId,
		)

		if (existingLeftId) {
			const updated = { ...userPairs }
			delete updated[existingLeftId]
			setUserPairs(updated)
			notifyParent(updated)
			return
		}

		if (selectedLeft) {
			const updated = { ...userPairs, [selectedLeft]: rightId }
			setUserPairs(updated)
			notifyParent(updated)
			setSelectedLeft(null)
		}
	}

	const pairColors = useMemo(() => {
		const leftColors = new Map()
		const rightColors = new Map()
		const entries = Object.entries(userPairs)
		entries.forEach(([leftId, rightId], pairIndex) => {
			const color = PAIR_COLORS[pairIndex % PAIR_COLORS.length]
			leftColors.set(String(leftId), color)
			rightColors.set(String(rightId), color)
		})
		return { leftColors, rightColors }
	}, [userPairs])

	const getLeftStyle = leftId => {
		const color = pairColors.leftColors.get(String(leftId))
		if (!color) return {}
		return {
			backgroundColor: color,
			borderColor: color,
		}
	}

	const getRightStyle = rightId => {
		const color = pairColors.rightColors.get(String(rightId))
		if (!color) return {}
		return {
			backgroundColor: color,
			borderColor: color,
		}
	}

	return (
		<div className='flex flex-col items-center gap-4 w-full'>
			<div className='grid grid-cols-2 gap-6 md:gap-8 w-full items-start'>
				{/* Левая колонка */}
				<div className='flex flex-col gap-3 w-full'>
					{leftOptions?.map(item => (
						<MatchingStudentOptionButton
							key={item.id}
							item={item}
							side='left'
							style={getLeftStyle(item.id)}
							isSelected={selectedLeft === item.id}
							isMatched={Boolean(userPairs[item.id])}
							onClick={() => handleLeftClick(item.id)}
						/>
					))}
				</div>
				{/* Правая колонка */}
				<div className='flex flex-col gap-3 w-full'>
					{rightOptions?.map(item => {
						const isMatched = Object.values(userPairs).includes(item.id)
						return (
							<MatchingStudentOptionButton
								key={item.id}
								item={item}
								side='right'
								style={getRightStyle(item.id)}
								isMatched={isMatched}
								onClick={() => handleRightClick(item.id)}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}
