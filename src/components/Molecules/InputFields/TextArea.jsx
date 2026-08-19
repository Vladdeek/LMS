import { useInput } from '../../hooks/useInput'
import { InputBase } from '../atoms/InputBase'

export const TextArea = ({
	placeholder,
	title,
	required,
	validate,
	value,
	onChange,
	onStatusChange,
	readOnly = false,
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
			disabled={readOnly}
		>
			<textarea
				value={val}
				onChange={handleChange}
				readOnly={readOnly}
				placeholder={placeholder}
				maxLength={300}
				className='rounded-2xl p-3 shadow-inner outline-0 ring-0 ring-[var(--hero)] focus:ring-2 border border-[var(--black)]/2.5 transition-all resize-none min-h-25'
			/>
		</InputBase>
	)
}
