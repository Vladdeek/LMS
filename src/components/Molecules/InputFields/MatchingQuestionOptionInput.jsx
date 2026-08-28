import { Check, Trash2, X } from 'lucide-react'
import { Input } from './Input'

export const MatchingQuestionOptionInput = ({
	value,
	disabled,
	onChangeText,
	onDelete,
	column,
}) => {
	return (
		<div
			className={`flex ${column === 'left' ? 'flex-row-reverse' : 'flex-row'} gap-2 w-full`}
		>
			{/* Инпут */}
			<div className='flex-1'>
				<Input
					value={value}
					onChange={e => onChangeText(e.target.value)}
					placeholder={'Введите вариант ответа...'}
				/>
			</div>

			{/* Кнопка удаления */}
			<div className='flex items-center gap-3'>
				<button
					disabled={disabled}
					onClick={onDelete}
					className={`flex justify-center items-center text-[var(--middle)] aspect-square rounded-md border-1 border-[var(--black)]/2.5 h-3 w-3 transition-all p-0.5 bg-[var(--white)] ${
						disabled
							? 'opacity-50'
							: 'hover:shadow-[var(--shadow)] hover:bg-[var(--red-base)] hover:text-[var(--red-pale)] active:shadow-inner active:scale-99 active:brightness-95 cursor-pointer'
					}`}
				>
					<X strokeWidth={1.75} />
				</button>
			</div>
		</div>
	)
}
