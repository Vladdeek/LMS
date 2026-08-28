import { useEffect } from 'react'
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'
import { useInput } from '../../../hooks/useInput'
import { formatTime } from '../../../utils/formatTime'
import { InputBase } from '../../Atoms/InputField/InputBase'

export const TimeLimitInput = ({
	COUNT_QUESTION = 0,
	onChange,
	value,
	name,
	title = 'Лимит времени',
	required = false,
	disabled = false,
	description,
	validate,
	onStatusChange,
	width = 'w-full',
}) => {
	const TIME_FOR_ONE_QUESTION = 90
	const TIME_STEP = 30
	const MIN_TIME_LIMIT = COUNT_QUESTION * TIME_FOR_ONE_QUESTION

	const {
		value: val,
		status,
		handleChange,
	} = useInput({
		value: value ?? MIN_TIME_LIMIT,
		validate,
		onChange,
		onStatusChange,
	})

	const numericValue = Number(val) || 0

	useEffect(() => {
		if (numericValue < MIN_TIME_LIMIT) {
			handleChange({
				target: { name, value: String(MIN_TIME_LIMIT) },
			})
		}
	}, [COUNT_QUESTION, MIN_TIME_LIMIT])

	const handleIncrement = () => {
		if (disabled) return
		const next = numericValue + TIME_STEP
		handleChange({ target: { name, value: String(next) } })
	}

	const handleDecrement = () => {
		if (disabled) return
		const next = Math.max(MIN_TIME_LIMIT, numericValue - TIME_STEP)
		handleChange({ target: { name, value: String(next) } })
	}

	return (
		<InputBase
			title={title}
			required={required}
			status={status}
			description={description}
			disabled={disabled}
			width={width}
		>
			<div className='flex items-center gap-2 rounded-2xl p-2 pr-2.5 bg-[var(--white)] text-[var(--black)] shadow-inner border border-[var(--black)]/2.5 ring-[var(--hero)] focus-within:ring-2 outline-0 transition-all'>
				<span className='text-sm font-medium tabular-nums w-full text-center'>
					{formatTime(numericValue)}
				</span>

				<div
					className='flex flex-col gap-0.5 border-l border-[var(--light-middle)]/20 ml-1 pl-1'
					title={`Шаг изменения: ${formatTime(TIME_STEP)} \nМин. время на вопрос: ${formatTime(TIME_FOR_ONE_QUESTION)}`}
				>
					<button
						type='button'
						onClick={handleIncrement}
						disabled={disabled}
						className='w-4 h-4 flex items-center justify-center rounded bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed'
						tabIndex={-1}
					>
						<Plus size={12} />
					</button>
					<button
						type='button'
						onClick={handleDecrement}
						disabled={disabled || numericValue <= MIN_TIME_LIMIT}
						className='w-4 h-4 flex items-center justify-center rounded bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed'
						tabIndex={-1}
					>
						<Minus size={12} />
					</button>
				</div>
			</div>
		</InputBase>
	)
}
