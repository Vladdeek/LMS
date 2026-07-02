import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { RemoveButton } from './FileUploaderZone'

// Вспомогательный компонент инпута (можно вынести отдельно, если нужен в других местах)
const ControlledInputDefault = ({ value, onChange, ...props }) => {
	const [internalValue, setInternalValue] = useState(value || '')

	useEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const handleChange = e => {
		setInternalValue(e.target.value)
		onChange?.(e)
	}

	return (
		<InputDefault {...props} value={internalValue} onChange={handleChange} />
	)
}

export const ButtonConstructor = ({
	isEdit = false,
	values,
	onChange,
	onDelete,
	data,
}) => {
	const [buttonTitle, setButtonTitle] = useState(values?.buttonTitle || '')
	const [buttonUrl, setButtonUrl] = useState(values?.buttonUrl || '')
	const [isValidUrl, setIsValidUrl] = useState(true)

	useEffect(() => {
		if (data) {
			setButtonTitle(data.buttonTitle)
			setButtonUrl(data.buttonUrl)
		}
	}, [data])

	// Валидация URL
	useEffect(() => {
		if (!buttonUrl) {
			setIsValidUrl(true) // Считаем валидным, пока пусто, чтобы не спамить ошибкой
			return
		}
		try {
			new URL(buttonUrl)
			setIsValidUrl(true)
		} catch (e) {
			setIsValidUrl(false)
		}
	}, [buttonUrl])

	// Передача данных родителю
	useEffect(() => {
		if (isEdit) {
			onChange?.({
				buttonTitle,
				buttonUrl,
			})
		}
	}, [buttonTitle, buttonUrl, isEdit])

	// Рендер для режима ПРОСМОТРА
	if (!isEdit) {
		return (
			<div className='flex justify-center'>
				<a
					href={buttonUrl || '#'}
					target='_blank'
					rel='noopener noreferrer'
					className='text-white px-4 py-3 w-fit rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all bg-[var(--hero-epta)] font-medium'
				>
					{buttonTitle || 'Кнопка'}
				</a>
			</div>
		)
	}

	// Рендер для режима РЕДАКТИРОВАНИЯ
	return (
		<div className='flex gap-4'>
			<RemoveButton onDelete={onDelete} />

			<div className='flex flex-col gap-3 bg-[var(--white)] w-full shadow-[var(--shadow)] rounded-xl p-4'>
				<p className='font-medium text-base text-[var(--middle)] select-none cursor-default'>
					Конструктор кнопки
				</p>

				{/* Превью кнопки в конструкторе */}
				<div className='flex justify-center items-center bg-[var(--light-gray)] rounded-lg w-full py-10'>
					<div className='text-white px-4 py-3 rounded-lg bg-[var(--hero-epta)] font-medium'>
						{buttonTitle || 'Кнопка'}
					</div>
				</div>

				<ControlledInputDefault
					title='Название кнопки'
					placeholder='Введите название кнопки'
					required
					type='text'
					value={buttonTitle}
					onChange={e => setButtonTitle(e.target.value)}
				/>

				<ControlledInputDefault
					title='URL (Ссылка)'
					placeholder='https://example.com'
					required
					type='url'
					value={buttonUrl}
					onChange={e => setButtonUrl(e.target.value)}
				/>

				{buttonUrl && !isValidUrl && (
					<p className='text-red-400 text-sm mt-1'>
						Введите корректный URL (например, https://google.com)
					</p>
				)}
			</div>
		</div>
	)
}
