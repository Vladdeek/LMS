import { useState } from 'react'
import { ChevronDown, ChevronUp, RussianRuble } from 'lucide-react'
import { InputBase } from '../../Atoms/InputField/InputBase'

export const InputPrice = ({
	title,
	placeholder = '0',
	value,
	onChange,
	required = false,
	min = 0,
	max,
	step = 1,
	disabled = false,
	name,
}) => {
	const [, setFocused] = useState(false)

	const handleIncrement = () => {
		if (disabled) return
		const newValue = Number(value || 0) + step
		if (max !== undefined && newValue > max) return
		onChange({ target: { name, value: String(newValue) } })
	}

	const handleDecrement = () => {
		if (disabled) return
		const newValue = Number(value || 0) - step
		if (newValue < min) return
		onChange({ target: { name, value: String(newValue) } })
	}

	return (
		<InputBase title={title} required={required} disabled={disabled}>
			<div className='relative w-full'>
				<div className='absolute left-4 text-xl top-1/2 -translate-y-1/2 text-[var(--middle)] pointer-events-none'>
					<RussianRuble size={18} strokeWidth={2.5} />
				</div>
				<input
					type='number'
					name={name}
					value={value}
					onChange={onChange}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					placeholder={placeholder}
					readOnly={disabled}
					min={min}
					max={max}
					step={step}
					className='w-full rounded-2xl p-3 pl-12 pr-14 bg-[var(--white)] text-[var(--black)] border border-[var(--black)]/2.5 placeholder:text-[var(--middle)] shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-[var(--hero)] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
				/>
				<div className='absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1'>
					<button
						type='button'
						onClick={handleIncrement}
						className='w-5 h-auto aspect-square flex items-center justify-center rounded-md bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer backdrop-blur-xl transition-all'
						tabIndex='-1'
					>
						<ChevronUp size={14} />
					</button>
					<button
						type='button'
						onClick={handleDecrement}
						className='w-5 h-auto aspect-square flex items-center justify-center rounded-md bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer backdrop-blur-xl transition-all'
						tabIndex='-1'
					>
						<ChevronDown size={14} />
					</button>
				</div>
			</div>
		</InputBase>
	)
}
