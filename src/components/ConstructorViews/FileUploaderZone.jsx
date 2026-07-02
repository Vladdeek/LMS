import { FileCode2, FileText, Film, Image, Upload, X } from 'lucide-react'
import { useState } from 'react'
import React from 'react'
import { languageMap } from '../../../service/data/lanaguagesMap'
import { GetPresignedUrlToUploadMedia } from '../../../service/APIs/LectureContent'
import { uploadFileToStorage } from '../../../service/APIs/uploadFileToS3'

export const RemoveButton = ({ onDelete }) => {
	return (
		<button
			onClick={onDelete}
			className='self-start p-2 bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer '
		>
			<X size={20} />
		</button>
	)
}

export const UPLOAD_TYPES = {
	video: {
		icon: Film,
		title: 'видео',
		maxSize: Number(import.meta.env.VITE_MAX_VIDEO_SIZE), // Значение из env
		exts: ['.mp4', '.webm', '.mov', '.avi'],
	},
	image: {
		icon: Image,
		title: 'изображение',
		maxSize: Number(import.meta.env.VITE_MAX_IMAGE_SIZE),
		exts: ['.jpg', '.jpeg', '.png', '.webp'],
	},
	files: {
		icon: FileText,
		title: 'файл',
		maxSize: Number(import.meta.env.VITE_MAX_TOTAL_FILES_SIZE),
		exts: ['.pdf', '.zip', '.rar', '.docx'],
	},
	code: {
		icon: FileCode2, // из lucide-react
		title: 'код',
		maxSize: Number(import.meta.env.VITE_MAX_CODE_SIZE), // или из констант
		// ВЫТАСКИВАЕМ ДИНАМИЧЕСКИ:
		// Object.keys(languageMap) выдаст ['js', 'mjs', 'jsx', ...]
		// .map(ext => `.${ext}`) превратит их в ['.js', '.mjs', '.jsx', ...]
		exts: Object.keys(languageMap).map(ext => `.${ext}`),
	},
}

export const UploadProgressBar = ({ progress }) => {
	return (
		<div className='flex flex-col items-center gap-3 w-1/2'>
			<div className='flex items-center gap-2'>
				<p className='text-sm font-bold text-[var(--black)]'>{progress}%</p>
				{/* Вместо старого Loader используем простую CSS-крутилку */}
				<div className='w-4 h-4 border-2 border-[var(--hero-epta)] border-t-transparent rounded-full animate-spin' />
			</div>

			<div className='w-full bg-[var(--light-middle)] h-2 rounded-full overflow-hidden'>
				<div
					className='bg-[var(--hero-epta)] h-full transition-all duration-300 ease-out'
					style={{ width: `${progress}%` }}
				/>
			</div>
			<p className='text-[10px] uppercase tracking-wider text-[var(--middle)] font-medium'>
				Загрузка на сервер...
			</p>
		</div>
	)
}

export const FileUploaderZone = ({
	type = 'files',
	sectionId, // Принимаем id секции из пропсов
	onChange, // Сюда передаем итоговый URL (или массив URL)
	onFilesSelected, // Оставляем на случай, если локально нужно имя файла
	currentFilesWeight = 0,
}) => {
	const [isDragActive, setIsDragActive] = useState(false)
	const [isValid, setIsValid] = useState(true)

	// Переносим управление загрузкой внутрь, так как логика теперь здесь
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)

	const config = UPLOAD_TYPES[type] || UPLOAD_TYPES.files
	const Icon = config.icon

	const handleValidationFailed = () => {
		setIsValid(false)
		setTimeout(() => setIsValid(true), 1000)
	}

	// Логика отправки файлов на сервер
	const handleMediaUpload = async validFiles => {
		if (type === 'code') {
			if (onChange) onChange(validFiles)
			return
		}

		setIsUploading(true)
		setUploadProgress(0)

		try {
			const uploadedUrls = []

			for (const file of validFiles) {
				// Вытаскиваем расширение (например, 'png', 'mp4')
				const fileExt = file.name.split('.').pop().toLowerCase()

				// Формируем body строго по спецификации бэка
				const fileMetadata = {
					original_name: file.name,
					file_extension: fileExt,
					mime_type: file.type,
					file_size: file.size,
					type: type === 'image' ? 'images' : type, // Сверяем маппинг ('image' -> 'images')
				}

				// 1. Получаем pre-signed URL, передавая metadata в body
				const responseData = await GetPresignedUrlToUploadMedia(
					sectionId,
					fileMetadata,
				)

				// 2. Загружаем файл в S3 через наш хелпер
				const fileUrl = await uploadFileToStorage(
					responseData.upload_url.url,
					responseData.upload_url.fields,
					file,
					progress => {
						setUploadProgress(progress)
					},
				)

				onChange(responseData.file_metadata_id)
			}
		} catch (error) {
			console.error('Ошибка при загрузке медиа:', error)
		} finally {
			setIsUploading(false)
			setUploadProgress(0)
		}
	}

	const processFiles = newFiles => {
		if (!newFiles.length || isUploading) return

		const maxSizeBytes = config.maxSize * 1024 * 1024
		let totalBatchWeight = 0
		const validFiles = []

		for (const file of newFiles) {
			const ext = `.${file.name.split('.').pop().toLowerCase()}`
			const isExtValid = config.exts.includes(ext)

			if (isExtValid) {
				totalBatchWeight += file.size
				validFiles.push(file)
			} else {
				handleValidationFailed()
				return
			}
		}

		if (totalBatchWeight + currentFilesWeight > maxSizeBytes) {
			alert(`Превышен общий лимит в ${config.maxSize} МБ`)
			handleValidationFailed()
			return
		}

		if (validFiles.length > 0) {
			if (onFilesSelected) onFilesSelected(validFiles)
			// Запускаем цепочку загрузки
			handleMediaUpload(validFiles)
		}
	}

	// --- Дальше идет твой JSX без изменений ---
	const zoneClass = isDragActive
		? 'bg-[var(--transparent-hero)] border-[var(--hero)] ring-[var(--transparent-hero)]'
		: !isValid
			? 'bg-[var(--hard-lvl-bg)] border-[var(--hard-lvl-text)] ring-[var(--hard-lvl-bg)]'
			: 'bg-[var(--light-gray)] border-[var(--middle)] ring-[var(--light-middle)]'

	return (
		<label
			onDragOver={e => {
				e.preventDefault()
				if (!isUploading) setIsDragActive(true)
			}}
			onDragLeave={() => setIsDragActive(false)}
			onDrop={e => {
				e.preventDefault()
				setIsDragActive(false)
				processFiles(Array.from(e.dataTransfer.files))
			}}
			className={`p-6 w-full flex flex-col items-center justify-center rounded-2xl transition-all border-3 border-dashed ring-4  ${
				isUploading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
			} ${zoneClass}`}
		>
			<input
				type='file'
				className='hidden'
				multiple={type !== 'video' && type !== 'image'} // Например, ограничим видео/фото по одному, если бэк не принимает массив
				accept={config.exts.join(',')}
				onChange={e => processFiles(Array.from(e.target.files))}
				disabled={isUploading}
			/>

			<Icon
				size={80}
				strokeWidth={1.5}
				className='mb-2 opacity-50 text-[var(--middle)]'
			/>

			<p className='text-[var(--middle)] font-medium mb-4 tracking-tight text-center leading-4'>
				Перетащите {config.title === 'файл' ? 'файлы' : config.title} <br />
				или <br /> выберите их
			</p>

			<div className='flex gap-2 mb-8'>
				<span className='bg-[var(--light-middle)] text-[var(--middle)] px-3 py-1 rounded-lg text-sm font-medium'>
					общий вес до {config.maxSize} МБ
				</span>
				{config.exts.slice(0, 4).map(ext => (
					<span
						key={ext}
						className='bg-[var(--light-middle)] text-[var(--middle)] px-3 py-1 rounded-lg text-sm font-medium'
					>
						{ext}
					</span>
				))}
			</div>

			{isUploading ? (
				<UploadProgressBar progress={uploadProgress} />
			) : (
				<div className='bg-[var(--black)] text-[var(--white)] px-8 py-4 rounded-xl flex gap-3 font-bold hover:bg-[var(--hero-epta)] hover:text-white transition-all shadow-lg text-center'>
					<Upload strokeWidth={3} />
					Выбрать {config.title === 'файл' ? 'файлы' : config.title}
				</div>
			)}
		</label>
	)
}
