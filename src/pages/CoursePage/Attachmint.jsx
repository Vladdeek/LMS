import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	FileArchive,
	FileCode,
	FileImage,
	FileMusic,
	FilePlay,
	FileQuestionMark,
	FileSpreadsheet,
	FileText,
	Trash2,
} from 'lucide-react'

import { FileUploaderZone } from '../../components/Organisms/ConstructorViews/FileUploaderZone'
import {
	deleteCourseAttachment,
	getCourseAttachments,
} from '../../api/attachment'

const Attachment = () => {
	const { courseId } = useParams()

	const [groups, setGroups] = useState([])
	const [lessons, setLessons] = useState({})

	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)

	const [searchStudents, setSearchStudents] = useState('')
	const [isSearchLoading, setIsSearchLoading] = useState(null)
	const [students, setStudents] = useState([])

	const [files, setFiles] = useState([])
	const maxFileSizeInMB = 50

	const studentsDebounce = useRef(null)

	const fetchFiles = async () => {
		try {
			const data = await getCourseAttachments(courseId)
			const mapped = data.map(file => ({
				file_path: file.file_path,
				name: file.original_name,
				size: file.file_size,
				type: file.file_extension,
				id: file.id,
			}))
			setFiles(mapped)
		} catch (e) {
			console.error('fetchFiles error', e)
		}
	}

	useEffect(() => {
		if (courseId) {
			fetchFiles()
		}
	}, [courseId])

	const removeFile = async (id, path) => {
		try {
			await deleteCourseAttachment(courseId, id, path)
			fetchFiles()
		} catch (error) {
			console.error('removeFile error', error)
		}
	}

	const formatFileSize = bytes => {
		if (!bytes || bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getFileIcon = fileType => {
		const lowerType = fileType?.toLowerCase()
		const formatMap = {
			image: {
				formats: [
					'jpg',
					'jpeg',
					'png',
					'gif',
					'bmp',
					'webp',
					'svg',
					'tiff',
					'ico',
				],
				icon: <FileImage size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			document: {
				formats: [
					'pdf',
					'doc',
					'docx',
					'txt',
					'rtf',
					'odt',
					'ppt',
					'pptx',
					'odp',
				],
				icon: <FileText size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			spreadsheet: {
				formats: ['xls', 'xlsx', 'csv', 'ods', 'numbers'],
				icon: (
					<FileSpreadsheet size={24} color='var(--black)' strokeWidth={1.75} />
				),
			},
			archive: {
				formats: ['zip', 'rar', '7z', 'tar', 'gz', 'iso'],
				icon: <FileArchive size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			video: {
				formats: ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'],
				icon: <FilePlay size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			audio: {
				formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
				icon: <FileMusic size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			code: {
				formats: [
					'js',
					'ts',
					'py',
					'java',
					'html',
					'css',
					'php',
					'json',
					'xml',
					'sql',
					'rb',
					{
						/* ...rest */
					},
				],
				icon: <FileCode size={24} color='var(--black)' strokeWidth={1.75} />,
			},
		}

		for (const category in formatMap) {
			if (formatMap[category].formats.includes(lowerType)) {
				return formatMap[category].icon
			}
		}

		return (
			<FileQuestionMark size={24} color='var(--black)' strokeWidth={1.75} />
		)
	}

	const currentTotalSize = files.reduce(
		(total, file) => total + (file.size || 0),
		0,
	)

	return (
		<div>
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(77.5vh-100px)] overflow-hidden flex flex-col p-4 gap-4'>
				<p className='text-2xl text-[var(--black)] font-medium my-2'>
					Прикрепленные файлы к курсу
				</p>

				{files?.length > 0 && (
					<div className='w-full flex flex-col border border-[var(--light-middle)] rounded-lg overflow-hidden py-[1px]'>
						{files.map((file, index) => (
							<div
								key={file.id || index}
								className={`flex items-center justify-between p-3 ${
									index % 2 === 0
										? 'bg-[var(--white)]'
										: 'bg-[var(--light-gray)]'
								} w-full`}
							>
								<div className='flex items-center gap-2 text-[var(--black)]'>
									{getFileIcon(file?.type)}
									<div>
										<p className='text-sm font-medium truncate w-full'>
											{file?.name}
										</p>
										<p className='text-xs text-[var(--middle)]'>
											{file?.type} • {formatFileSize(file?.size)}
										</p>
									</div>
								</div>
								<div className='flex gap-3'>
									<Trash2
										size={20}
										onClick={() => removeFile(file.id, file.file_path)}
										className='text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
									/>
								</div>
							</div>
						))}
					</div>
				)}

				<p className='text-sm text-[var(--middle)]'>
					{formatFileSize(currentTotalSize)} из {maxFileSizeInMB} МБ
				</p>

				<FileUploaderZone
					type='files'
					sectionId={courseId}
					maxSize={15}
					maxCount={1}
					currentFilesWeight={currentTotalSize}
					onChange={() => {
						fetchFiles()
					}}
				/>
			</div>
		</div>
	)
}

export default Attachment
