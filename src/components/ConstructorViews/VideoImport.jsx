import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { FileUploaderZone, RemoveButton } from './FileUploaderZone'
import VideoPlayer from '../VideoPlayer'

export const VideoImport = ({
	onStatusChange,
	onDelete,
	onChange,
	data, // Принимаем весь объект: { type: "video", block: { files: [...] } }
	sectionId,
	isEdit,
	onDeleteFile,
}) => {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)

	// Локальное состояние для извлеченного URL видео
	const [videoUrl, setVideoUrl] = useState('')

	// Синхронизируем входящие данные бэка с локальным URL
	useEffect(() => {
		const file = data.file_metadata
		if (file) {
			setVideoUrl(file)
		} else {
			setVideoUrl('')
		}
	}, [data])

	const handleUpload = async file => {
		setUploading(true)
		setProgress(0)

		try {
			const mockInterval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 100) {
						clearInterval(mockInterval)
						return 100
					}
					return prev + 10
				})
			}, 200)

			await new Promise(resolve => setTimeout(resolve, 2500))

			// Временно создаем blob-url для превью, пока нет реального S3
			const localUrl = URL.createObjectURL(file)

			// Передаем наверх.
			// ВАЖНО: Если родитель ждет готовую структуру для отправки на бэк,
			// то вместо localUrl нужно будет передавать объект.
			// Если родитель пока принимает просто массив/строку — оставляем так.
			onChange?.(localUrl)
			onStatusChange?.(true)
		} catch (error) {
			console.error('Ошибка при загрузке видео:', error)
		} finally {
			setUploading(false)
			setTimeout(() => setProgress(0), 1000)
		}
	}

	const handleRemove = async () => {
		// Очищаем значение в родителе
		onChange?.('')
		onStatusChange?.(false)
	}

	return (
		<div className='flex gap-4 w-full items-start'>
			{/* Кнопка удаления всего компонента из списка конструктора */}
			{isEdit && <RemoveButton onDelete={onDelete} />}

			<div className='flex justify-center w-full min-h-[350px]'>
				{videoUrl ? (
					// Если видео есть в структуре данных — показываем плеер
					<div className='relative w-full group rounded-2xl overflow-hidden'>
						<VideoPlayer url={videoUrl.file_path} />

						{/* Кнопка "Удалить видео и загрузить заново" */}
						<button
							type='button'
							onClick={() => onDeleteFile?.(videoUrl.id)}
							className='absolute top-3 right-3 z-10 bg-white/90 backdrop-blur text-black p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl opacity-0 group-hover:opacity-100'
							title='Удалить видео'
						>
							<X size={18} strokeWidth={3} />
						</button>
					</div>
				) : (
					isEdit && (
						<FileUploaderZone
							sectionId={sectionId}
							type='video'
							onFilesSelected={handleUpload}
							isUploading={uploading}
							uploadProgress={progress}
							onChange={onChange}
						/>
					)
				)}
			</div>
		</div>
	)
}
