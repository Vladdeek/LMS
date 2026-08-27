import { ChevronDown, ChevronUp } from 'lucide-react'
import { useInput } from '../../../hooks/useInput'
import { InputBase } from '../../Atoms/InputField/InputBase'

export const InputNumber = ({
	title,
	placeholder = '0',
	value,
	onChange,
	required = false,
	min,
	max,
	step = 1,
	disabled = false,
	name,
	description,
	validate,
	onStatusChange,
	width = 'w-full',
}) => {
	const {
		value: val,
		status,
		handleChange,
	} = useInput({
		value,
		validate,
		onChange,
		onStatusChange,
	})

	const handleCustomChange = e => {
		const rawValue = e.target.value

		if (rawValue === '') {
			handleChange(e)
			return
		}

		let numValue = Number(rawValue)

		// Запрещаем ввод значений больше max
		if (max !== undefined && numValue > max) {
			numValue = max
		}

		// Запрещаем ввод значений меньше min
		if (min !== undefined && numValue < min) {
			numValue = min
		}

		handleChange({
			...e,
			target: {
				...e.target,
				name,
				value: String(numValue),
			},
		})
	}

	const handleIncrement = () => {
		if (disabled) return
		const current = Number(val || 0)
		const next = current + Number(step)

		const clampedValue = max !== undefined ? Math.min(next, max) : next

		handleChange({ target: { name, value: String(clampedValue) } })
	}

	const handleDecrement = () => {
		if (disabled) return
		const current = Number(val || 0)
		const next = current - Number(step)

		const clampedValue = min !== undefined ? Math.max(next, min) : next

		handleChange({ target: { name, value: String(clampedValue) } })
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
			<div className='relative w-full'>
				<input
					type='number'
					name={name}
					value={val}
					onChange={handleCustomChange}
					placeholder={placeholder}
					readOnly={disabled}
					min={min}
					max={max}
					step={step}
					className='w-full rounded-2xl p-3 pr-10 bg-[var(--white)] text-[var(--black)] border border-[var(--black)]/2.5 placeholder:text-[var(--middle)]/50 shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-[var(--hero)] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
				/>
				<div className='absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
					<button
						type='button'
						onClick={handleIncrement}
						disabled={disabled}
						className='w-4 h-4 flex items-center justify-center rounded bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed'
						tabIndex={-1}
					>
						<ChevronUp size={12} />
					</button>
					<button
						type='button'
						onClick={handleDecrement}
						disabled={disabled}
						className='w-4 h-4 flex items-center justify-center rounded bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed'
						tabIndex={-1}
					>
						<ChevronDown size={12} />
					</button>
				</div>
			</div>
		</InputBase>
	)
}
