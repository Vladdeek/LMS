import { useRef, useState } from 'react'
import {
	ChevronDown,
	ChevronUp,
	Edit3,
	EllipsisVertical,
	Package,
	Trash2,
} from 'lucide-react'

import { ConfirmModal } from './Modals/ConfirmModal'
import Modal from '../Atoms/Modal'
import { Text } from '../Atoms/Text'
import { ButtonCase } from '../Atoms/Buttons/ButtonCase'
import { Show } from '../Atoms/Show'
import { useParams } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useScrollListener } from '../../hooks/useScrollListener'
import { Input } from '../Molecules/InputFields/Input'

export const ModuleItem = ({
	title,
	index,
	id,
	isExpanded,
	onToggle,
	children,
	onChange,
	length,
}) => {
	const { courseId } = useParams()
	const { role } = useUser()
	const [menuIsOpen, setMenuIsOpen] = useState(false)
	const [modalIsOpen, setModalIsOpen] = useState(null)
	const [newTitle, setNewTitle] = useState(title)

	const menuRef = useRef(null)

	useClickOutside(menuRef, () => setMenuIsOpen(false), menuIsOpen)
	useScrollListener(() => setMenuIsOpen(false), menuIsOpen)

	const menuItems = [
		{
			title: 'Переименовать',
			icon: <Edit3 size={16} />,
			active: () => setModalIsOpen('rename'),
			disabled: false,
		},
		{
			title: 'Вверх',
			icon: <ChevronUp size={16} />,
			active: () => handleTranslate('up'),
			disabled: length === 1 || index <= 1,
		},
		{
			title: 'Вниз',
			icon: <ChevronDown size={16} />,
			active: () => handleTranslate('down'),
			disabled: length === 1 || index >= length,
		},
		{
			title: 'Удалить',
			icon: <Trash2 size={16} />,
			active: () => setModalIsOpen('delete'),
			disabled: false,
		},
	]

	const handleDelete = async () => {
		try {
			await deleteModule(id)
			onChange?.()
		} catch (err) {
			console.error(err)
		} finally {
			setModalIsOpen(null)
		}
	}

	const handleRename = async () => {
		try {
			await renameModule(id, newTitle)
			onChange?.()
		} catch (err) {
			console.error(err)
		} finally {
			setModalIsOpen(null)
		}
	}

	const handleTranslate = async direction => {
		try {
			await translateModule(courseId, id, direction)
			onChange?.()
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<>
			{/* Модалка удаления через ConfirmModal */}
			<ConfirmModal
				isOpen={modalIsOpen === 'delete'}
				onClose={() => setModalIsOpen(null)}
				title='Удаление модуля'
				text={`Вы действительно хотите удалить модуль «${title}»?`}
				confirmLabel='Удалить'
				confirmStyle='danger'
				action={handleDelete}
			/>

			{/* Модалка переименования */}
			<Modal
				width='w-125'
				isOpen={modalIsOpen === 'rename'}
				onClose={() => setModalIsOpen(null)}
			>
				<div className='flex flex-col gap-6 p-2'>
					<div className='flex flex-col gap-1'>
						<Text size='xl' font='semibold' style='primary'>
							Переименование
						</Text>
						<Text size='sm' style='secondary'>
							Укажите новое название для модуля
						</Text>
					</div>

					<Input
						title='Новое название'
						placeholder='Введите название...'
						value={newTitle}
						onChange={e => setNewTitle(e.target.value)}
						required
					/>

					<div className='flex items-center justify-end gap-3 pt-2'>
						<ButtonCase
							backgroundColor='transparent'
							textColor='var(--middle)'
							hoverStyles='hover:bg-[var(--light-middle)]'
							onClick={() => setModalIsOpen(null)}
						>
							Отмена
						</ButtonCase>
						<ButtonCase
							backgroundColor='var(--green-base)'
							textColor='var(--white)'
							hoverStyles='hover:bg-[var(--green-hover)]'
							onClick={handleRename}
						>
							Сохранить
						</ButtonCase>
					</div>
				</div>
			</Modal>

			<div className='flex flex-col gap-2 mb-4'>
				<div className='flex items-center justify-between bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-3'>
					<div className='flex items-center gap-3 text-[var(--black)]'>
						<Package size={20} className='text-[var(--middle)]' />
						<div>
							<p className='text-xs text-[var(--middle)]'>Модуль {index}</p>
							<h3 className='font-semibold text-sm leading-tight text-[var(--black)]'>
								{title}
							</h3>
						</div>
					</div>

					<div className='flex gap-1 items-center'>
						<button
							onClick={onToggle}
							className='p-1.5 hover:bg-[var(--light-middle)] text-[var(--black)] rounded-lg cursor-pointer transition-all'
						>
							<ChevronUp
								className={`${!isExpanded ? 'rotate-180' : ''} transition-all`}
								size={18}
							/>
						</button>
						{role !== 'student' && (
							<button
								ref={menuRef}
								onClick={e => {
									e.stopPropagation()
									setMenuIsOpen(prev => !prev)
								}}
								className='p-1.5 relative hover:bg-[var(--light-middle)] text-[var(--black)] rounded-lg cursor-pointer transition-all'
							>
								<EllipsisVertical size={18} />
								{menuIsOpen && (
									<div className='absolute right-0 top-8 bg-[var(--white)] shadow-[var(--shadow)] rounded-lg flex flex-col overflow-hidden z-50 min-w-[140px]'>
										{menuItems.map((item, idx) => (
											<button
												key={idx}
												type='button'
												onClick={() => {
													if (!item.disabled) item.active()
												}}
												className={`flex gap-3 items-center w-full text-left text-[var(--black)] text-sm p-2 pr-3 ${
													!item.disabled
														? item.title === 'Удалить'
															? 'hover:bg-[var(--red-status-bg)] hover:text-[var(--red-status-text)]'
															: 'hover:bg-[var(--bg)]/50'
														: 'bg-[var(--bg)]/25 cursor-not-allowed opacity-50'
												}`}
											>
												{item.icon}
												{item.title}
											</button>
										))}
									</div>
								)}
							</button>
						)}
					</div>
				</div>
				<Show when={isExpanded}>
					<div className='flex flex-col gap-2 pl-3 border-l-2 border-[var(--light-middle)] ml-2 transition-all'>
						{children}
					</div>
				</Show>
			</div>
		</>
	)
}
