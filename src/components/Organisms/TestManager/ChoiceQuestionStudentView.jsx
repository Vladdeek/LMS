import { motion, AnimatePresence } from 'framer-motion'
import { QuestionOptionButton } from '../../Atoms/Buttons/QuestionOptionButton'

const alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ж']

export const ChoiceQuestionStudentView = ({
	selectedOptions = new Set(), // Ожидается Set c id
	onToggleOption,
	options = [],
}) => {
	const handleOptionClick = id => {
		// Создаем новый Set на основе текущего
		const updatedSet = new Set(selectedOptions)

		// Переключаем наличие id в Set
		if (updatedSet.has(id)) {
			updatedSet.delete(id)
		} else {
			updatedSet.add(id)
		}

		// Отправляем наверх массив выбранных ID
		onToggleOption?.(Array.from(updatedSet))
	}

	return (
		<div className='flex flex-col items-center gap-3 w-full'>
			<div className='flex flex-col w-full items-center'>
				<p className='text-[var(--middle)] font-medium'>Варианты ответа</p>
			</div>

			<AnimatePresence mode='popLayout'>
				{options.map((q, i) => {
					const isSelected =
						selectedOptions instanceof Set
							? selectedOptions.has(q.id)
							: selectedOptions.includes(q.id)

					return (
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
							<p className='uppercase text-xl'>
								{(alphabet[i] || i + 1) + ').'}
							</p>
							<QuestionOptionButton
								id={q.id}
								initialText={q.name}
								onHandleAnswer={() => handleOptionClick(q.id)}
								initialIsSelected={isSelected}
							/>
						</motion.div>
					)
				})}
			</AnimatePresence>
		</div>
	)
}
