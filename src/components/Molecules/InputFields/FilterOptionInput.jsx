import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const FilterOptionInput = ({
	Options = [],
	color = 'white',
	placeholder = '',
	onChange,
	value,
	labelKey = 'name',
	width = 'w-full',
	showReset = true,
}) => {
	const [Selected, setSelected] = useState(
		value !== undefined && value !== null
			? value
			: placeholder.length !== 0
				? null
				: 0,
	)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (value !== undefined && value !== Selected) {
			setSelected(value)
		}
	}, [value])

	useEffect(() => {
		onChange?.(Selected)
	}, [Selected])

	return (
		<div className='relative select-none'>
			<div
				onClick={() => setIsOpen(prev => !prev)}
				className={`${
					color === 'white'
						? 'bg-[var(--white)] text-[var(--black)]'
						: 'bg-[var(--black)] text-[var(--white)]'
				} flex justify-between items-center rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium ${width}`}
			>
				{Selected !== null ? (
					<span>{Options[Selected]}</span>
				) : (
					placeholder?.length && <p>{placeholder}</p>
				)}
				<ChevronDown
					className={`transition-all ${isOpen ? 'rotate-180' : ''}`}
				/>
			</div>

			{isOpen && (
				<div className='absolute bg-[var(--white)] flex flex-col rounded-lg shadow-[var(--shadow)] max-h-[220px] overflow-y-auto hide-scrollbar w-full top-11 z-10 text-[var(--black)]'>
					{Options.map((item, index) => (
						<div
							key={index}
							onClick={() => {
								setSelected(index)
								setIsOpen(false)
							}}
							className='px-3 py-2 hover:bg-[var(--light-middle)] cursor-pointer'
						>
							{typeof item === 'object' ? item[labelKey] : item}
						</div>
					))}

					{showReset && (
						<div
							onClick={() => {
								setSelected(null)
								setIsOpen(false)
							}}
							className='px-3 bg-[var(--black)] rounded-md m-1 py-2 text-center text-[var(--white)] hover:bg-red-500 hover:text-red-50 cursor-pointer font-medium transition-all'
						>
							Сбросить
						</div>
					)}
				</div>
			)}
		</div>
	)
}
