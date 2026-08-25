import { useState, useEffect } from 'react'
import { Show } from '../../Atoms/Show'
import { RemoveButton } from '../../Atoms/Buttons/RemoveButton'
import { AudioPlayer } from '../../Molecules/AudioPlayer'
import { FileUploaderZone } from './FileUploaderZone'

export const AudioManager = ({
	data,
	isEdit = false,
	onUpload,
	onDeleteFile,
	onDelete,
	sectionId,
	isUploading = false,
	progress = 0,
	onChange,
}) => {
	const [localFile, setLocalFile] = useState(null)

	useEffect(() => {
		if (data) {
			try {
				const parsed = typeof data === 'string' ? JSON.parse(data) : data
				setLocalFile(parsed)
			} catch {
				setLocalFile(null)
			}
		} else {
			setLocalFile(null)
		}
	}, [data])

	return (
		<div className='flex gap-4 w-full'>
			<Show when={isEdit}>
				<RemoveButton onDelete={onDelete} />
			</Show>

			<div className='flex flex-col gap-4 w-full'>
				{/* Отображаем плеер, если аудио уже загружено */}
				<Show when={localFile !== null}>
					<AudioPlayer
						file={localFile}
						isEdit={isEdit}
						onDeleteFile={onDeleteFile}
					/>
				</Show>

				{/* Зона загрузки отображается только в режиме редактирования и если файла нет */}
				<Show when={isEdit && localFile === null}>
					<div className='w-full'>
						<FileUploaderZone
							sectionId={sectionId}
							type='audio'
							accept='audio/*'
							onFilesSelected={selectedFiles => {
								if (selectedFiles.length > 0) {
									onUpload?.(selectedFiles[0])
								}
							}}
							isUploading={isUploading}
							uploadProgress={progress}
							onChange={onChange}
						/>
					</div>
				</Show>
			</div>
		</div>
	)
}
