import { Check, Trash2 } from 'lucide-react'
import { Input } from './Input'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useDebounce } from '../../../hooks/useDebounce'
import {
	DeleteOption,
	EditOptionCorrectStatus,
	EditOptionName,
} from '../../../api/Test'

export const QuestionOptionInput = ({
	id,
	initialText,
	initialIsCorrect,
	disabled,
	onOptionUpdate, // Колбэк для обновления данных в родителе (опционально)
	isEdit,
}) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const [textValue, setTextValue] = useState(initialText)
	const [isCorrect, setIsCorrect] = useState(initialIsCorrect)
	const activeQuestionId = searchParams.get('questionId')

	const editOptionName = async newText => {
		try {
			await EditOptionName(id, newText)
		} catch (error) {
			console.error('Ошибка имени:', error)
		}
	}

	// Дебаунс для текста
	const debouncedSaveName = useDebounce(async newText => {
		editOptionName(newText)
	}, 1000)

	const handleTextChange = e => {
		const val = e.target.value
		setTextValue(val)
		debouncedSaveName(val)
	}

	// Обработка чекбокса внутри компонента
	const handleToggleCorrect = async () => {
		setIsCorrect(prev => !prev)

		try {
			await EditOptionCorrectStatus(id, !isCorrect)
		} catch (err) {
			console.error(err)
			setIsCorrect(prev => !prev)
		}
	}

	const handleDelete = async () => {
		try {
			await DeleteOption(id)
			onOptionUpdate?.() // Оповещаем родителя, чтобы он обновил список
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className='flex gap-2 w-full'>
			{/* Чекбокс */}
			<div className='flex items-center gap-3'>
				<div
					onClick={handleToggleCorrect}
					className={`flex justify-center items-center aspect-square rounded-[10px] border-1 h-8 w-8 transition-all cursor-pointer 
                    ${!isCorrect ? 'bg-[var(--white)] border-[var(--black)]/2.5 shadow-inner' : 'bg-[var(--hero)] border-[var(--hero)] shadow-[var(--shadow)]'}`}
				>
					<Check className={`text-white ${!isCorrect && 'opacity-0'}`} />
				</div>
			</div>

			{/* Инпут с дебаунсом */}
			<div className='flex-1'>
				<Input
					value={textValue}
					onChange={handleTextChange}
					placeholder={'Введите вариант ответа...'}
				/>
			</div>

			{/* Кнопка удаления */}
			<div className='flex items-center gap-3'>
				<button
					disabled={disabled}
					onClick={() => handleDelete(id)}
					className={`flex justify-center items-center text-[var(--middle)] aspect-square rounded-xl border-1 border-[var(--black)]/2.5 h-full w-auto transition-all p-3 bg-[var(--white)] ${disabled ? 'opacity-50' : 'hover:shadow-[var(--shadow)] hover:bg-[var(--red-base)] hover:text-[var(--red-pale)] active:shadow-inner active:scale-99 active:brightness-95 cursor-pointer'}`}
				>
					<Trash2 strokeWidth={1.75} />
				</button>
			</div>
		</div>
	)
}
