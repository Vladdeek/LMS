import { useState } from 'react'
import { InputBase } from '../atoms/InputBase'

export const MaskInput = ({
	mask = 'XXX-XXX-XXX XX',
	onChange,
	title,
	required,
	description,
	placeholder,
}) => {
	const [value, setValue] = useState('')

	const formatValue = raw => {
		const clean = raw.replace(/\W/g, '')
		let result = ''
		let cleanIndex = 0
		for (let i = 0; i < mask.length; i++) {
			if (mask[i] === 'X') {
				if (clean[cleanIndex]) {
					result += clean[cleanIndex]
					cleanIndex++
				} else {
					break
				}
			} else {
				result += mask[i]
			}
		}
		return result
	}

	const handleChange = e => {
		const formatted = formatValue(e.target.value)
		setValue(formatted)
		onChange && onChange(formatted)
	}

	return (
		<InputBase
			title={title}
			required={required}
			status={value.length === mask.length}
			description={description}
		>
			<input
				type='text'
				value={value}
				onChange={handleChange}
				placeholder={placeholder || mask}
				className='w-full rounded-2xl p-3 bg-white shadow-inner border border-[var(--black)]/2.5'
			/>
		</InputBase>
	)
}
