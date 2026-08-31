import { forwardRef } from 'react'

export const MatchingStudentOptionButton = forwardRef(
	(
		{
			item,
			side,
			isSelected = false,
			isMatched = false,
			style = {},
			onClick,
			disabled = false,
		},
		ref,
	) => {
		const isRight = side === 'right'

		const getStatusStyles = () => {
			if (isSelected && !isMatched) {
				return 'border-[var(--hero)] bg-[var(--hero-pale)] text-black shadow-md'
			}
			if (isMatched) {
				return '!text-white font-semibold shadow-sm border-transparent'
			}
			return 'bg-[var(--white)] border-transparent text-black hover:border-[var(--black)]/10 shadow-sm'
		}

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				onClick={onClick}
				style={style}
				className={`relative flex items-center min-h-[52px] w-full p-3 rounded-2xl border-2 transition-all duration-150 select-none text-left cursor-pointer active:scale-[0.99] ${getStatusStyles()}`}
			>
				<span className='w-full text-sm sm:text-base break-words line-clamp-3'>
					{item?.name || (isRight ? 'Определение' : 'Понятие')}
				</span>
			</button>
		)
	},
)

MatchingStudentOptionButton.displayName = 'MatchingStudentOptionButton'
