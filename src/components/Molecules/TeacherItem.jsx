import { Ban, ChevronsRight, GripVertical } from 'lucide-react'

export const TeacherItem = ({
	id,
	name,
	onRemove,
	onAdd,
	dragged,
	Accessed,
	onDragStart,
	onDragEnd,
	isCreator,
}) => {
	const Icon = Accessed ? Ban : ChevronsRight
	const actionHandler = Accessed ? onRemove : onAdd

	const containerClass = `${
		isCreator ? 'opacity-50 pointer-events-none' : ''
	} bg-[var(--white)] shadow-[var(--shadow)] rounded-lg text-[var(--black)]`

	return (
		<>
			{/* Desktop View */}
			<div
				className={`${containerClass} max-xl:hidden grid grid-cols-9 py-[10px]`}
				draggable={!isCreator}
				onDragStart={!isCreator ? onDragStart : undefined}
				onDragEnd={!isCreator ? onDragEnd : undefined}
			>
				<p className='col-span-8 px-4'>
					{name}{' '}
					{isCreator && (
						<span className='text-[var(--middle)]'>(создатель)</span>
					)}
				</p>
				<p className='col-span-1 flex justify-center gap-3'>
					<Icon
						className='cursor-pointer'
						onClick={() => !isCreator && actionHandler?.(id)}
					/>
				</p>
			</div>

			{/* Mobile View */}
			<div
				className={`${containerClass} min-xl:hidden flex items-center justify-between p-4`}
				draggable={!isCreator}
				onDragStart={!isCreator ? onDragStart : undefined}
				onDragEnd={!isCreator ? onDragEnd : undefined}
			>
				<p className='text-2xl'>
					{name}{' '}
					{isCreator && (
						<span className='text-[var(--middle)]'>(создатель)</span>
					)}
				</p>
				<Icon
					className='cursor-pointer'
					onClick={() => !isCreator && actionHandler?.(id)}
				/>
			</div>
		</>
	)
}
