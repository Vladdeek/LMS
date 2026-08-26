import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { MEDIA_API_URL } from '../../API'

export const FullScreenModal = ({ photos, index, close, setIndex }) => {
	if (index === null || !photos[index]) return null

	const next = () => setIndex((index + 1) % photos.length)
	const prev = () => setIndex((index - 1 + photos.length) % photos.length)

	// Получаем правильный URL изображения (поддержка объектов и строк)
	const getSrc = item => MEDIA_API_URL + item?.file_path

	return (
		<div className='fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4'>
			<button
				onClick={close}
				className='absolute top-5 right-5 z-[1001] bg-white/20 hover:bg-red-500 text-white p-2 rounded-full transition-all'
			>
				<X size={24} />
			</button>

			<div className='relative max-w-7xl w-full h-full flex items-center justify-center'>
				{photos.length > 1 && (
					<>
						<button
							onClick={prev}
							className='absolute left-4 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all z-10'
						>
							<ChevronLeft size={40} />
						</button>
						<button
							onClick={next}
							className='absolute right-4 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all z-10'
						>
							<ChevronRight size={40} />
						</button>
					</>
				)}

				<img
					src={getSrc(photos[index])}
					className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
					alt=''
				/>
			</div>
		</div>
	)
}
