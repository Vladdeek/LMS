import React, { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FileUploaderZone } from './FileUploaderZone'
import { RemoveButton } from '../../Atoms/Buttons/RemoveButton'
import { Show } from '../../Atoms/Show'
import { isEditor } from 'slate'
import { MEDIA_API_URL } from '../../../API'
import { FullScreenModal } from '../../Molecules/FullScreenModal'

// Модалка полноэкранного просмотра

export const PhotoBlock = ({
	data,
	isEdit,
	onChange,
	onDelete,
	sectionId,
	onDeleteFile,
}) => {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [fullScreenIdx, setFullScreenIdx] = useState(null)
	const [photos, setPhotos] = useState([])

	useEffect(() => {
		if (data?.files) {
			setPhotos(data.files)
		} else {
			setPhotos([])
		}
	}, [data])

	const handleUpload = async file => {
		setUploading(true)
		setProgress(0)

		try {
			const mockInterval = setInterval(() => {
				setProgress(prev => (prev >= 100 ? 100 : prev + 15))
			}, 150)

			await new Promise(resolve => setTimeout(resolve, 1500))
			clearInterval(mockInterval)

			const newPhotoUrl = URL.createObjectURL(file)
			onChange([...photos, { file_path: newPhotoUrl }])
		} catch (error) {
			console.error('Ошибка загрузки фото:', error)
		} finally {
			setUploading(false)
			setProgress(0)
		}
	}

	// Определение колонок контейнера под фото
	const getContainerClass = (index, total) => {
		if (total === 1) return 'col-span-2'
		if (total === 3 && index === 2) return 'col-span-2'
		return 'col-span-1'
	}

	return (
		<div className='flex gap-4 w-full items-start'>
			<Show when={isEdit}>
				<RemoveButton onDelete={onDelete} />
			</Show>

			<div className='grid grid-cols-2 w-full gap-4 items-center'>
				{photos.map((item, idx) => {
					const photoSrc = typeof item === 'string' ? item : item.file_path

					return (
						<motion.div
							key={item.id || item.file_path || idx}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							/* 
							   Контейнер задает размер в сетке и фиксирует max-высоту (h-[350px]), 
							   чтобы вертикальные 9x16 фото не растягивали сетку до бесконечности.
							*/
							className={`relative ${isEdit ? 'bg-[var(--middle)]/5 rounded-2xl' : 'bg-transparent'} hover:scale-[1.02] transition-all flex items-center justify-center h-[350px] w-full group ${getContainerClass(
								idx,
								photos.length,
							)}`}
						>
							{/* Картинка с h-full, max-w-full и object-contain — без единого обреза */}
							<img
								src={`${MEDIA_API_URL + photoSrc}`}
								onClick={() => !isEdit && setFullScreenIdx(idx)}
								className={`h-full max-w-full object-contain ${!isEdit && 'rounded-2xl'} transition-transform duration-300  cursor-pointer`}
								alt=''
							/>
							<Show when={isEdit}>
								<button
									onClick={() => onDeleteFile?.('image', item.id)}
									className='absolute top-3 right-3 p-2 bg-[var(--white)] text-[var(--black)] backdrop-blur-md rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10'
								>
									<X size={16} strokeWidth={3} />
								</button>
							</Show>
						</motion.div>
					)
				})}

				{isEdit && photos.length < 4 && (
					<motion.div layout className={`h-[350px] col-span-2`}>
						<FileUploaderZone
							sectionId={sectionId}
							type='image'
							onFilesSelected={handleUpload}
							isUploading={uploading}
							uploadProgress={progress}
							onChange={onChange}
							maxCount={4}
						/>
					</motion.div>
				)}
			</div>
			<Show when={fullScreenIdx !== null}>
				<FullScreenModal
					photos={photos}
					index={fullScreenIdx}
					setIndex={setFullScreenIdx}
					close={() => setFullScreenIdx(null)}
				/>
			</Show>
		</div>
	)
}
