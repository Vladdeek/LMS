import { forwardRef } from 'react'
import { X, Link2, Unlink } from 'lucide-react'
import { useUser } from '../../../../context/UserContext'
import { TextArea } from '../../../Molecules/InputFields/TextArea' // Перепуть к TextArea по аналогии
import { Show } from '../../../Atoms/Show'

export const PairItem = forwardRef(
	(
		{
			item,
			side,
			style,
			isSelected, // Выбран ли текущий элемент для соединения
			isConnected, // Соединен ли с чем-то
			connectedColor, // Опционально: цвет линии/пары
			onClick,
			onChangeText,
			onDelete,
			onUnlinkPair, // Хэндлер для отвязки пары
			isDeleteDisabled = false,
		},
		ref,
	) => {
		const { role } = useUser()
		const isStudent = role === 'student'
		const isRight = side === 'right'

		return (
			<div
				className={`flex items-center ${isRight ? 'flex-row' : 'flex-row-reverse'} gap-2 w-full group`}
			>
				{/* Основная карточка */}
				<div
					ref={ref}
					onClick={onClick}
					style={style}
					className={`relative flex ${isRight ? 'flex-row' : 'flex-row-reverse'} items-center gap-3 min-h-[52px] w-full p-2 rounded-[22px] bg-[var(--white)] border-2  shadow-sm transition-all duration-200 cursor-pointer select-none ${
						isSelected
							? 'border-[var(--hero)] ring-2 ring-[var(--hero-pale)]'
							: isConnected
								? 'border-green-500 bg-green-50/20'
								: 'border-transparent hover:border-[var(--middle)]/50'
					}`}
				>
					<div
						className='flex items-center gap-2 w-full min-w-0'
						onClick={e => e.stopPropagation()}
					>
						{isStudent ? (
							<span className='w-full truncate px-1 font-medium'>
								{item.name}
							</span>
						) : (
							<TextArea
								value={item.name || ''}
								onChange={val => onChangeText?.(val)}
								placeholder={`${!isRight ? 'Введите понятие...' : 'Введите определения...'}`}
							/>
						)}
					</div>
					{/* Кнопка отвязки пары прямо на карточке (если соединены) */}
					{isConnected && (
						<button
							type='button'
							title='Удалить связь'
							onClick={e => {
								e.stopPropagation()
								onUnlinkPair?.()
							}}
							className='p-1 hover:bg-red-100 text-[var(--middle)] hover:text-red-600 rounded-full transition-colors shrink-0'
						>
							<Unlink size={14} />
						</button>
					)}{' '}
				</div>

				{/* Кнопка полного удаления варианта (для преподавателя) */}
				<Show when={!isStudent}>
					<button
						type='button'
						disabled={isDeleteDisabled}
						onClick={e => {
							e.stopPropagation()
							onDelete?.()
						}}
						className={`flex justify-center items-center w-8 h-8 rounded-lg border border-[var(--black)]/5 bg-[var(--white)] transition-all shrink-0 ${
							isDeleteDisabled
								? 'opacity-40 cursor-not-allowed'
								: 'hover:bg-[var(--red-base)] hover:text-[var(--red-pale)] cursor-pointer active:scale-95'
						}`}
						aria-label='Удалить вариант'
					>
						<X size={16} strokeWidth={2} />
					</button>
				</Show>
			</div>
		)
	},
)

PairItem.displayName = 'PairItem'
