export const UPLOAD_TYPES = {
	video: {
		icon: Film,
		title: 'видео',
		maxSize: Number(import.meta.env.VITE_MAX_VIDEO_SIZE), // Значение из env
		exts: ['.mp4', '.webm', '.mov', '.avi'],
	},
	image: {
		icon: Image,
		title: 'изображение',
		maxSize: Number(import.meta.env.VITE_MAX_IMAGE_SIZE),
		exts: ['.jpg', '.jpeg', '.png', '.webp'],
	},
	files: {
		icon: FileText,
		title: 'файл',
		maxSize: Number(import.meta.env.VITE_MAX_TOTAL_FILES_SIZE),
		exts: ['.pdf', '.zip', '.rar', '.docx'],
	},
	code: {
		icon: FileCode2, // из lucide-react
		title: 'код',
		maxSize: Number(import.meta.env.VITE_MAX_CODE_SIZE), // или из констант
		// ВЫТАСКИВАЕМ ДИНАМИЧЕСКИ:
		// Object.keys(languageMap) выдаст ['js', 'mjs', 'jsx', ...]
		// .map(ext => `.${ext}`) превратит их в ['.js', '.mjs', '.jsx', ...]
		exts: Object.keys(languageMap).map(ext => `.${ext}`),
	},
}
