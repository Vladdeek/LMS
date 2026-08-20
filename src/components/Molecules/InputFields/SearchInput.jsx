import { useEffect, useState } from 'react'
import { ScanSearch } from 'lucide-react'
import { Loader } from '../../Atoms/Loaders/Loader'

export const SearchInput = ({
	width,
	height = 'auto',
	onChange,
	value,
	loading,
}) => {
	const [isLoading, setIsLoading] = useState()

	useEffect(() => {
		setIsLoading(loading)
	}, [loading])

	return (
		<div
			className='w-[383px] max-md:w-full inline-flex group rounded-lg p-[6px] bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] gap-3 outline-0 focus:ring-1 focus:ring-[var(--hero)] transition'
			style={{ width, height }}
		>
			<ScanSearch className='h-full w-auto aspect-square' strokeWidth={1.5} />
			<input
				className='outline-0 placeholder:text-[var(--middle)] w-full'
				type='text'
				placeholder='Поиск'
				onChange={onChange}
				value={value}
			/>
			{isLoading && <Loader />}
		</div>
	)
}
