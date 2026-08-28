import { useEffect, useState } from 'react'
import { Show } from '../../Atoms/Show'
import { FileUploaderZone } from '../ConstructorViews/FileUploaderZone'
import { AddMediaToQuestion, DeleteMediaInQuestion } from '../../../api/Test'
import { useSearchParams } from 'react-router-dom'
import { GetPresignedUrlToUploadMediaTest } from '../../../api/uploadFileToS3'
import { AudioPlayer } from '../../Molecules/AudioPlayer'
import { MEDIA_API_URL } from '../../../API'
import { useUser } from '../../../context/UserContext'
import { Trash, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { FullScreenModal } from '../../Molecules/FullScreenModal'

export const MediaUploader = ({
	media = null,
	sectionId,
	onUploadSuccess,
	isEdit = true,
	onDeleteFile,
}) => {
	const { role } = useUser()
	const [localFile, setLocalFile] = useState(media)
	const [isUploading, setIsUploading] = useState(false)

	const [searchParams] = useSearchParams()
	const activeQuestionId = searchParams.get('questionId')

	useEffect(() => {
		setLocalFile(media)
	}, [media])

	const handleUpload = async fileMetadataId => {
		if (!activeQuestionId) {
			console.error('Не найден questionId в URL')
			return
		}

		try {
			setIsUploading(true)
			const response = await AddMediaToQuestion(
				activeQuestionId,
				fileMetadataId,
			)

			setLocalFile(response || fileMetadataId)
			toast.success('Медиа файл успешно загружен!')
			window.dispatchEvent(new Event('question:detail:update'))
		} catch (error) {
			toast.error('Ошибка при загрузке медиа к вопросу')
			console.error('Ошибка при связывании медиа с вопросом:', error)
		} finally {
			setIsUploading(false)
		}
	}

	const handleDelete = async () => {
		try {
			await DeleteMediaInQuestion(activeQuestionId, localFile.id)
			setLocalFile(null)
			toast.success('Медиа файл успешно удален!')
			window.dispatchEvent(new Event('question:detail:update'))
		} catch (error) {
			toast.error(
				`Ошибка при удалении медиа ${error.detail ? `- ${error.detail}` : ''}`,
			)
		}
	}

	// Извлекаем mime_type и URL (учитывая возможную вложенность file_metadata)
	const fileData = localFile?.file_metadata || localFile
	const mimeType = fileData?.mime_type || ''
	const fileUrl =
		fileData?.url ||
		fileData?.file_path ||
		(typeof localFile === 'string' ? localFile : '')

	const photos = [{ file_path: fileUrl }]
	const [fullScreenIdx, setFullScreenIdx] = useState(null)

	const isImage = mimeType.startsWith('image/')
	const isAudio = mimeType.startsWith('audio/')

	return (
		<>
			<div className='w-full max-w-2xl'>
				<Show when={localFile !== null}>
					<div className='relative rounded-xl object-cover '>
						{/* Рендер Картинки */}
						<Show when={isImage}>
							<div className='w-full h-full'>
								<img
									onClick={() => setFullScreenIdx(0)}
									src={MEDIA_API_URL + fileUrl}
									alt='Прикрепленное медиа'
									className='w-full h-auto object-cover rounded-2xl hover:scale-101 hover:shadow-md transition-all cursor-pointer'
								/>
							</div>
						</Show>

						{/* Рендер Аудио */}
						<Show when={isAudio}>
							<AudioPlayer data={fileData} />
						</Show>

						{/* Кнопка удаления (если это не audio, так как AudioPlayer может удалять сам) */}
						<Show when={role !== 'student'}>
							<div
								className={`absolute  ${isImage ? 'right-2 top-2' : '-right-11 top-0'} `}
							>
								<button
									type='button'
									onClick={handleDelete}
									className='text-[var(--red-text)] bg-[var(--red-bg)]  p-2 rounded-xl hover:text-[var(--red-bg)] hover:bg-[var(--red-text)] transition-all cursor-pointer'
								>
									<Trash2 />
								</button>
							</div>
						</Show>
					</div>
				</Show>
				<Show when={localFile === null && role !== 'student'}>
					<FileUploaderZone
						sectionId={sectionId}
						type='questionMedia'
						onChange={fileMetadataId => handleUpload(fileMetadataId)}
						uploadApiFn={GetPresignedUrlToUploadMediaTest}
						maxCount={1}
					/>
				</Show>
			</div>
			<Show when={fullScreenIdx !== null}>
				<FullScreenModal
					photos={photos}
					index={fullScreenIdx}
					setIndex={setFullScreenIdx}
					close={() => setFullScreenIdx(null)}
				/>
			</Show>
		</>
	)
}
