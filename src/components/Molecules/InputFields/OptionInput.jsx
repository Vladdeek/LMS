import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { InputBase } from '../../Atoms/InputField/InputBase'

export const OptionInput = ({
	options = [],
	onChange,
	title,
	required,
	description,
}) => {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState(null)

	const handleSelect = option => {
		setSelected(option)
		setOpen(false)
		onChange?.(option)
	}

	return (
		<InputBase
			title={title}
			required={required}
			status={selected !== null}
			description={description}
			className='relative'
		>
			<div
				onClick={() => setOpen(!open)}
				className='w-full rounded-2xl p-3 bg-[var(--white)] shadow-inner border border-[var(--black)]/2.5 flex items-center justify-between cursor-pointer'
			>
				<span className={!selected ? 'text-gray-400' : ''}>
					{selected ? selected.label : 'Выбери вариант'}
				</span>
				<ChevronDown
					className={`transition-transform ${open ? 'rotate-180' : ''}`}
					size={18}
				/>
			</div>
			{open && (
				<div className='absolute top-full mt-1 w-full bg-[var(--white)] rounded-xl overflow-hidden shadow-[var(--shadow)] z-10'>
					{options.map((option, i) => (
						<div
							key={i}
							onClick={() => handleSelect(option)}
							className='px-3 py-2 hover:bg-[var(--light-middle)] cursor-pointer'
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</InputBase>
	)
}
