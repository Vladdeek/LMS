import { useState } from 'react'
import { UPLOAD_TYPES } from '../../../Constants/uploadTypes'
import { UploadProgressBar } from '../../Molecules/UploadProgressBar'
import { Upload } from 'lucide-react'
import {
	GetPresignedUrlToUploadMedia,
	uploadFileToStorage,
} from '../../../api/uploadFileToS3'
import { Show } from '../../Atoms/Show'

export const FileUploaderZone = ({
	type = 'files',
	sectionId,
	onChange,
	onFilesSelected,
	currentFilesWeight = 0,
	currentFilesCount = 0,
	maxSize,
	maxCount = null,
}) => {
	const [isDragActive, setIsDragActive] = useState(false)
	const [isValid, setIsValid] = useState(true)

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
			for (const file of validFiles) {
				const fileExt = file.name.split('.').pop().toLowerCase()

				const fileMetadata = {
					original_name: file.name,
					file_extension: fileExt,
					mime_type: file.type,
					file_size: file.size,
					type: type === 'image' ? 'images' : type,
				}

				const responseData = await GetPresignedUrlToUploadMedia(
					sectionId,
					fileMetadata,
				)

				await uploadFileToStorage(
					responseData.upload_url.url,
					responseData.upload_url.fields,
					file,
					progress => {
						setUploadProgress(progress)
					},
				)

				onChange?.(responseData.file_metadata_id)
				console.log(responseData.file_metadata_id)
			}
		} catch (error) {
			console.error('Ошибка при загрузке медиа:', error)
		} finally {
			setIsUploading(false)
			setUploadProgress(0)
		}
	}

	const processFiles = newFiles => {
		if (!newFiles || !newFiles.length || isUploading) return

		// Проверка на ограничение по количеству файлов
		if (maxCount !== null) {
			if (currentFilesCount + newFiles.length > maxCount) {
				alert(`Максимальное количество файлов: ${maxCount}`)
				handleValidationFailed()
				return
			}
		}

		const effectiveMaxSize = maxSize || config.maxSize
		const maxSizeBytes = effectiveMaxSize * 1024 * 1024
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
			alert(`Превышен общий лимит в ${effectiveMaxSize} МБ`)
			handleValidationFailed()
			return
		}

		if (validFiles.length > 0) {
			if (onFilesSelected) onFilesSelected(validFiles)
			handleMediaUpload(validFiles)
		}
	}

	const zoneClass = isDragActive
		? 'bg-[var(--hero-pale)] border-[var(--hero)] ring-[var(--hero-pale)]'
		: !isValid
			? 'bg-[var(--red-pale)] border-[var(--red-text)] ring-[var(--red-pale)]'
			: 'bg-[var(--light-middle)]/50 border-[var(--middle)] ring-[var(--light-middle)]/50'

	const badgeClass = isDragActive
		? 'bg-[var(--hero)] text-[var(--hero-pale)]'
		: !isValid
			? 'bg-[var(--red-text)] text-[var(--red-pale)]'
			: 'bg-[var(--light-middle)] text-[var(--middle)] '

	const textClass = isDragActive
		? 'text-[var(--hero)]'
		: !isValid
			? 'text-[var(--red-text)] '
			: 'text-[var(--middle)] '

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
				processFiles(Array.from(e.dataTransfer.files || []))
			}}
			className={`p-6 w-full flex flex-col items-center justify-center rounded-2xl transition-all border-3 border-dashed ring-4  ${
				isUploading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
			} ${zoneClass}`}
		>
			<input
				type='file'
				className='hidden'
				multiple={maxCount !== 1 && type !== 'video' && type !== 'image'}
				accept={config.exts.join(',')}
				onChange={e => processFiles(Array.from(e.target.files || []))}
				disabled={isUploading}
			/>

			<Icon
				size={80}
				strokeWidth={1.5}
				className={`mb-2 transition-all ${textClass}`}
			/>

			<p
				className={`${textClass} font-medium mb-4 transition-all tracking-tight text-base text-center leading-4`}
			>
				Перетащите {config.title === 'файл' ? 'файлы' : config.title} <br />
				или <br /> выберите их
			</p>

			<div className='flex flex-wrap gap-2 justify-center mb-8'>
				<span
					className={`${badgeClass} transition-all px-3 py-1 rounded-lg text-sm  font-medium`}
				>
					общий вес до {maxSize || config.maxSize} МБ
				</span>

				{/* Badge с максимальным количеством файлов */}
				<span
					className={`${badgeClass} transition-all px-3 py-1 rounded-lg text-sm  font-medium`}
				>
					{maxCount !== null ? `до ${maxCount} файлов` : 'кол-во не ограничено'}
				</span>

				{config.exts.slice(0, 4).map(ext => (
					<span
						key={ext}
						className={`${badgeClass} transition-all px-3 py-1 rounded-lg text-sm font-medium`}
					>
						{ext}
					</span>
				))}
			</div>
			<Show when={isUploading}>
				<UploadProgressBar
					progress={uploadProgress}
					fallback={
						<div className='bg-[var(--black)] text-[var(--white)] text-base px-8 py-4 rounded-xl flex gap-3 font-bold hover:bg-[var(--hero)] hover:text-white transition-all shadow-lg text-center'>
							<Upload
								className='lg:h-5 h-3 w-auto aspect-square'
								strokeWidth={3}
							/>
							Выбрать {config.title === 'файл' ? 'файлы' : config.title}
						</div>
					}
				/>
			</Show>
		</label>
	)
}
