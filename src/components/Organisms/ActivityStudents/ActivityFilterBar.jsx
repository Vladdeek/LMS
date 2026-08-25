import { useState } from 'react'
import { FilterIcon } from 'lucide-react'
import { FilterOptionInput } from '../../Molecules/InputFields/FilterOptionInput'
import { SearchInput } from '../../Molecules/InputFields/SearchInput'

export const ActivityFilterBar = ({
	groups = [],
	lessons = {},
	filterOptions = {},
	selectedGroup,
	setSelectedGroup,
	selectedLesson,
	setSelectedLesson,
	selectedFilter,
	setSelectedFilter,
	searchStudents,
	setSearchStudents,
	isSearchLoading,
}) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			{/* Desktop View */}
			<div className='lg:flex hidden justify-between gap-2 w-full mb-2'>
				<div className='flex gap-2 h-full items-center min-[1800px]:w-2/5 w-full'>
					<FilterOptionInput
						Options={groups}
						color='white'
						placeholder='Группа'
						onChange={setSelectedGroup}
						value={selectedGroup}
						width='w-[175px]'
					/>
					<FilterOptionInput
						Options={Object.keys(lessons)}
						color='white'
						placeholder='Занятие'
						onChange={setSelectedLesson}
						value={selectedLesson}
						width='w-[225px]'
						showReset
					/>
					<SearchInput
						width='100%'
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading}
					/>
				</div>

				<FilterOptionInput
					Options={Object.keys(filterOptions)}
					placeholder='Фильтр'
					value={selectedFilter}
					onChange={setSelectedFilter}
					width='w-[275px]'
					showReset
				/>
			</div>

			{/* Mobile View */}
			<div className='flex justify-between gap-2 w-full mb-2 lg:hidden'>
				<div className='flex gap-2 h-full items-center min-[1800px]:w-2/5 w-full'>
					<SearchInput
						width='100%'
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading}
					/>
				</div>
				<div className='relative select-none'>
					<div
						onClick={() => setIsOpen(prev => !prev)}
						className='bg-[var(--white)] text-[var(--black)] flex justify-between gap-2 items-center rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium'
					>
						<p>Фильтры</p>
						<FilterIcon className='transition-all' />
					</div>

					{isOpen && (
						<div className='absolute bg-[var(--white)] flex flex-col gap-3 p-2 rounded-xl shadow-[var(--shadow)] h-40 hide-scrollbar w-75 right-0 top-11 z-5 text-[var(--black)]'>
							<FilterOptionInput
								Options={groups}
								color='white'
								placeholder='Группа'
								onChange={setSelectedGroup}
								value={selectedGroup}
								width='w-full'
							/>
							<FilterOptionInput
								Options={Object.keys(lessons)}
								color='white'
								placeholder='Занятие'
								onChange={setSelectedLesson}
								value={selectedLesson}
								width='w-full'
								showReset
							/>
							<FilterOptionInput
								Options={Object.keys(filterOptions)}
								placeholder='Сортировка'
								value={selectedFilter}
								onChange={setSelectedFilter}
								width='w-full'
								showReset
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
