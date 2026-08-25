import React from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import Modal from '../../Atoms/Modal'
import { Show } from '../../Atoms/Show'
import { Text } from '../../Atoms/Text'
import { Input } from '../../Molecules/InputFields/Input'
import { BasicPagination } from '../../Molecules/Pagination'

export const SelectGroupsModal = ({
	isOpen,
	onClose,
	unlinkedGroups,
	searchGroups,
	onSearchChange,
	page,
	onPageChange,
	onAddGroup,
}) => {
	return (
		<Modal width={'w-full max-w-lg'} isOpen={Boolean(isOpen)}>
			<Show when={Boolean(isOpen)}>
				<div className='relative flex flex-col items-center justify-center gap-4 p-2'>
					{/* Кнопка закрытия */}
					<button
						type='button'
						onClick={onClose}
						className='absolute -top-1 -right-1 p-1 text-[var(--black)] hover:text-red-500 transition-colors cursor-pointer'
					>
						<X size={20} />
					</button>

					{/* Заголовок */}
					<Text size={'xl'} font={'medium'} style={'primary'}>
						Выбор групп для доступа
					</Text>

					{/* Поиск */}
					<div className='w-full'>
						<Input
							type='text'
							placeholder='Поиск групп...'
							value={searchGroups}
							onChange={e => onSearchChange(e.target.value)}
						/>
					</div>

					{/* Список групп */}
					<div className='w-full space-y-1.5 max-h-[250px] overflow-y-auto pr-1 min-h-[150px]'>
						{unlinkedGroups?.items?.map((item, i) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.15, delay: i * 0.02 }}
							>
								<div
									onClick={() => onAddGroup(item.id)}
									className='bg-[var(--white)] rounded-lg p-2.5 px-3 cursor-pointer hover:border-[var(--hero)] border border-[var(--light-middle)]/40 transition-all flex justify-between items-center text-[var(--black)] text-xs font-medium'
								>
									<span className='truncate'>{item.name}</span>
									<span className='text-[var(--hero)] font-bold text-base'>
										+
									</span>
								</div>
							</motion.div>
						))}
					</div>

					{/* Пагинация */}
					<div className='flex justify-center pt-2 border-t border-[var(--light-middle)]/30 w-full'>
						<BasicPagination
							count={unlinkedGroups?.pages || 1}
							page={page}
							onPageChange={onPageChange}
							siblingCount={0}
						/>
					</div>
				</div>
			</Show>
		</Modal>
	)
}
