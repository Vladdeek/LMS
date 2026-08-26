import { useState, useEffect } from 'react'
import { Show } from '../../Atoms/Show'
import { RemoveButton } from '../../Atoms/Buttons/RemoveButton'
import { AudioPlayer } from '../../Molecules/AudioPlayer'
import { FileUploaderZone } from './FileUploaderZone'
import { Loader } from '../../Atoms/Loaders/Loader'

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

	console.log(localFile)

	return (
		<div className='flex gap-4 w-full'>
			<Show when={isEdit}>
				<RemoveButton onDelete={onDelete} />
			</Show>
			<Show
				when={localFile !== null}
				fallback={
					<div className='w-full h-25 flex justify-center items-center'>
						<Loader />
					</div>
				}
			>
				<div className='flex flex-col gap-4 w-full'>
					{/* Добавлен ?. в localFile?.file_id */}
					<Show when={localFile?.file_id != null}>
						<AudioPlayer
							data={localFile?.file_metadata}
							isEdit={isEdit}
							onDeleteFile={onDeleteFile}
						/>
					</Show>

					{/* Добавлен ?. в localFile?.file_id */}
					<Show when={isEdit && localFile?.file_id == null}>
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
			</Show>
		</div>
	)
}
