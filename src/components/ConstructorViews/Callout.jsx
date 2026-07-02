import {
	Asterisk,
	BadgeAlert,
	BookAlert,
	Bookmark,
	Flag,
	Megaphone,
	MessageCircleWarning,
	ShieldAlert,
	Siren,
	X,
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { RemoveButton } from './FileUploaderZone'

export const Callout = ({
	isEdit = false,
	values,
	onChange,
	onDelete,
	data,
}) => {
	// Выносим иконки в useMemo, чтобы не пересоздавать их при каждом рендере
	const icons = useMemo(
		() => [
			{
				name: 'ShieldAlert',
				icon: <ShieldAlert size={32} strokeWidth={1.5} />,
			},
			{ name: 'Megaphone', icon: <Megaphone size={32} strokeWidth={1.5} /> },
			{ name: 'Flag', icon: <Flag size={32} strokeWidth={1.5} /> },
			{ name: 'BookAlert', icon: <BookAlert size={32} strokeWidth={1.5} /> },
			{ name: 'BadgeAlert', icon: <BadgeAlert size={32} strokeWidth={1.5} /> },
			{ name: 'Siren', icon: <Siren size={32} strokeWidth={1.5} /> },
			{
				name: 'MessageCircleWarning',
				icon: <MessageCircleWarning size={32} strokeWidth={1.5} />,
			},
			{ name: 'Bookmark', icon: <Bookmark size={32} strokeWidth={1.5} /> },
			{ name: 'Asterisk', icon: <Asterisk size={32} strokeWidth={1.5} /> },
		],
		[],
	)

	const [isOpen, setIsOpen] = useState(false)

	// Инициализируем состояние из пропса values
	const [title, setTitle] = useState(values?.title || '')
	const [description, setDescription] = useState(values?.description || '')
	const [selectedIconName, setSelectedIconName] = useState(
		values?.icon || 'Megaphone',
	)

	useEffect(() => {
		if (data) {
			setTitle(data.title)
			setDescription(data.description)
			setSelectedIconName(data.icon)
		}
	}, [data])

	// Находим текущий объект иконки
	const currentIconObj =
		icons.find(i => i.name === selectedIconName) || icons[1]

	// Отправка данных наверх только в режиме редактирования при изменении полей
	useEffect(() => {
		if (isEdit) {
			onChange?.({
				icon: selectedIconName,
				title,
				description,
			})
		}
	}, [selectedIconName, title, description, isEdit])

	const handleIconSelect = name => {
		setSelectedIconName(name)
		setIsOpen(false)
	}

	// Рендер для режима ПРОСМОТРА
	if (!isEdit) {
		return (
			<div className='flex justify-center w-full'>
				<div className='flex bg-[var(--white)] shadow-[var(--shadow)] items-start rounded-xl max-lg:w-4/5 min-w-1/3 max-w-1/2 gap-3 p-4 relative'>
					<div className='text-[var(--middle)]'>{currentIconObj?.icon}</div>
					<div className='flex flex-col w-full gap-3 text-[var(--black)]'>
						<p className='text-base font-medium'>{title || 'Без заголовка'}</p>
						<p className='text-sm font-normal'>
							{description || 'Нет описания'}
						</p>
					</div>
				</div>
			</div>
		)
	}

	// Рендер для режима РЕДАКТИРОВАНИЯ
	return (
		<div className='flex gap-4'>
			<RemoveButton onDelete={onDelete} />

			<div className='flex bg-[var(--white)] shadow-[var(--shadow)] items-start rounded-xl w-1/3 gap-3 p-4 relative'>
				<button
					onClick={() => setIsOpen(prev => !prev)}
					className='relative cursor-pointer text-[var(--middle)] hover:text-[var(--black)] transition-all'
				>
					{currentIconObj?.icon}
				</button>

				{isOpen && (
					<div className='absolute top-full left-0 mt-2 z-10 grid grid-cols-3 gap-1 p-2 rounded-xl bg-[var(--white)] shadow-[var(--shadow)] min-w-max'>
						{icons.map(item => (
							<button
								key={item.name}
								className={`rounded-lg p-2 transition-all cursor-pointer ${
									selectedIconName === item.name
										? 'bg-[var(--hero-epta)] text-[var(--white)]'
										: 'bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
								}`}
								onClick={() => handleIconSelect(item.name)}
							>
								{item.icon}
							</button>
						))}
					</div>
				)}

				<div className='flex flex-col w-full gap-3 h-30'>
					<input
						type='text'
						className='text-base font-medium outline-0 text-[var(--black)] placeholder:text-[var(--middle)]'
						placeholder='Заголовок'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<textarea
						className='resize-none h-full text-sm font-normal outline-0 text-[var(--black)] placeholder:text-[var(--middle)]'
						placeholder='Описание'
						value={description}
						onChange={e => setDescription(e.target.value)}
					></textarea>
				</div>
			</div>
		</div>
	)
}
