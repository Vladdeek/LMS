import React, { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import History from '@tiptap/extension-history'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import {
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Underline as UnderlineIcon,
	Strikethrough,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from 'lucide-react'
import { RemoveButton } from './FileUploaderZone'

export const TextEditor = ({ data, onDelete, onChange, isEdit = false }) => {
	// Храним строку последнего состояния, чтобы избежать бесконечного рендера при синхронизации
	const lastExternalDataRef = useRef(data)

	// Парсер стал тупым как пробка: если строка — парсим, если объект — отдаем как есть
	const parseContent = incomingData => {
		if (!incomingData) return { type: 'doc', content: [] }
		try {
			return typeof incomingData === 'string'
				? JSON.parse(incomingData)
				: incomingData
		} catch (e) {
			console.error('Ошибка парсинга данных в редакторе:', e)
			return { type: 'doc', content: [] }
		}
	}

	const editor = useEditor({
		extensions: [
			Document,
			Paragraph,
			Text,
			Bold,
			Italic,
			Strike,
			Underline,
			ListItem,
			BulletList,
			OrderedList,
			History,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		// Инициализируем тем, что пришло в самом начале
		content: parseContent(data),
		editable: !!isEdit,

		onUpdate: ({ editor }) => {
			// Получаем чистый JSON самого Tiptap
			const tiptapJson = editor.getJSON()
			const stringifiedJson = JSON.stringify(tiptapJson)

			// Запоминаем, что это мы сами только что ввели
			lastExternalDataRef.current = stringifiedJson

			// Отдаем наверх чистую строку JSON и plainText (если он нужен родителю для поиска/превью)
			onChange?.({
				content: stringifiedJson,
				plainText: editor.getText(),
			})
		},
	})

	// Включение / выключение режима редактирования
	useEffect(() => {
		if (editor) {
			editor.setEditable(!!isEdit)
		}
	}, [isEdit, editor])

	// Синхронизация с бэком: если данные СНАРУЖИ реально изменились и они не равны тому,
	// что внутри редактора — жестко сетаем их (только когда пользователь не пишет)
	useEffect(() => {
		if (!editor || !data) return

		if (data !== lastExternalDataRef.current) {
			lastExternalDataRef.current = data

			if (!editor.isFocused) {
				editor.commands.setContent(parseContent(data), false)
			}
		}
	}, [data, editor])

	if (!editor) return null

	const ToolbarButton = ({ onClick, isActive, icon: Icon }) => (
		<button
			type='button'
			onMouseDown={e => {
				e.preventDefault()
				onClick()
			}}
			className={`p-2 rounded-lg cursor-pointer transition ${
				isActive
					? 'bg-[var(--hero-epta)] text-white'
					: 'hover:bg-[var(--hero-epta)] hover:text-white text-[var(--middle)]'
			}`}
		>
			<Icon size={18} />
		</button>
	)

	return (
		<div className={`flex gap-4 ${!isEdit ? 'w-full' : ''}`}>
			{isEdit && <RemoveButton onDelete={onDelete} />}

			<div className='w-full flex flex-col'>
				{isEdit && (
					<div className='flex flex-wrap gap-1 mb-2 bg-[var(--white)] shadow-[var(--shadow)] p-1.5 rounded-xl w-fit'>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBold().run()}
							isActive={editor.isActive('bold')}
							icon={BoldIcon}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleItalic().run()}
							isActive={editor.isActive('italic')}
							icon={ItalicIcon}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleUnderline().run()}
							isActive={editor.isActive('underline')}
							icon={UnderlineIcon}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleStrike().run()}
							isActive={editor.isActive('strike')}
							icon={Strikethrough}
						/>
						<div className='w-px h-6 bg-[var(--middle)] mx-1 self-center' />
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							isActive={editor.isActive('bulletList')}
							icon={List}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							isActive={editor.isActive('orderedList')}
							icon={ListOrdered}
						/>
						<div className='w-px h-6 bg-[var(--middle)] mx-1 self-center' />
						<ToolbarButton
							onClick={() => editor.chain().focus().setTextAlign('left').run()}
							isActive={editor.isActive({ textAlign: 'left' })}
							icon={AlignLeft}
						/>
						<ToolbarButton
							onClick={() =>
								editor.chain().focus().setTextAlign('center').run()
							}
							isActive={editor.isActive({ textAlign: 'center' })}
							icon={AlignCenter}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().setTextAlign('right').run()}
							isActive={editor.isActive({ textAlign: 'right' })}
							icon={AlignRight}
						/>
					</div>
				)}

				<div className='w-full'>
					<style>
						{`
                            .ProseMirror { outline: none !important; min-height: 60px; }
                            .ProseMirror p { margin-bottom: 8px; }
                            .ProseMirror ul { list-style-type: disc; padding-left: 20px; }
                            .ProseMirror ol { list-style-type: decimal; padding-left: 20px; }
                        `}
					</style>
					<EditorContent
						editor={editor}
						className={`text-[var(--black)] ${
							isEdit
								? 'px-4 py-3 rounded-2xl bg-[var(--light-gray)] border border-[var(--light-middle)] focus-within:border-[var(--hero)]'
								: ''
						}`}
					/>
				</div>
			</div>
		</div>
	)
}
