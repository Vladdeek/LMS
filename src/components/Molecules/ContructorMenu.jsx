import {
	AudioLines,
	Code,
	Files,
	Film,
	Image,
	Layers2,
	MousePointerClick,
	SquareFunction,
	Table,
	Text,
} from 'lucide-react'

const CONSTRUCTOR_BUTTONS = [
	{ title: 'Текст', type: 'text', icon: <Text size={32} /> },
	{ title: 'Код', type: 'code', icon: <Code size={32} /> },
	{ title: 'Фото', type: 'images', icon: <Image size={32} /> },
	{ title: 'Видео', type: 'video', icon: <Film size={32} /> },
	{ title: 'Файлы', type: 'files', icon: <Files size={32} /> },
	{ title: 'Таблица', type: 'table', icon: <Table size={32} /> },
	{ title: 'Выноска', type: 'callout', icon: <Layers2 size={32} /> },
	{ title: 'Формула', type: 'formula', icon: <SquareFunction size={32} /> },
	{ title: 'Кнопка', type: 'button', icon: <MousePointerClick size={32} /> },
	{ title: 'Аудио', type: 'audio', icon: <AudioLines size={32} /> },
]

export const ConstructorMenu = ({ onAdd }) => (
	<div className='grid lg:grid-cols-5 grid-cols-3 gap-2 p-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] w-fit mx-auto mt-4'>
		{CONSTRUCTOR_BUTTONS.map((item, index) => (
			<button
				key={index}
				onClick={() => onAdd(item.type)}
				className='flex flex-col aspect-square items-center justify-center gap-2 bg-[var(--light-middle)] rounded-xl h-24 w-24 hover:bg-[var(--hero)] hover:text-white cursor-pointer text-[var(--middle)] transition-all duration-100'
			>
				{item.icon}
				<p className='text-sm font-medium'>{item.title}</p>
			</button>
		))}
	</div>
)
