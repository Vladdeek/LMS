import {
	AudioLines,
	FileCode2,
	FileText,
	Film,
	Image,
	Paperclip,
} from 'lucide-react'
import { languageMap } from './lanaguagesMap'

export const UPLOAD_TYPES = {
	video: {
		icon: Film,
		title: 'видео',
		maxSize: 50,
		exts: ['.mp4', '.webm', '.mov', '.avi'],
	},
	audio: {
		icon: AudioLines,
		title: 'Аудио',
		maxSize: 10,
		exts: ['.mp3', '.wav'],
	},
	image: {
		icon: Image,
		title: 'изображение',
		maxSize: 25,
		exts: ['.jpg', '.jpeg', '.png', '.webp'],
	},
	files: {
		icon: FileText,
		title: 'файл',
		maxSize: 50,
		exts: ['.pdf', '.zip', '.rar', '.docx'],
	},
	code: {
		icon: FileCode2, // из lucide-react
		title: 'код',
		maxSize: 10, // или из констант
		exts: Object.keys(languageMap).map(ext => `.${ext}`),
	},
	questionMedia: {
		icon: Paperclip, // или FileUp
		title: 'медиа-файл к вопросу',
		maxSize: 10,
		exts: ['.mp3', '.wav', '.jpg', '.png', '.jpeg', '.webp'],
	},
}
