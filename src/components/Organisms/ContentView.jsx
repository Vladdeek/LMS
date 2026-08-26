import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { TextEditor } from './ConstructorViews/TextEditor'
import { PhotoBlock } from './ConstructorViews/PhotoImport'
import { VideoImport } from './ConstructorViews/VideoImport'
import { CodeUploader } from './ConstructorViews/CodeImport'
import { FileManager } from './ConstructorViews/FilesImport'
import { Formula } from './ConstructorViews/FormulaConstructor'
import { ButtonConstructor } from './ConstructorViews/ButtonConstructor'
import { Callout } from './ConstructorViews/Callout'

import { StudentTestView } from './StudentTestView'
import { TestManager } from './TestManager'
import { StudentPracticeView } from './StudentPracticeView'
import { ConstructorMenu } from '../Molecules/ContructorMenu'
import { useUser } from '../../context/UserContext'
import { Show } from '../Atoms/Show'
import { debounce } from '../../utils/debounce'
import {
	AppendLectureContent,
	DeleteBlock,
	DeleteFile,
	DeleteImage,
	ReadLectureContent,
	UpdateLectureContent,
} from '../../api/Constructor'
import { useParams, useSearchParams } from 'react-router-dom'
import { DynamicTable } from './ConstructorViews/TableConstructor'
import { AudioManager } from './ConstructorViews/AudioManager'

const COMPONENT_MAP = {
	text: TextEditor,
	images: PhotoBlock,
	video: VideoImport,
	code: CodeUploader,
	files: FileManager,
	formula: Formula,
	button: ButtonConstructor,
	callout: Callout,
	table: DynamicTable,
	audio: AudioManager,
}

const DEBOUNCED_TYPES = ['text', 'callout', 'formula', 'button', 'table']

export const ContentView = ({ isEdit }) => {
	const [blocks, setBlocks] = useState([])
	const [searchParams] = useSearchParams()
	const activeSectionId = searchParams.get('section')
	const activeType = searchParams.get('type')
	const { courseId } = useParams()
	const { role } = useUser()

	// Реф-карта для блокировки нежелательного вызова onChange при первом рендере блока
	const firstRenderMap = useRef({})

	// Сбрасываем карту первых рендеров при переключении секции
	useEffect(() => {
		firstRenderMap.current = {}
	}, [activeSectionId])

	// Получение контента с бэкенда
	const readContent = async () => {
		if (!activeSectionId) return
		try {
			const res = await ReadLectureContent(activeSectionId)
			setBlocks(res?.items || [])
		} catch (err) {
			console.error('Ошибка при чтении контента:', err)
		}
	}

	useEffect(() => {
		if (activeSectionId && activeType !== 'test') {
			readContent()
		}
	}, [activeSectionId, activeType])

	// Дебаунс обновления данных
	const debouncedUpdate = useMemo(
		() =>
			debounce(async (sectionId, blockId, body, type) => {
				try {
					await UpdateLectureContent(sectionId, blockId, body, type)
				} catch (err) {
					console.error('Ошибка обновлении блока (debounce):', err)
				}
			}, 500),
		[],
	)

	// Отправка апдейтов
	const putContentInBlock = useCallback(
		async (blockId, body, type) => {
			if (!DEBOUNCED_TYPES.includes(type)) {
				try {
					await UpdateLectureContent(activeSectionId, blockId, body, type)
					readContent()
				} catch (err) {
					console.error('Ошибка обновления блока:', err)
				}
				return
			}

			// Пропущен первый рендер
			if (firstRenderMap.current[blockId] === undefined) {
				firstRenderMap.current[blockId] = false
				return
			}

			// Проверка на отправку пустых данных
			if (
				body === undefined ||
				body === null ||
				(typeof body === 'string' && body.trim() === '')
			) {
				return
			}

			debouncedUpdate(activeSectionId, blockId, body, type)
		},
		[activeSectionId, debouncedUpdate],
	)

	// Добавление нового блока
	const addBlock = async type => {
		if (!activeSectionId) return
		try {
			await AppendLectureContent(activeSectionId, type)
			readContent()
		} catch (err) {
			console.error('Ошибка при добавлении блока:', err)
		}
	}

	// Удаление блока по `block.id`
	const handleRemove = async blockId => {
		if (!activeSectionId || !blockId) return
		try {
			await DeleteBlock(activeSectionId, blockId)
			readContent()
		} catch (err) {
			console.error('Ошибка при удалении блока:', err)
		}
	}

	// Удаление прикрепленного файла/изображения
	const handleRemoveFile = async (fileType = 'file', blockId, fileId) => {
		console.log('handleRemove - ', fileType, fileId)
		try {
			if (fileType === 'image') {
				await DeleteImage(blockId, fileId)
			} else {
				await DeleteFile(blockId, fileId)
			}
			readContent()
		} catch (err) {
			console.error('Ошибка при удалении файла:', err)
		}
	}

	const showConstructorMenu =
		activeType !== 'test' && activeSectionId && role !== 'student' && isEdit

	return (
		<div className='min-h-[70vh]'>
			<div className='flex flex-col gap-3 p-2'>
				{activeType === 'test' ? (
					role === 'student' ? (
						<StudentTestView activeSectionId={activeSectionId} />
					) : (
						<TestManager isEdit={isEdit} />
					)
				) : (
					<div className='flex flex-col gap-4'>
						{blocks?.map((item, i) => {
							const { type, block } = item
							if (!block) return null

							const Component = COMPONENT_MAP[type]
							if (!Component) return null

							const isSpecialBlock = [
								'callout',
								'formula',
								'code',
								'text',
								'button',
								'table',
							].includes(type)

							return (
								<motion.div
									key={block.id || i}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: i * 0.1,
										ease: 'easeOut',
									}}
								>
									<Component
										data={isSpecialBlock ? block.content : block}
										isEdit={role !== 'student' && isEdit}
										onChange={data => putContentInBlock(block.id, data, type)}
										onDelete={() => handleRemove(block.id)}
										courseId={courseId}
										sectionId={activeSectionId}
										onDeleteFile={(fileType, fileId) =>
											handleRemoveFile(fileType, block.id, fileId)
										}
									/>
								</motion.div>
							)
						})}

						{role === 'student' && activeType === 'practice' && (
							<StudentPracticeView
								activeSectionId={activeSectionId}
								courseId={courseId}
							/>
						)}

						<Show when={showConstructorMenu}>
							<ConstructorMenu onAdd={type => addBlock(type)} />
						</Show>
					</div>
				)}
			</div>
		</div>
	)
}
