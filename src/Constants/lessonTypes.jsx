import {
	BookMarked,
	FlaskConical,
	LaptopMinimalCheck,
	NotebookPen,
} from 'lucide-react'

export const LESSON_TYPES = [
	{
		label: 'Лекция',
		apiType: 'lecture',
		icon: <BookMarked size={18} />,
		description: 'Теоретический материал с блоками текста и медиа.',
	},
	{
		label: 'Тест',
		apiType: 'test',
		icon: <LaptopMinimalCheck size={18} />,
		description: 'Контрольное тестирование для проверки знаний.',
	},
	{
		label: 'Практика',
		apiType: 'practice',
		icon: <NotebookPen size={18} />,
		description: 'Практическое задание для закрепления материала.',
	},
	{
		label: 'Лабораторная',
		apiType: 'labs',
		icon: <FlaskConical size={18} />,
		description: 'Лабораторное задание для закрепления материала.',
	},
]

export const LESSON_ICONS = {
	lecture: <BookMarked size={18} />,
	practice: <NotebookPen size={18} />,
	test: <LaptopMinimalCheck size={18} />,
	labs: <FlaskConical size={18} />,
}

export const LESSON_LABELS = {
	lecture: 'Лекция',
	practice: 'Практика',
	test: 'Тест',
	labs: 'Лабораторная',
}
