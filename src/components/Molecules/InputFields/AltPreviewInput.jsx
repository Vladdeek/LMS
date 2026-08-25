import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { InputBase } from '../../Atoms/InputField/InputBase'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { Dropdown } from '../../Atoms/Dropdown/Dropdown'
import { ChangeImage } from '../ChangeImage'

export const AltPreviewInput = ({
	title,
	required,
	onStatusChange,
	onFileChange,
	photoUrl,
}) => {
	// Состояние [isOpen, setIsOpen] здесь больше не нужно,
	// так как Dropdown сам его отслеживает

	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [preview, setPreview] = useState(null)

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 10 * 1024 * 1024

	const getImageDimensions = file => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			const url = URL.createObjectURL(file)
			img.onload = function () {
				const dimensions = { width: this.width, height: this.height }
				URL.revokeObjectURL(url)
				resolve(dimensions)
			}
			img.onerror = function () {
				URL.revokeObjectURL(url)
				reject(new Error('Не удалось загрузить изображение'))
			}
			img.src = url
		})
	}

	const validateFile = async file => {
		if (!file) {
			setInputStatus(false)
			return
		}

		if (!validFormats.includes(file.type) || file.size > maxSize) {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			setPreview(null)
			return
		}

		if (file.type.startsWith('image/')) {
			try {
				const dimensions = await getImageDimensions(file)
				if (dimensions.width > 4000 || dimensions.height > 4000) {
					setInputStatus(false)
					onStatusChange?.(false)
					setFileInfo(null)
					setPreview(null)
					return
				}
			} catch (error) {
				console.error('Ошибка при проверке разрешения:', error)
				setInputStatus(false)
				onStatusChange?.(false)
				setFileInfo(null)
				setPreview(null)
				return
			}
		}

		setInputStatus(true)
		onStatusChange?.(true)
		setFileInfo({
			name: file.name,
			size: (file.size / 1024 / 1024).toFixed(2),
		})
		setPreview(URL.createObjectURL(file))
		onFileChange?.(file)
	}

	const handleFileSelect = (e, closeDropdown) => {
		const file = e.target.files?.[0]
		if (file) {
			validateFile(file)
			closeDropdown() // Закрываем меню после выбора файла
		}
	}

	return (
		<div className='relative w-full h-50'>
			<img
				className='w-full h-full object-cover rounded-2xl'
				src={
					preview ||
					photoUrl ||
					'https://i.pinimg.com/1200x/aa/a5/7c/aaa57c8e09063174cd1136787d2f4fbc.jpg'
				}
				alt='Preview'
			/>

			<div className='absolute bottom-2 right-2'>
				<ChangeImage
					align='right'
					trigger={isOpen => (
						<SubmitButton sizeButton={'sm'} invert>
							Изменить превью
						</SubmitButton>
					)}
				>
					{({ close }) => (
						<div className='p-2 flex flex-col gap-2'>
							<label className='flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-lg transition-colors'>
								<ImagePlus size={16} />
								<span>Загрузить фото</span>
								<input
									type='file'
									accept={validFormats.join(',')}
									className='hidden'
									onChange={e => handleFileSelect(e, close)}
								/>
							</label>

							{preview && (
								<button
									type='button'
									onClick={() => {
										setPreview(null)
										setFileInfo(null)
										onFileChange?.(null)
										close()
									}}
									className='flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left transition-colors'
								>
									Удалить фото
								</button>
							)}
						</div>
					)}
				</ChangeImage>
			</div>
		</div>
	)
}
