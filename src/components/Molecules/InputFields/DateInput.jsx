import { InputBase } from '../atoms/InputBase'

export const DateInput = ({
	value,
	onChange,
	title,
	required,
	description,
	text,
}) => {
	return (
		<InputBase
			title={title}
			required={required}
			status={Boolean(value)}
			description={description}
			textStyle={text}
		>
			<input
				type='date'
				value={value || ''}
				onChange={e => onChange && onChange(e.target.value)}
				className={`w-full ${value ? 'text-[var(--black)]' : 'text-[var(--middle)]'} rounded-2xl p-3 bg-[var(--white)] shadow-inner border border-[var(--black)]/2.5`}
			/>
		</InputBase>
	)
}
