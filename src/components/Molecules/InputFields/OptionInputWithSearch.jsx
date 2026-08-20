import { useEffect, useMemo, useRef, useState } from 'react'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { useScrollListener } from '../../../hooks/useScrollListener'
import { InputBase } from '../../Atoms/InputField/InputBase'
import { Input } from './Input'

export const OptionInputWithSearch = ({
	options = [],
	placeholder = '',
	labelKey = 'name',
	onSelect,
	onCreate,
	value = null,
	title,
	required,
	CreateOrNot = false,
	formRef = null,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState(value)

	const containerRef = useRef(null)

	useEffect(() => {
		if (value) setSelected(value)
	}, [value])

	const handleClose = () => {
		setIsOpen(false)
		setSearch('')
	}

	useClickOutside(containerRef, handleClose, isOpen)
	useScrollListener(handleClose, isOpen, formRef)

	const filtered = useMemo(() => {
		return options?.filter(item =>
			item[labelKey].toLowerCase().includes(search.toLowerCase()),
		)
	}, [search, options, labelKey])

	const handleSelect = item => {
		setSelected(item)
		setSearch('')
		setIsOpen(false)
		onSelect?.(item)
	}

	return (
		<div ref={containerRef} className='w-full'>
			<InputBase title={title} required={required} status={Boolean(selected)}>
				<div className='relative w-full'>
					<div
						onClick={() => setIsOpen(prev => !prev)}
						className='flex items-center rounded-2xl shadow-inner border border-[var(--black)]/2.5 px-4 py-3 bg-[var(--white)] cursor-pointer'
					>
						<input
							readOnly
							value={selected ? selected[labelKey] : ''}
							placeholder={placeholder}
							className='w-full outline-none bg-transparent cursor-pointer'
						/>
					</div>

					{isOpen && (
						<div className='absolute w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-3xl mt-2 max-h-50 overflow-hidden z-10 flex flex-col'>
							<div className='p-2'>
								<Input
									value={search}
									onChange={e => setSearch(e.target.value)}
									placeholder='Поиск...'
									className='w-full px-3 py-2 rounded-lg outline-none bg-[var(--bg)]'
									autoFocus
								/>
							</div>

							<div className='overflow-y-scroll max-h-35'>
								{filtered?.length === 0
									? CreateOrNot && (
											<button
												type='button'
												onClick={() => {
													onCreate?.(search)
													setIsOpen(false)
												}}
												className='w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[var(--hero)] hover:text-white'
											>
												<span className='text-lg'>+</span>
												Создать "{search}"
											</button>
										)
									: filtered?.map((item, i) => (
											<button
												key={i}
												type='button'
												onClick={() => handleSelect(item)}
												className='w-full text-left px-3 py-2 hover:bg-[var(--hero)] hover:text-white cursor-pointer'
											>
												{item[labelKey]}
											</button>
										))}
							</div>
						</div>
					)}
				</div>
			</InputBase>
		</div>
	)
}
