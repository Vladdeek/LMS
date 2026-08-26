import { useState, useEffect } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import {
	getAllDefaultPhoto,
	getRandomDefaultPhoto,
} from '../../api/ChangePhoto'
import { Show } from '../Atoms/Show'
import { Loader } from '../Atoms/Loaders/Loader'
import { Dropdown } from '../Atoms/Dropdown/Dropdown'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'
import { RadioGroup } from '../Molecules/RadioGroup'
import { MEDIA_API_URL } from '../../API'
import { PreviewInput } from './PreviewInput'

const VALID_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024
const TAB_OPTIONS = [
	{ value: 'selective', label: 'Выбор' },
	{ value: 'upload', label: 'Загрузить' },
]

export const ChangePreview = ({
	onFileChange,
	onStatusChange,
	initialUrl = null,
	align = 'right',
}) => {
	const [photoUrl, setPhotoUrl] = useState(initialUrl)
	const [selectedChapter, setSelectedChapter] = useState('selective')
	const [defaultImages, setDefaultImages] = useState([])

	// Загрузка дефолтных картинок из API при выборе первой вкладки
	useEffect(() => {
		if (selectedChapter !== 'selective') return

		const fetchDefaultImages = async () => {
			try {
				const res = await getAllDefaultPhoto()
				setDefaultImages(res || [])
			} catch (error) {
				console.error('Ошибка при загрузке стандартных фото:', error)
			}
		}
		fetchDefaultImages()
	}, [selectedChapter])

	useEffect(() => {
		const fetchRandomDefaultImage = async () => {
			try {
				const res = await getRandomDefaultPhoto()
				setPhotoUrl(res || null)
			} catch (error) {
				console.error('Ошибка при загрузке стандартных фото:', error)
			}
		}
		if (initialUrl === null) fetchRandomDefaultImage()
	}, [])

	// Проверка размеров файла изображения (ширина / высота)
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

	// Валидация загружаемого файла
	const validateAndProcessFile = async file => {
		if (!file) return

		if (!VALID_FORMATS.includes(file.type) || file.size > MAX_SIZE) {
			onStatusChange?.(false)
			return
		}

		try {
			const dimensions = await getImageDimensions(file)
			if (dimensions.width > 4000 || dimensions.height > 4000) {
				onStatusChange?.(false)
				return
			}
		} catch (error) {
			console.error('Ошибка проверки разрешения:', error)
			onStatusChange?.(false)
			return
		}

		const previewUrl = URL.createObjectURL(file)
		setPhotoUrl(previewUrl)
		onStatusChange?.(true)
		onFileChange?.(file)
	}

	// Выбор файла через input type="file"
	const handleFileSelect = (e, close) => {
		const file = e.target.files?.[0]
		if (file) {
			validateAndProcessFile(file)
			close()
		}
	}

	// Выбор готового изображения из галереи API
	const handleSelectPresetImage = (imagePath, close) => {
		const fullUrl = imagePath
		setPhotoUrl(fullUrl)
		onStatusChange?.(true)
		onFileChange?.(imagePath)
		close()
	}

	// Очистка выбранного изображения
	const handleRemovePhoto = close => {
		setPhotoUrl(null)
		onStatusChange?.(false)
		onFileChange?.(null)
		close()
	}

	return (
		<div className='relative w-full h-50 bg-[var(--light-middle)] rounded-2xl'>
			{/* Превью выбранного фото */}
			<Show
				when={photoUrl}
				fallback={
					<div className='w-full h-full flex items-center justify-center text-[var(--middle)] text-sm'>
						<Loader />
					</div>
				}
			>
				<img
					className='w-full h-full object-cover rounded-2xl'
					src={MEDIA_API_URL + photoUrl}
					alt='Preview'
				/>
			</Show>

			{/* Кнопка и меню Dropdown */}
			<div className='absolute bottom-2 right-2 z-20'>
				<Dropdown
					align={align}
					trigger={isOpen => (
						<SubmitButton sizeButton='sm' invert type='button'>
							Изменить превью
						</SubmitButton>
					)}
				>
					{({ close }) => (
						<div className='flex flex-col gap-2 w-72 bg-[var(--white)] p-2 rounded-xl'>
							{/* Переключатель вкладок */}
							<RadioGroup
								options={TAB_OPTIONS}
								value={selectedChapter}
								onChange={setSelectedChapter}
								style='alt'
								className='flex gap-3'
								wfull
							/>

							{/* Вкладка 1: Галерея предустановленных картинок */}
							<Show when={selectedChapter === 'selective'}>
								<div className='grid grid-cols-3 gap-2 overflow-y-auto max-h-56 p-1'>
									{defaultImages.map((item, idx) => (
										<img
											key={idx}
											onClick={() => handleSelectPresetImage(item, close)}
											className='w-full aspect-video object-cover rounded-xl ring-0 ring-[var(--hero)] hover:scale-105 hover:ring-2 hover:shadow-md transition-all cursor-pointer'
											src={MEDIA_API_URL + item}
											alt={`Preset ${idx}`}
										/>
									))}
								</div>
							</Show>

							{/* Вкладка 2: Загрузить свое фото */}
							<Show when={selectedChapter === 'upload'}>
								<PreviewInput />
							</Show>
						</div>
					)}
				</Dropdown>
			</div>
		</div>
	)
}
