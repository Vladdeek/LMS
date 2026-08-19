import { InputLabel } from './InputLabel'

export const InputBase = ({
	title,
	required,
	status,
	description,
	disabled,
	width = 'w-full',
	children,
	textSize = 'sm',
	className = '',
}) => {
	return (
		<div
			className={`${width} flex flex-col gap-2 ${disabled ? 'opacity-50' : ''} ${className}`}
		>
			<InputLabel
				title={title}
				required={required}
				status={status}
				description={description}
				textSize={textSize}
			/>
			{children}
		</div>
	)
}
