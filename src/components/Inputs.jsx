import { Check, EyeOff, Minus, Plus, Trash2 } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { RussianRuble } from 'lucide-react'
import { ChevronUp } from 'lucide-react'
import { Eye } from 'lucide-react'
import { CircleCheck, ImagePlus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useClickOutside } from '../../service/Hooks/useClickOutside'
import { useScrollListener } from '../../service/Hooks/useScrollListener'
import { useDebounce } from '../../service/Hooks/useDebounce'
import { DeleteOption, EditOptionName } from '../../service/APIs/Test'
import { formatTime } from '../../service/utils/formatTime'

export const useInput = ({ value, validate, onChange, onStatusChange }) => {
	const [internalValue, setInternalValue] = useState(value || '')
	const [status, setStatus] = useState(false)

	useEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const handleChange = e => {
		const val = e.target.value
		setInternalValue(val)

		onChange?.(e)

		const newStatus = validate ? validate(val) : val.trim() !== ''
		setStatus(newStatus)
		onStatusChange?.(newStatus)
	}

	return {
		value: internalValue,
		status,
		handleChange,
	}
}

export const InputDefault = ({
	type = 'text',
	placeholder,
	title,
	required,
	validate,
	onStatusChange,
	value,
	onChange,
	disabled = false,
	description,
	name,
	readOnly,
	width = 'w-full',
}) => {
	const {
		value: val,
		status,
		handleChange,
	} = useInput({
		value,
		validate,
		onChange,
		onStatusChange,
		required,
	})

	return (
		<div className={`{width} flex flex-col gap-2 ${disabled && 'opacity-50'}`}>
			{title && (
				<div className='flex items-center gap-2 ml-1'>
					<p className={`text-[18px] text-[var(--middle)] pt-[2px]`}>{title}</p>
					{required && (
						<CircleCheck
							className={`${status ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}
			{description && (
				<p className={`text-sm text-[var(--middle)] pt-[2px] ml-1`}>
					{description}
				</p>
			)}

			<input
				name={name}
				type={type}
				value={val}
				onChange={handleChange}
				readOnly={readOnly || disabled}
				placeholder={placeholder}
				className='rounded-2xl p-3 bg-[var(--white)] placeholder:text-[var(--middle)]/50 text-[var(--black)] shadow-inner border-1 ring-[var(--hero)] focus:ring-2 outline-0 border-[var(--black)]/2.5 transition-all'
			/>
		</div>
	)
}

export const TimeLimitInput = ({ COUNT_QUESTION = 0, onChange, value }) => {
	const [time, setTime] = useState(0)

	const TIME_FOR_ONE_QUESTION = 90
	const TIME_STEP = 30
	const MIN_TIME_LIMIT = COUNT_QUESTION * TIME_FOR_ONE_QUESTION

	useEffect(() => {
		if (!value) {
			if (COUNT_QUESTION > 0) setTime(MIN_TIME_LIMIT)
		} else if (value) {
			if (value < MIN_TIME_LIMIT) {
				setTime(MIN_TIME_LIMIT)
			} else {
				setTime(value)
			}
		}
	}, [COUNT_QUESTION])

	useEffect(() => {
		onChange?.(time)
	}, [time])

	return (
		<div className='flex flex-col gap-1'>
			<label className='text-xs text-end font-medium text-[var(--black)]/60'>
				Лимит времени на тест
			</label>

			<div className='flex items-center w-fit px-2 py-1 border border-[var(--light-middle)]/25 bg-[var(--white)] rounded-md shadow-inner'>
				<span className='text-sm font-medium tabular-nums w-30 text-center'>
					{formatTime(time)}
				</span>

				{/* Контейнер кнопок с подсказкой */}
				<div
					className='flex flex-col border-l border-[var(--light-middle)]/20 ml-1 pl-1'
					title={`Шаг изменения: ${formatTime(TIME_STEP)} \nМин. время на вопрос: ${formatTime(TIME_FOR_ONE_QUESTION)}`}
				>
					<Plus
						onClick={() => setTime(prev => prev + TIME_STEP)}
						size={14}
						className='cursor-pointer hover:text-[var(--primary)] transition-colors'
					/>
					<Minus
						onClick={() =>
							time > MIN_TIME_LIMIT && setTime(prev => prev - TIME_STEP)
						}
						size={14}
						className={`cursor-pointer transition-colors ${time <= MIN_TIME_LIMIT ? 'opacity-20 cursor-default' : 'hover:text-[var(--primary)]'}`}
					/>
				</div>
			</div>
		</div>
	)
}

export const FileInput = ({
	onChange,
	title,
	required,
	description,
	accept,
}) => {
	const [fileName, setFileName] = useState('')

	const handleChange = e => {
		const file = e.target.files[0]

		if (file) {
			setFileName(file.name)
			onChange && onChange(file)
		}
	}

	return (
		<div className='flex flex-col gap-2'>
			{title && (
				<div className='flex items-center gap-2 ml-1'>
					<p className={`text-[18px] text-[var(--middle)] pt-[2px]`}>{title}</p>
					{required && (
						<CircleCheck
							className={`${fileName.length > 0 ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}

			{description && (
				<p className={`text-sm text-[var(--middle)] pt-[2px] ml-1`}>
					{description}
				</p>
			)}
			<div className='relative w-full'>
				<input
					type='text'
					value={fileName}
					readOnly
					accept={accept}
					placeholder='Файл не выбран'
					className='w-full rounded-2xl p-3 pr-32 bg-[var(--white)] shadow-inner border border-[var(--black)]/2.5'
				/>

				<label className='absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer px-3 py-2.75 bg-black text-white rounded-xl text-sm'>
					Выбрать файл
					<input type='file' onChange={handleChange} className='hidden' />
				</label>
			</div>
		</div>
	)
}

export const OptionInput = ({
	options = [],
	onChange,
	title,
	required,
	description,
}) => {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState(null)
	const handleSelect = option => {
		setSelected(option)
		setOpen(false)
		onChange && onChange(option)
	}
	return (
		<div className='flex flex-col gap-2 relative'>
			{title && (
				<div className='flex items-center gap-2 ml-1'>
					<p className={`text-[18px] text-[var(--middle)] pt-[2px]`}>{title}</p>
					{required && (
						<CircleCheck
							className={`${selected !== null ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}
			{description && (
				<p className='text-sm text-[var(--middle)] ml-1'>{description}</p>
			)}
			<div
				onClick={() => setOpen(!open)}
				className='w-full rounded-2xl p-3 bg-[var(--white)] shadow-inner border border-[var(--black)]/2.5 flex items-center justify-between cursor-pointer'
			>
				<span className={`${!selected && 'text-gray-400'}`}>
					{selected ? selected.label : 'Выбери вариант'}
				</span>
				<ChevronDown
					className={`transition-transform ${open ? 'rotate-180' : ''}`}
					size={18}
				/>
			</div>
			{open && (
				<div className='absolute top-full mt-1 w-full bg-[var(--white)] rounded-xl overflow-hidden shadow-[var(--shadow)] z-10'>
					{options.map((option, i) => (
						<div
							key={i}
							onClick={() => handleSelect(option)}
							className='px-3 py-2 hover:bg-[var(--light-middle)] cursor-pointer'
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export const DateInput = ({
	value,
	onChange,
	title,
	required,
	description,
	text,
}) => {
	return (
		<div className='flex flex-col gap-2'>
			{title && (
				<div className='flex items-center gap-2 ml-1'>
					<p
						className={`${text ? text : 'text-[18px]'} text-[var(--middle)] pt-[2px]`}
					>
						{title}
					</p>
					{required && (
						<CircleCheck
							className={`${value ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}
			{description && (
				<p className='text-sm text-[var(--middle)] ml-1'>{description}</p>
			)}
			<input
				type='date'
				value={value || ''}
				onChange={e => onChange && onChange(e.target.value)}
				className={`w-full  ${value ? 'text-[var(--black)]' : 'text-[var(--middle)]'} rounded-2xl p-3 bg-[var(--white)] shadow-inner border-1 border-[var(--black)]/2.5`}
			/>
		</div>
	)
}

export const MaskInput = ({
	mask = 'XXX-XXX-XXX XX',
	onChange,
	title,
	required,
	description,
	placeholder,
}) => {
	const [value, setValue] = useState('')
	const formatValue = raw => {
		const clean = raw.replace(/\W/g, '') // убираем всё кроме букв/цифр
		let result = ''
		let cleanIndex = 0
		for (let i = 0; i < mask.length; i++) {
			if (mask[i] === 'X') {
				if (clean[cleanIndex]) {
					result += clean[cleanIndex]
					cleanIndex++
				} else {
					break
				}
			} else {
				result += mask[i]
			}
		}
		return result
	}
	const handleChange = e => {
		const raw = e.target.value
		const formatted = formatValue(raw)
		setValue(formatted)
		onChange && onChange(formatted)
	}
	return (
		<div className='flex flex-col gap-2'>
			{title && (
				<div className='flex items-center gap-2 ml-1'>
					<p className='text-sm text-[var(--black)]'>{title}</p>
					{required && (
						<CircleCheck
							className={`${
								value.length === mask.length
									? 'text-green-500'
									: 'text-[var(--middle)]'
							}`}
							size={16}
						/>
					)}
				</div>
			)}
			{description && (
				<p className='text-sm text-[var(--middle)] ml-1'>{description}</p>
			)}
			<input
				type='text'
				value={value}
				onChange={handleChange}
				placeholder={placeholder || mask}
				className='w-full rounded-2xl p-3 bg-white shadow-inner border border-[var(--black)]/2.5'
			/>
		</div>
	)
}

export const InputPrice = ({
	title,
	placeholder = '0',
	value,
	onChange,
	required = false,
	min = 0,
	max,
	step = 1,
	disabled = false,
	name,
}) => {
	const [focused, setFocused] = useState(false)
	const handleIncrement = () => {
		if (disabled) return
		const newValue = Number(value || 0) + step
		if (max !== undefined && newValue > max) return
		onChange({
			target: {
				name,
				value: String(newValue),
			},
		})
	}
	const handleDecrement = () => {
		if (disabled) return
		const newValue = Number(value || 0) - step
		if (newValue < min) return
		onChange({
			target: {
				name,
				value: String(newValue),
			},
		})
	}
	return (
		<div className={`w-full flex flex-col ${disabled && 'opacity-50'}`}>
			{title && (
				<div className='flex items-center gap-2 ml-1 mb-1'>
					<p className='text-[18px] text-[var(--black)] pt-[2px]'>{title}</p>
				</div>
			)}
			<div className='relative w-full'>
				<div className='absolute left-4 text-xl top-1/2 -translate-y-1/2 text-[var(--middle)] pointer-events-none'>
					<RussianRuble size={18} strokeWidth={2.5} />
				</div>
				<input
					type='number'
					name={name}
					value={value}
					onChange={onChange}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					placeholder={placeholder}
					readOnly={disabled}
					min={min}
					max={max}
					step={step}
					className='w-full rounded-2xl p-3 pl-12 pr-14 bg-[var(--white)] text-[var(--black)] border border-[var(--black)]/2.5 placeholder:text-[var(--middle)] shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-[var(--hero)] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
				/>
				{/* Кастомные стрелки */}
				<div className='absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1'>
					<button
						type='button'
						onClick={handleIncrement}
						className='w-5 h-auto aspect-square flex items-center justify-center rounded-md bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer backdrop-blur-xl transition-all'
						tabIndex='-1'
					>
						<ChevronUp size={14} />
					</button>
					<button
						type='button'
						onClick={handleDecrement}
						className='w-5 h-auto aspect-square flex items-center justify-center rounded-md bg-[var(--light-middle)] text-[var(--middle)] hover:bg-[var(--hero)] shadow-xs opacity-75 hover:opacity-100 hover:text-white cursor-pointer backdrop-blur-xl transition-all'
						tabIndex='-1'
					>
						<ChevronDown size={14} />
					</button>
				</div>
			</div>
		</div>
	)
}

export const TextArea = ({
	placeholder,
	title,
	required,
	validate,
	value,
	onChange,
	onStatusChange,
	readOnly = false,
}) => {
	const {
		value: val,
		status,
		handleChange,
	} = useInput({
		value,
		validate,
		onChange,
		onStatusChange,
	})

	return (
		<div className={`w-full flex flex-col ${readOnly && 'opacity-40'}`}>
			{title && (
				<div className='flex items-center gap-2 ml-1'>
					<p className={`text-[18px] text-[var(--middle)] pt-[2px]`}>{title}</p>
					{required && (
						<CircleCheck
							className={`${status ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}

			<textarea
				value={val}
				onChange={handleChange}
				readOnly={readOnly}
				placeholder={placeholder}
				maxLength={300}
				className=' rounded-2xl p-3 shadow-inner border-1 border-[var(--black)]/2.5 transition-all resize-none min-h-25'
			/>
		</div>
	)
}

export const FileInputZone = ({
	title,
	required,
	onStatusChange,
	onFileChange,
	photoUrl,
}) => {
	const [status, setStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [preview, setPreview] = useState(null)
	const [drag, setDrag] = useState(false)

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 10 * 1024 * 1024

	const reset = () => {
		setStatus(false)
		setFileInfo(null)
		setPreview(null)
		onStatusChange?.(false)
	}

	const validate = async file => {
		if (!file) return reset()

		if (!validFormats.includes(file.type)) return reset()
		if (file.size > maxSize) return reset()

		if (file.type.startsWith('image/')) {
			const img = new Image()
			const url = URL.createObjectURL(file)

			await new Promise((res, rej) => {
				img.onload = () => {
					if (img.width > 4000 || img.height > 4000) {
						rej()
					} else res()
					URL.revokeObjectURL(url)
				}
				img.onerror = rej
				img.src = url
			}).catch(reset)
		}

		setStatus(true)
		onStatusChange?.(true)

		setFileInfo({
			name: file.name,
			size: (file.size / 1024 / 1024).toFixed(2),
		})

		setPreview(URL.createObjectURL(file))
		onFileChange?.(file)
	}

	return (
		<div className='flex flex-col gap-3 w-full'>
			{title && (
				<div className='flex items-center gap-2'>
					<p className={`text-[18px] text-[var(--middle)] pt-[2px]`}>{title}</p>
					{required && (
						<CircleCheck
							className={`${status ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}

			<label
				className={`grid grid-cols-5 gap-3 p-1 rounded-2xl bg-[var(--white)] shadow-[var(--shadow)] cursor-pointer transition ${
					drag && 'ring-2 ring-[var(--hero-epta)]'
				}`}
				onDragOver={e => {
					e.preventDefault()
					setDrag(true)
				}}
				onDragLeave={() => setDrag(false)}
				onDrop={e => {
					e.preventDefault()
					setDrag(false)
					validate(e.dataTransfer.files[0])
				}}
			>
				<div className='col-span-1 flex justify-center items-center'>
					{preview || photoUrl ? (
						<img
							src={preview || photoUrl}
							alt='preview'
							className='w-[80px] h-[80px] object-cover rounded-xl py-[1px]'
						/>
					) : (
						<ImagePlus size={80} strokeWidth={1.25} color='var(--middle)' />
					)}
				</div>
				<div className='flex items-center col-span-2'>
					<div className='flex flex-wrap gap-1 h-fit'>
						<p
							className={`rounded-lg text-xs font-normal px-2 py-1 h-fit whitespace-nowrap ${
								fileInfo && fileInfo.size <= 10
									? 'bg-[var(--hero-epta)] text-white'
									: 'bg-[var(--bg)] text-[var(--black)]'
							}`}
						>
							до 10 мб
						</p>
						{['.png', '.jpg', '.webp', '.gif'].map(ext => (
							<p
								key={ext}
								className={`rounded-lg text-xs font-normal px-2 py-1 h-fit whitespace-nowrap ${
									fileInfo && fileInfo.name.endsWith(ext)
										? 'bg-[var(--hero-epta)] text-white'
										: 'bg-[var(--bg)] text-[var(--black)]'
								}`}
							>
								{ext}
							</p>
						))}
					</div>
				</div>
				<p
					className={`col-span-2 flex items-center text-xs text-[var(--black)] font-normal ${
						fileInfo && 'truncate'
					}  text-center`}
				>
					{fileInfo ? (
						<>
							{fileInfo.name}
							<br />({fileInfo.size} МБ)
						</>
					) : (
						<>
							Перетащите файл сюда
							<br />
							или
							<br />
							нажмите для загрузки
						</>
					)}
				</p>

				<input
					type='file'
					className='hidden'
					onChange={e => validate(e.target.files[0])}
				/>
			</label>
		</div>
	)
}

export const OptionSearch = ({
	options = [],
	placeholder = '',
	labelKey = 'name',
	onSelect,
	onCreate,
	value = null,
}) => {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState(value)

	// синхра снаружи
	useEffect(() => {
		if (value) {
			setSelected(value)
			setQuery(value[labelKey] || '')
		}
	}, [value])

	// 🔥 локальный поиск
	const filtered = useMemo(() => {
		return options.filter(item =>
			item[labelKey].toLowerCase().includes(query.toLowerCase()),
		)
	}, [query, options])

	const handleSelect = item => {
		setSelected(item)
		setQuery(item[labelKey])
		setIsOpen(false)
		onSelect?.(item)
	}

	return (
		<div className='relative w-full'>
			<div className='flex items-center rounded-2xl shadow-inner px-4 py-3 bg-[var(--white)]'>
				<input
					value={query}
					onChange={e => {
						setQuery(e.target.value)
						setSelected(null)
					}}
					onFocus={() => setIsOpen(true)}
					onBlur={() => setTimeout(() => setIsOpen(false), 150)}
					placeholder={placeholder}
					className='w-full bg-transparent'
				/>
			</div>

			{isOpen && (
				<div className='absolute w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl mt-1 max-h-35 overflow-y-scroll z-10'>
					{filtered.length === 0 ? (
						<button
							type='button'
							onClick={() => {
								onCreate?.(query)
								setIsOpen(false)
							}}
							className='w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[var(--hero-epta)] hover:text-white'
						>
							<span className='text-lg'>+</span>
							Создать "{query}"
						</button>
					) : (
						filtered.map((item, i) => (
							<button
								key={i}
								type='button'
								onClick={() => handleSelect(item)}
								className='w-full text-left px-3 py-2 hover:bg-[var(--hero-epta)] hover:text-white'
							>
								{item[labelKey]}
							</button>
						))
					)}
				</div>
			)}
		</div>
	)
}

export const OptionInputWithSearch = ({
	options = [],
	placeholder = '',
	labelKey = 'name',
	onSelect,
	onCreate,
	value = null,
	title,
	required,
	CreateOrNot = false,
	formRef = null,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState(value)

	// Реф для всего компонента, чтобы ловить клики "мимо"
	const containerRef = useRef(null)

	// синхра
	useEffect(() => {
		if (value) {
			setSelected(value)
		}
	}, [value])

	// Функция закрытия дропдауна
	const handleClose = () => {
		setIsOpen(false)
		setSearch('') // Очищаем поиск при закрытии, чтобы при следующем открытии был весь список
	}

	// 1. Хук клика наружу: если открыто и кликнули мимо containerRef -> закрываем
	useClickOutside(containerRef, handleClose, isOpen)

	// 2. Хук скролла: если открыто и начали скроллить форму/окно -> закрываем
	useScrollListener(handleClose, isOpen, formRef)

	const filtered = useMemo(() => {
		return options?.filter(item =>
			item[labelKey].toLowerCase().includes(search.toLowerCase()),
		)
	}, [search, options])

	const handleSelect = item => {
		setSelected(item)
		setSearch('')
		setIsOpen(false)
		onSelect?.(item)
	}

	return (
		<div ref={containerRef} className='w-full flex flex-col gap-2'>
			{/* 🔥 TITLE */}
			{title && (
				<div className='flex items-center gap-2'>
					<p className={`text-[18px] text-[var(--middle)] pt-[2px]`}>{title}</p>
					{required && (
						<CircleCheck
							className={`${selected ? 'text-green-500' : 'text-[var(--middle)]'}`}
							size={16}
						/>
					)}
				</div>
			)}

			<div className='relative w-full'>
				{/* 🔥 ОСНОВНОЙ INPUT */}
				<div
					onClick={() => setIsOpen(prev => !prev)}
					className='flex items-center rounded-2xl shadow-inner border-1 border-[var(--black)]/2.5 px-4 py-3 bg-[var(--white)] cursor-pointer'
				>
					<input
						readOnly
						value={selected ? selected[labelKey] : ''}
						placeholder={placeholder}
						className='w-full outline-none bg-transparent cursor-pointer'
					/>
				</div>

				{/* 🔥 DROPDOWN */}
				{isOpen && (
					<div className='absolute w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-3xl mt-2 max-h-50 overflow-hidden z-10 flex flex-col'>
						{/* 🔍 ПОИСК ВНУТРИ */}
						<div className='p-2'>
							<InputDefault
								value={search}
								onChange={e => setSearch(e.target.value)}
								placeholder='Поиск...'
								className='w-full px-3 py-2 rounded-lg outline-none bg-[var(--bg)]'
								autoFocus
							/>
						</div>

						{/* 📃 СПИСОК */}
						<div className='overflow-y-scroll max-h-35'>
							{filtered?.length === 0
								? CreateOrNot && (
										<button
											type='button'
											onClick={() => {
												onCreate?.(search)
												setIsOpen(false)
											}}
											className='w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[var(--hero-epta)] hover:text-white'
										>
											<span className='text-lg'>+</span>
											Создать "{search}"
										</button>
									)
								: filtered?.map((item, i) => (
										<button
											key={i}
											type='button'
											onClick={() => handleSelect(item)}
											className='w-full text-left px-3 py-2 hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer'
										>
											{item[labelKey]}
										</button>
									))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
