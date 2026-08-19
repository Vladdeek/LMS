import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { InputBase } from '../../Atoms/InputField/InputBase'

export const PreviewInput = ({
	title,
	required,
	onStatusChange,
	onFileChange,
	photoUrl,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [preview, setPreview] = useState(null)

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 10 * 1024 * 1024

	const getImageDimensions = file => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			const url = URL.createObjectURL(file)
			img.onload = function () {
				const dimensions = { width: this.width, height: this.height }
				URL.revokeObjectURL(url)
				resolve(dimensions)
			}
			img.onerror = function () {
				URL.revokeObjectURL(url)
				reject(new Error('Не удалось загрузить изображение'))
			}
			img.src = url
		})
	}

	const validateFile = async file => {
		if (!file) {
			setInputStatus(false)
			return
		}

		if (!validFormats.includes(file.type) || file.size > maxSize) {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			setPreview(null)
			return
		}

		if (file.type.startsWith('image/')) {
			try {
				const dimensions = await getImageDimensions(file)
				if (dimensions.width > 4000 || dimensions.height > 4000) {
					setInputStatus(false)
					onStatusChange?.(false)
					setFileInfo(null)
					setPreview(null)
					return
				}
			} catch (error) {
				console.error('Ошибка при проверке разрешения:', error)
				setInputStatus(false)
				onStatusChange?.(false)
				setFileInfo(null)
				setPreview(null)
				return
			}
		}

		setInputStatus(true)
		onStatusChange?.(true)
		setFileInfo({
			name: file.name,
			size: (file.size / 1024 / 1024).toFixed(2),
		})
		setPreview(URL.createObjectURL(file))
		onFileChange?.(file)
	}

	return (
		<InputBase title={title} required={required} status={inputStatus}>
			<label
				htmlFor='dropzone-file'
				className={`cursor-pointer rounded-2xl bg-[var(--white)] shadow-[var(--shadow)] p-[10px] flex gap-[10px] items-center w-full transition ring-1 ${
					isDragActive ? 'ring-[var(--hero)]' : 'ring-transparent'
				}`}
				onDragOver={e => {
					e.preventDefault()
					setIsDragActive(true)
				}}
				onDragLeave={() => setIsDragActive(false)}
				onDrop={e => {
					e.preventDefault()
					setIsDragActive(false)
					validateFile(e.dataTransfer.files[0])
				}}
			>
				<div className='w-1/5 flex justify-center items-center'>
					{preview || photoUrl ? (
						<img
							src={preview || photoUrl}
							alt='preview'
							className='w-[80px] h-[80px] object-cover rounded-lg'
						/>
					) : (
						<ImagePlus size={80} strokeWidth={1.5} color='var(--middle)' />
					)}
				</div>
				<div className='flex flex-wrap gap-[5px] w-2/5'>
					<p
						className={`rounded-lg text-xs font-normal p-1 whitespace-nowrap ${
							fileInfo && fileInfo.size <= 10
								? 'bg-[var(--hero)] text-white'
								: 'bg-[var(--bg)] text-[var(--black)]'
						}`}
					>
						до 10 мб
					</p>
					{['.png', '.jpg', '.webp', '.gif'].map(ext => (
						<p
							key={ext}
							className={`rounded-lg text-xs font-normal p-1 whitespace-nowrap ${
								fileInfo && fileInfo.name.endsWith(ext)
									? 'bg-[var(--hero)] text-white'
									: 'bg-[var(--bg)] text-[var(--black)]'
							}`}
						>
							{ext}
						</p>
					))}
				</div>
				<p
					className={`w-2/5 text-xs text-[var(--black)] font-normal ${
						fileInfo ? 'truncate' : ''
					} text-center`}
				>
					{fileInfo ? (
						<>
							{fileInfo.name}
							<br />({fileInfo.size} МБ)
						</>
					) : (
						<>
							Перетащите файл сюда
							<br />
							или
							<br />
							нажмите для загрузки
						</>
					)}
				</p>

				<input
					id='dropzone-file'
					type='file'
					accept='.png,.jpg,.jpeg,.webp,.gif'
					className='hidden'
					onChange={e => validateFile(e.target.files[0])}
				/>
			</label>
		</InputBase>
	)
}
