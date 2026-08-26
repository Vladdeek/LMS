import { useState, useEffect } from 'react'
import { RemoveButton } from '../../Atoms/Buttons/RemoveButton'
import { FileUploaderZone } from './FileUploaderZone'
import { FileView } from '../../Molecules/FileView'
import { Show } from '../../Atoms/Show'

export const FileManager = ({
	data,
	isEdit = false,
	onUpload,
	onDelete,
	onDeleteFile,
	onDownload,
	sectionId,
	isUploading = false,
	progress = 0,
	onChange,
}) => {
	const [localFiles, setLocalFiles] = useState([])

	useEffect(() => {
		if (data) {
			setLocalFiles(data.files || [])
		} else {
			setLocalFiles([])
		}
	}, [data])

	return (
		<div className='flex gap-4 w-full'>
			<Show when={isEdit && onDelete}>
				<RemoveButton onDelete={onDelete} />
			</Show>

			<div className='flex flex-col gap-4 w-full'>
				<FileView
					files={localFiles}
					isEdit={isEdit}
					onDeleteFile={data => onDeleteFile?.('file', data)}
					onDownload={onDownload}
				/>
				<Show when={isEdit}>
					<div className='w-full'>
						<FileUploaderZone
							sectionId={sectionId}
							type='files'
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
