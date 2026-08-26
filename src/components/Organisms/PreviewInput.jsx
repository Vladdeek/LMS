import { useState } from 'react'
import { FileInput } from '../Molecules/InputFields/FileInput'
import {
	GetPresignedUrlToUploadMedia,
	uploadFileToStorage,
} from '../../api/uploadFileToS3'
import { Show } from '../Atoms/Show'
import { Text } from '../Atoms/Text'

export const PreviewInput = ({
	sectionId,
	onUploadSuccess,
	title,
	required,
	description,
	accept,
}) => {
	const [previewUrl, setPreviewUrl] = useState('')
	const [progress, setProgress] = useState(0)
	const [isUploading, setIsUploading] = useState(false)

	const handleFileChange = async file => {
		if (!file) return

		// Локальное превью до загрузки на S3
		const objectUrl = URL.createObjectURL(file)
		setPreviewUrl(objectUrl)
		setIsUploading(true)
		setProgress(0)

		try {
			// 1. Получаем presigned URL и поля от бэка
			const fileMetadata = {
				fileName: file.name,
				fileType: file.type,
			}
			const { url, fields } = await GetPresignedUrlToUploadMedia(
				sectionId,
				fileMetadata,
			)

			// 2. Загружаем файл на S3
			const uploadedFileUrl = await uploadFileToStorage(
				url,
				fields,
				file,
				percent => setProgress(percent),
			)

			// 3. Передаем итоговую ссылку наверх
			onUploadSuccess?.(uploadedFileUrl)
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className='flex flex-col gap-3 w-full'>
			<FileInput
				onChange={handleFileChange}
				title={title}
				required={required}
				description={description}
				accept={accept}
			/>
			<Show when={isUploading}>
				<div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
					<div
						className='bg-black h-full transition-all duration-300'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</Show>

			<Show
				when={previewUrl}
				fallback={
					<div className='w-full h-auto aspect-video mt-1'>
						<div className=' w-full h-full flex items-center justify-center rounded-xl bg-[var(--light-middle)]/50 border-2 border-dashed border-[var(--middle)] ring-5 ring-[var(--light-middle)]/50'>
							<Text size={'sm'} style={'secondary'}>
								Загрузите изображение
							</Text>
						</div>
					</div>
				}
			>
				<div className='w-full h-auto aspect-video mt-1'>
					<img
						src={previewUrl}
						alt='Превью'
						className='w-full h-full rounded-xl object-cover'
					/>
				</div>
			</Show>
		</div>
	)
}
