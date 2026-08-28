import { forwardRef } from 'react'
import { GripVertical, X } from 'lucide-react'
import { useUser } from '../../../context/UserContext'
import { Input } from '../../Molecules/InputFields/Input'
import { Show } from '../../Atoms/Show'

export const PairItem = forwardRef(
	(
		{
			pair,
			index,
			side,
			moveUp,
			moveDown,
			onDragStart,
			onDrop,
			height,
			length,
			onChangeText,
			onDelete,
			isDeleteDisabled = false,
		},
		ref,
	) => {
		const { role } = useUser()
		const isRight = side === 'right'
		const isStudent = role === 'student'

		return (
			<div
				className={`flex items-center ${isRight ? 'flex-row' : 'flex-row-reverse'} gap-2`}
			>
				<div
					ref={ref}
					draggable={isRight}
					onDragStart={e => isRight && onDragStart(e, index)}
					onDragOver={e => isRight && e.preventDefault()}
					onDrop={e => isRight && onDrop(e, index)}
					style={{
						height: height ? `${height}px` : undefined,
					}}
					className='flex items-center gap-2 min-w-50 p-1 shadow-[var(--shadow)] rounded-[20px] bg-[var(--white)] cursor-default select-none overflow-hidden transition-all duration-200 w-full'
				>
					{/* Контент: Input для преподавателя / Текст для студента */}
					<div
						className={`${
							isRight ? 'col-span-7' : 'col-span-12'
						} flex items-center gap-2 w-full`}
					>
						{isStudent ? (
							<span className='w-full truncate px-2 font-medium'>{pair}</span>
						) : (
							<div className='flex items-center gap-2 w-full'>
								<Input
									value={pair || ''}
									onChange={e => onChangeText?.(e.target.value)}
									placeholder='Введите вариант ответа...'
								/>
							</div>
						)}
					</div>

					{/* Элементы управления перетаскиванием (только для правой колонки) */}
					<Show when={isRight}>
						<div className='flex items-center justify-center pr-2 cursor-grab active:cursor-grabbing text-[var(--middle)] hover:text-[var(--hero)]'>
							<GripVertical size={20} />
						</div>
					</Show>
				</div>

				{/* Кнопка удаления */}
				<Show when={!isStudent}>
					<button
						type='button'
						disabled={isDeleteDisabled}
						onClick={onDelete}
						className={`flex justify-center w-6 h-6 items-center text-[var(--middle)] aspect-square rounded-md border border-[var(--black)]/2.5 p-1 bg-[var(--white)] transition-all shrink-0 ${
							isDeleteDisabled
								? 'opacity-50 cursor-not-allowed'
								: 'hover:shadow-[var(--shadow)] hover:bg-[var(--red-base)] hover:text-[var(--red-pale)] active:shadow-inner active:scale-95 active:brightness-95 cursor-pointer'
						}`}
						aria-label='Удалить вариант'
					>
						<X size={16} strokeWidth={1.75} />
					</button>
				</Show>
			</div>
		)
	},
)

PairItem.displayName = 'PairItem'
