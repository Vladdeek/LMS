import { RadioButton } from '../Atoms/Buttons/RadioButton'

export const RadioGroup = ({
	options = [], // [{ value: '1', label: 'Опция 1', icon: Icon }, ...]
	value,
	onChange,
	style = 'outline',
	sizeButton = 'md',
	rounded = 'xl',
	wfull = false,
	disabled = false,
	className = 'flex gap-3 flex-wrap',
}) => {
	return (
		<div className={className}>
			{options.map(option => {
				const isActive = option.value === value
				const Icon = option.icon

				return (
					<RadioButton
						key={option.value}
						active={isActive}
						onClick={() => onChange(option.value)}
						style={style}
						sizeButton={sizeButton}
						rounded={rounded}
						wfull={wfull}
						disabled={disabled || option.disabled}
					>
						{Icon && <Icon className='w-5 h-5' />}
						{option.label && (
							<span className='text-sm font-medium'>{option.label}</span>
						)}
						{/* Или рендерим свой custom JSX, если передан */}
						{option.children}
					</RadioButton>
				)
			})}
		</div>
	)
}
