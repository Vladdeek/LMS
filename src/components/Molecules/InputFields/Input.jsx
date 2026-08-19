import { useInput } from '../../hooks/useInput'
import { InputBase } from '../atoms/InputBase'

export const Input = ({
	type = 'text',
	placeholder,
	title,
	required,
	validate,
	onStatusChange,
	value,
	onChange,
	disabled = false,
	description,
	name,
	readOnly,
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

	return (
		<InputBase
			title={title}
			required={required}
			status={status}
			description={description}
			disabled={disabled}
			width={width}
		>
			<input
				name={name}
				type={type}
				value={val}
				onChange={handleChange}
				readOnly={readOnly || disabled}
				placeholder={placeholder}
				className='rounded-2xl p-3 bg-[var(--white)] placeholder:text-[var(--middle)]/50 text-[var(--black)] shadow-inner border border-[var(--black)]/2.5 ring-[var(--hero)] focus:ring-2 outline-0 transition-all'
			/>
		</InputBase>
	)
}
