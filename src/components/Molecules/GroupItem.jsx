import { Ban, ChevronsRight, GripVertical } from 'lucide-react'

export const GroupItem = ({
	id,
	number,
	lvl,
	course,
	studentsLength,
	onRemove,
	onAdd,
	dragged,
	Accessed,
	onDragStart,
	onDragEnd,
}) => {
	const Icon = Accessed ? Ban : ChevronsRight
	const actionHandler = Accessed ? onRemove : onAdd

	return (
		<>
			{/* Desktop View */}
			<div
				className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)]'
				draggable
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<p className='col-span-2 text-center'>{number}</p>
				<p className='col-span-2 text-center'>{lvl}</p>
				<p className='col-span-2 text-center'>{course}</p>
				<p className='col-span-2 text-center'>{studentsLength}</p>
				<p className='col-span-1 text-center flex justify-center gap-3'>
					<Icon
						className='cursor-pointer'
						onClick={() => actionHandler?.(id)}
					/>
				</p>
			</div>

			{/* Mobile View */}
			<div
				className='min-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] flex items-center justify-between rounded-lg p-4 text-[var(--black)]'
				draggable
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<div className='flex flex-col items-start'>
					<p className='text-center text-3xl'>{number}</p>
					<p className='text-center text-xl'>
						{course}-й курс {lvl && `(${lvl})`}
					</p>
					<p className='text-center text-lg text-[var(--middle)]'>
						Количество студентов - {studentsLength}
					</p>
				</div>
				<Icon className='cursor-pointer' onClick={() => actionHandler?.(id)} />
			</div>
		</>
	)
}
