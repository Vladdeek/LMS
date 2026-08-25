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
	Download,
} from 'lucide-react'

export const FileView = ({
	files = [],
	isEdit = false,
	onDeleteFile,
	onDownload,
}) => {
	if (!files || files.length === 0) return null

	const formatFileSize = bytes => {
		if (!bytes || bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getFileIcon = extension => {
		const ext = extension?.toLowerCase()

		const formatMap = {
			image: {
				formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
				icon: (
					<FileImage
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			document: {
				formats: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
				icon: (
					<FileText
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			spreadsheet: {
				formats: ['xls', 'xlsx', 'csv'],
				icon: (
					<FileSpreadsheet
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			archive: {
				formats: ['zip', 'rar', '7z', 'tar', 'gz'],
				icon: (
					<FileArchive
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			video: {
				formats: ['mp4', 'avi', 'mov', 'webm', 'mkv'],
				icon: (
					<FilePlay
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			audio: {
				formats: ['mp3', 'wav', 'flac', 'm4a'],
				icon: (
					<FileMusic
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			code: {
				formats: ['js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'json', 'php'],
				icon: (
					<FileCode
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
		}

		for (const category in formatMap) {
			if (formatMap[category].formats.includes(ext)) {
				return formatMap[category].icon
			}
		}
		return (
			<FileQuestionMark
				size={24}
				className='text-[var(--black)]'
				strokeWidth={1.75}
			/>
		)
	}

	const handleDownload = file => {
		if (onDownload) {
			onDownload(file)
		} else if (file.file_path) {
			window.open(file.file_path, '_blank')
		}
	}

	return (
		<div className='flex flex-col w-full'>
			<div className='w-full flex flex-col rounded-xl overflow-hidden shadow-[var(--shadow)] bg-[var(--white)]'>
				{files.map((file, index) => (
					<div
						key={file.id || index}
						className={`flex items-center justify-between p-3 border-b border-[var(--light-gray)] last:border-0 ${
							index % 2 === 0 ? 'bg-[var(--white)]' : 'bg-[var(--light-gray)]'
						}`}
					>
						<div className='flex items-center gap-3 overflow-hidden'>
							{getFileIcon(file.file_extension)}
							<div className='overflow-hidden'>
								<p
									className='text-sm font-medium truncate text-[var(--black)] max-w-[200px] md:max-w-md'
									title={file.original_name}
								>
									{file.original_name}
									{file.original_name?.includes('.')
										? ''
										: `.${file.file_extension}`}
								</p>
								<p className='text-xs text-[var(--middle)]'>
									{formatFileSize(file.file_size)}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<button
								onClick={() => handleDownload(file)}
								className='p-2 hover:bg-[var(--green-base)] hover:text-[var(--green-text)] cursor-pointer rounded-lg transition-all text-[var(--black)]'
								title='Скачать'
							>
								<Download size={20} />
							</button>

							{isEdit && (
								<button
									onClick={() => onDeleteFile?.(file.id)}
									className='p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer text-[var(--black)]'
									title='Удалить'
								>
									<Trash2 size={20} />
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
