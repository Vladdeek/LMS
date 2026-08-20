import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { FileManager } from '../../components/Organisms/ConstructorViews/FilesImport'

const Attachment = () => {
	const { courseId } = useParams()

	// Стейты для FileManager
	const [attachments, setAttachments] = useState([])
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)

	// Стейты для фильтрации студентов (сохранены из оригинальной логики)
	const [groups, setGroups] = useState([])
	const [lessons, setLessons] = useState({})
	const [students, setStudents] = useState([])
	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)
	const [searchStudents, setSearchStudents] = useState('')
	const [isSearchLoading, setIsSearchLoading] = useState(false)

	// Функция обновления списка файлов курса
	const fetchFiles = useCallback(async () => {
		if (!courseId) return
		try {
			const mappedFiles = await courseApi.fetchAttachments(courseId)
			setAttachments(mappedFiles)
		} catch (e) {
			console.error('Ошибка при получении файлов:', e)
		}
	}, [courseId])

	// Инициализация файлов при монтировании
	useEffect(() => {
		fetchFiles()
	}, [fetchFiles])

	// Инициализация списков Групп и Уроков для студентов
	useEffect(() => {
		if (!courseId) return

		let isMounted = true
		const initFilterData = async () => {
			try {
				const [fetchedGroups, fetchedLessons] = await Promise.all([
					courseApi.fetchLinkedGroups(courseId),
					courseApi.fetchLessons(courseId),
				])
				if (isMounted) {
					setGroups(fetchedGroups)
					setLessons(fetchedLessons)
				}
			} catch (err) {
				console.error('Ошибка инициализации фильтров:', err)
			}
		}

		initFilterData()
		return () => {
			isMounted = false
		}
	}, [courseId])

	// Загрузка студентов с дебаунсом (сохранено из вашей логики)
	useEffect(() => {
		if (!courseId) return

		setIsSearchLoading(true)

		const lessonKeys = Object.keys(lessons)
		const lessonKey =
			selectedLesson !== null && selectedLesson !== undefined
				? lessonKeys[selectedLesson]
				: null

		const params = {
			...(searchStudents && { term: searchStudents }),
			...(selectedGroup && { group_name: groups[selectedGroup] }),
			...(lessonKey && { module_section_id: lessons[lessonKey] }),
			...(selectedFilter && selectedFilter),
		}

		const timer = setTimeout(async () => {
			try {
				const data = await courseApi.fetchStudents(courseId, params)
				setStudents(data)
			} catch (e) {
				console.error('Ошибка получения студентов:', e)
			} finally {
				setIsSearchLoading(false)
			}
		}, 500)

		return () => clearTimeout(timer)
	}, [
		searchStudents,
		selectedGroup,
		selectedFilter,
		selectedLesson,
		lessons,
		groups,
		courseId,
	])

	// Хэндлер загрузки нового файла через FileManager
	const handleUpload = async rawFile => {
		if (!courseId || !rawFile) return

		setIsUploading(true)
		setUploadProgress(0)

		try {
			await courseApi.uploadFile(courseId, rawFile, percent => {
				setUploadProgress(percent)
			})
			// Искусственная задержка для красивого завершения анимации
			setTimeout(() => {
				setIsUploading(false)
				setUploadProgress(0)
				fetchFiles() // Перезапрашиваем список файлов
			}, 400)
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error)
			setIsUploading(false)
			setUploadProgress(0)
		}
	}

	// Хэндлер удаления одного файла
	const handleDeleteFile = async fileId => {
		const targetFile = attachments.find(f => f.id === fileId)
		if (!targetFile || !courseId) return

		try {
			await courseApi.deleteAttachment(
				courseId,
				targetFile.id,
				targetFile.file_path,
			)
			fetchFiles() // Обновляем список файлов
		} catch (error) {
			console.error('Ошибка при удалении файла:', error)
		}
	}

	// Хэндлер для скачивания файла
	const handleDownload = file => {
		if (file?.file_path) {
			// Если file_path содержит полный URL, открываем его, иначе можно скомпоновать с доменом
			window.open(file.file_path, '_blank')
		}
	}

	// Формируем структуру данных, которую ожидает FileManager в пропсе `data`
	const fileManagerData = {
		type: 'files',
		files: attachments,
	}

	return (
		<div>
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(77.5vh-100px)] overflow-hidden flex flex-col p-2'>
				<h1 className='text-2xl text-[var(--black)] font-medium my-2 mx-4'>
					Прикрепленные файлы к курсу
				</h1>

				<FileManager
					data={fileManagerData}
					isEdit={true} // Переключаем в true, если это страница редактирования
					sectionId={courseId} // Передаем ID курса в качестве контекста секции
					isUploading={isUploading}
					progress={uploadProgress}
					onUpload={handleUpload}
					onDeleteFile={handleDeleteFile}
					onDownload={handleDownload}
					// DelComponent={() => console.log('Удаление всего блока')} // Если нужно удалять весь компонент кнопкой RemoveButton
				/>
			</div>
		</div>
	)
}

export default Attachment
