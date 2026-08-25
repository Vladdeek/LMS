import { useRef, useState } from 'react'
import {
	ChevronDown,
	ChevronUp,
	Edit3,
	EllipsisVertical,
	Trash2,
} from 'lucide-react'
import { ConfirmModal } from './Modals/ConfirmModal'
import Modal from '../Atoms/Modal'
import { Text } from '../Atoms/Text'
import { Input } from '../Molecules/InputFields/Input'
import { ButtonCase } from '../Atoms/Buttons/ButtonCase'
import { LESSON_ICONS, LESSON_LABELS } from '../../Constants/lessonTypes'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useScrollListener } from '../../hooks/useScrollListener'

export const LessonItem = ({
	type,
	module_id,
	section_id,
	title,
	isSelected,
	onClick,
	role,
	score = 0,
	onChange,
	length,
	index,
}) => {
	const getStatus = s => (s >= 4 ? 'good' : s >= 3 ? 'middle' : 'bad')
	const status = getStatus(score)

	const colorClasses = {
		bad: 'bg-[var(--red-base)] text-[var(--red-surface)]',
		middle: 'bg-[var(--yellow-base)] text-[var(--yellow-surface)]',
		good: 'bg-[var(--green-base)] text-[var(--green-surface)]',
	}

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
			disabled: length === 1 || index + 1 <= 1,
		},
		{
			title: 'Вниз',
			icon: <ChevronDown size={16} />,
			active: () => handleTranslate('down'),
			disabled: length === 1 || index + 1 >= length,
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
			await deleteSection(section_id)
			onChange?.()
		} catch (err) {
			console.error(err)
		} finally {
			setModalIsOpen(null)
		}
	}

	const handleRename = async () => {
		try {
			await renameSection(section_id, newTitle)
			onChange?.()
		} catch (err) {
			console.error(err)
		} finally {
			setModalIsOpen(null)
		}
	}

	const handleTranslate = async direction => {
		try {
			await translateSection(module_id, section_id, direction)
			onChange?.()
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<>
			{/* Подтверждение удаления */}
			<ConfirmModal
				isOpen={modalIsOpen === 'delete'}
				onClose={() => setModalIsOpen(null)}
				title='Удаление элемента'
				text={`Вы действительно хотите удалить элемент «${title}»?`}
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
							Укажите новое название для элемента
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

			<div
				onClick={onClick}
				className={`flex flex-col gap-1 w-full p-3 rounded-xl transition-all shadow-[var(--shadow)] border ${
					isSelected
						? 'border-[var(--hero)] bg-[var(--transparent-hero)]'
						: 'border-transparent bg-[var(--white)] hover:bg-[var(--light-middle)]/25 cursor-pointer'
				}`}
			>
				<div className='flex items-center justify-between w-full'>
					<div className='flex items-center gap-2'>
						<span
							className={
								isSelected ? 'text-[var(--hero)]' : 'text-[var(--middle)]'
							}
						>
							{LESSON_ICONS[type]}
						</span>
						<div className='flex flex-col'>
							<span className='text-[10px] uppercase tracking-wider text-[var(--middle)] font-bold'>
								{LESSON_LABELS[type]}
							</span>
							<p className='font-medium text-sm text-[var(--black)]'>{title}</p>
						</div>
					</div>
					{role !== 'student' && (
						<button
							ref={menuRef}
							onClick={e => {
								e.stopPropagation()
								setMenuIsOpen(prev => !prev)
							}}
							className={`p-1.5 relative ${
								isSelected
									? 'hover:bg-[var(--hero)] hover:text-white'
									: 'hover:bg-[var(--light-middle)]'
							} text-[var(--black)] rounded-lg cursor-pointer transition-all`}
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
													: 'bg-[var(--bg)]/25 opacity-50 cursor-not-allowed'
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

					{type === 'test' && role === 'student' && score !== 0 && (
						<div
							className={`flex items-center justify-center h-7 w-7 rounded-md ${colorClasses[status]} text-lg font-bold`}
						>
							{score}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
