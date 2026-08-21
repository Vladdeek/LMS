import { useEffect, useMemo, useState } from 'react'
import { Show } from '../../Atoms/Show'

export const OptionSearch = ({
	options = [],
	placeholder = '',
	labelKey = 'name',
	onSelect,
	onCreate,
	value = null,
}) => {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [, setSelected] = useState(value)

	useEffect(() => {
		if (value) {
			setSelected(value)
			setQuery(value[labelKey] || '')
		}
	}, [value, labelKey])

	const filtered = useMemo(() => {
		return options.filter(item =>
			item[labelKey].toLowerCase().includes(query.toLowerCase()),
		)
	}, [query, options, labelKey])

	const handleSelect = item => {
		setSelected(item)
		setQuery(item[labelKey])
		setIsOpen(false)
		onSelect?.(item)
	}

	return (
		<div className='relative w-full'>
			<div className='flex items-center rounded-2xl shadow-inner px-4 py-3 bg-[var(--white)]'>
				<input
					value={query}
					onChange={e => {
						setQuery(e.target.value)
						setSelected(null)
					}}
					onFocus={() => setIsOpen(true)}
					onBlur={() => setTimeout(() => setIsOpen(false), 150)}
					placeholder={placeholder}
					className='w-full bg-transparent outline-none'
				/>
			</div>
			<Show when={isOpen}>
				<div className='absolute w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl mt-1 max-h-35 overflow-y-scroll z-10'>
					{filtered.map((item, i) => (
						<button
							key={i}
							type='button'
							onClick={() => handleSelect(item)}
							className='w-full text-left px-3 py-2 hover:bg-[var(--hero)] hover:text-white'
						>
							{item[labelKey]}
						</button>
					))}
				</div>
			</Show>
		</div>
	)
}
