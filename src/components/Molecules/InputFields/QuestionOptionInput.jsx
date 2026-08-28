import { Check, Trash2 } from 'lucide-react'
import { Input } from './Input'

export const QuestionOptionInput = ({
	value,
	isCorrect,
	disabled,
	onChangeText,
	onToggleCorrect,
	onDelete,
}) => {
	return (
		<div className='flex gap-2 w-full'>
			{/* Чекбокс */}
			<div className='flex items-center gap-3'>
				<div
					onClick={onToggleCorrect}
					className={`flex justify-center items-center aspect-square rounded-[10px] border-1 h-8 w-8 transition-all cursor-pointer 
                    ${!isCorrect ? 'bg-[var(--white)] border-[var(--black)]/2.5 shadow-inner' : 'bg-[var(--hero)] border-[var(--hero)] shadow-[var(--shadow)]'}`}
				>
					<Check className={`text-white ${!isCorrect && 'opacity-0'}`} />
				</div>
			</div>

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
					className={`flex justify-center items-center text-[var(--middle)] aspect-square rounded-xl border-1 border-[var(--black)]/2.5 h-full w-auto transition-all p-3 bg-[var(--white)] ${
						disabled
							? 'opacity-50'
							: 'hover:shadow-[var(--shadow)] hover:bg-[var(--red-base)] hover:text-[var(--red-pale)] active:shadow-inner active:scale-99 active:brightness-95 cursor-pointer'
					}`}
				>
					<Trash2 strokeWidth={1.75} />
				</button>
			</div>
		</div>
	)
}
