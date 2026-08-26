// ChoiceQuestionView.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { QuestionOptionButton } from '../../Atoms/Buttons/QuestionOptionButton'
import { QuestionOptionInput } from '../../Molecules/InputFields/QuestionOptionInput'
import { Show } from '../../Atoms/Show'
import { useUser } from '../../../context/UserContext'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { TEST_CONFIG } from '../../../Constants/testConfig'

export const ChoiceQuestionView = ({
	options = [],
	selectedOptions,
	onToggleOption,
	onAddOption,
	onChangeTypeToOpen,
	onOptionUpdate,
}) => {
	const { role } = useUser()
	const alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ж']
	const sortedOptions = options.sort((a, b) =>
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
						{role !== 'student' ? (
							<QuestionOptionInput
								id={q.id}
								initialText={q.name}
								initialIsCorrect={q.correct}
								onOptionUpdate={onOptionUpdate}
								disabled={options.length <= TEST_CONFIG.MIN_OPTION_COUNT}
							/>
						) : (
							<>
								<p className='uppercase text-xl'>{alphabet[i] + ').'}</p>
								<QuestionOptionButton
									id={q.id}
									initialText={q.name}
									onHandleAnswer={() => onToggleOption(q.option_code)}
									initialIsSelected={selectedOptions.has(q.option_code)}
								/>
							</>
						)}
					</motion.div>
				))}
			</AnimatePresence>
			<Show when={role !== 'student'}>
				<SubmitButton onClick={onAddOption} className='mt-2'>
					<Plus strokeWidth={3} />
					<p>Добавить вариант</p>
				</SubmitButton>
			</Show>
		</div>
	)
}
