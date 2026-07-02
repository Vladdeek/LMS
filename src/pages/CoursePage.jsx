import {
	ChevronUp,
	Package,
	BookMarked,
	NotebookPen,
	LaptopMinimalCheck,
	Text,
	Code,
	Image,
	Film,
	Files,
	Table,
	AudioLines,
	Layers2,
	SquareFunction,
	MousePointerClick,
	Loader,
	FlaskConical,
	FilePlus2,
	Plus,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useSearchParams } from 'react-router-dom'
import { TextEditor } from '../components/ConstructorViews/TextEditor'
import { PhotoBlock } from '../components/ConstructorViews/PhotoImport'
import { VideoImport } from '../components/ConstructorViews/VideoImport'
import { CodeUploader } from '../components/ConstructorViews/CodeImport'
import { FileManager } from '../components/ConstructorViews/FilesImport'
import { Formula } from '../components/ConstructorViews/FormulaConstructor'
import { ButtonConstructor } from '../components/ConstructorViews/ButtonConstructor'
import { Callout } from '../components/ConstructorViews/Callout'
import { Checkbox, DefaultButton } from '../components/Buttons'
import { InputDefault, TimeLimitInput } from '../components/Inputs'
import {
	CreateCourse,
	CreateLesson,
	CreateModule,
	ReadCourseById,
} from '../../service/APIs/Couses'
import {
	AppendLectureContent,
	DeleteBlock,
	DeleteFile,
	ReadLectureContent,
	UpdateLectureContent,
} from '../../service/APIs/LectureContent'
import { debounce } from 'lodash'
import { Me } from '../../service/APIs/Authorization'
import {
	AddOptionOnQuestion,
	AddQuestion,
	DeleteOption,
	EditQuestionType,
	EditTest,
	GetDetailQuestion,
	GetQuestions,
	GetSession,
} from '../../service/APIs/Test'
import TestManager from '../components/TestManager/TestManager'
import { formatTime } from '../../service/utils/formatTime'

const COMPONENT_MAP = {
	text: TextEditor,
	images: PhotoBlock,
	video: VideoImport,
	code: CodeUploader,
	files: FileManager,
	formula: Formula,
	button: ButtonConstructor,
	callout: Callout,
}

// Если LESSON_TYPES импортируется из другого места, этот массив можно удалить
const DEFAULT_LESSON_TYPES = [
	{
		label: 'Лекция',
		apiType: 'lecture',
		icon: <BookMarked size={18} />,
		description: 'Теоретический материал с блоками текста и медиа.',
	},
	{
		label: 'Практика',
		apiType: 'practice',
		icon: <NotebookPen size={18} />,
		description: 'Практическое задание для закрепления материала.',
	},
	{
		label: 'Тест',
		apiType: 'test',
		icon: <LaptopMinimalCheck size={18} />,
		description: 'Контрольное тестирование для проверки знаний.',
	},
]

const CreateItemButton = ({
	type = 'module',
	onAdd,
	LESSON_TYPES = DEFAULT_LESSON_TYPES,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [step, setStep] = useState(0)
	const [title, setTitle] = useState('')
	const [selectedTypeIndex, setSelectedTypeIndex] = useState(0)
	const [isNameValid, setIsNameValid] = useState(false)

	const isModule = type === 'module'

	const resetState = () => {
		setIsOpen(false)
		setStep(0)
		setTitle('')
		setIsNameValid(false)
	}

	const handleSave = () => {
		if (isModule) {
			onAdd({ name: title })
		} else {
			onAdd({
				name: title, // Меняем 'title' на 'name', чтобы соответствовать аргументам API
				module_content_type: LESSON_TYPES[selectedTypeIndex].apiType,
			})
		}
		resetState()
	}

	return (
		<div className='w-full'>
			<DefaultButton
				invert={true}
				width='w-full'
				onClick={() => setIsOpen(prev => !prev)}
			>
				<div className='flex items-center justify-center gap-3 w-full'>
					{isModule ? <Package size={20} /> : <FilePlus2 size={20} />}
					<span style={{ fontSize: '16px' }}>
						{isModule ? 'Добавить модуль' : 'Добавить занятие'}
					</span>
				</div>
			</DefaultButton>

			{isOpen && (
				<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 mt-3 flex flex-col gap-3 z-10 w-full'>
					{/* Шаг выбора типа (только для уроков) */}
					{!isModule && step === 0 && (
						<>
							<div className='grid grid-cols-3 gap-2'>
								{LESSON_TYPES.map((item, index) => (
									<button
										key={index}
										type='button'
										onClick={() => setSelectedTypeIndex(index)}
										className={`flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all
                                            ${selectedTypeIndex === index ? 'bg-[var(--hero-epta)] text-white' : 'bg-[var(--bg)] text-[var(--middle)]'}
                                            hover:scale-105 cursor-pointer`}
									>
										<span>{item.icon}</span>
										<span className='font-medium'>{item.label}</span>
									</button>
								))}
							</div>
							<p className='text-[var(--middle)] text-center text-sm'>
								{LESSON_TYPES[selectedTypeIndex].description}
							</p>
							<div className='flex justify-end mt-2'>
								<DefaultButton width='w-full' onClick={() => setStep(1)}>
									Далее
								</DefaultButton>
							</div>
						</>
					)}

					{/* Шаг ввода названия */}
					{(isModule || step === 1) && (
						<div className='flex flex-col gap-3'>
							<InputDefault
								title={isModule ? 'Название модуля' : 'Название занятия'}
								placeholder='Введите название'
								required={true}
								value={title}
								onChange={e => setTitle(e.target.value)}
								onStatusChange={setIsNameValid}
							/>
							<div className='flex justify-between gap-2 mt-2'>
								{!isModule && (
									<DefaultButton
										invert={true}
										width='w-full'
										flexParams='justify-center'
										onClick={() => setStep(0)}
									>
										Назад
									</DefaultButton>
								)}
								<DefaultButton
									width='w-full'
									flexParams='justify-center'
									onClick={handleSave} // ИСПРАВЛЕНО: Вместо setStep(0) вызываем сохранение данных
									disabled={!isNameValid}
								>
									{isModule ? 'Добавить модуль' : 'Создать'}
								</DefaultButton>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

const ContentView = ({
	content,
	onBlocksChange,
	SectionType,
	SectionName,
	isLoading,
	sectionId,
	onSectionTypeChange,
	isEdit,
	clearSelection,
}) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [blocks, setBlocks] = useState([])
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const { courseId } = useParams()

	// Реф-карта для отслеживания ПЕРВОГО рендера КАЖДОГО блока по его id
	const firstRenderMap = useRef({})

	// Сбрасываем карту первых рендеров, если пользователь переключился на другую лекцию
	useEffect(() => {
		firstRenderMap.current = {}
	}, [sectionId])

	const handleRemove = async blockId => {
		console.log('delete block - ', blockId)
		try {
			await DeleteBlock(sectionId, blockId)
			readContent()
		} catch (err) {}
	}

	const handleRemoveFile = async (blockId, fileId) => {
		try {
			await DeleteFile(blockId, fileId)
			readContent()
		} catch (err) {}
	}

	const addBlock = async (id, type) => {
		try {
			await AppendLectureContent(id, type)
			readContent()
		} catch (err) {}
	}

	const readContent = async () => {
		try {
			const res = await ReadLectureContent(sectionId)
			setBlocks(res?.items)
		} catch (err) {}
	}

	// 1. Выносим список типов, которым нужен дебаунс, в константу
	const DEBOUNCED_TYPES = ['text', 'callout', 'formula']

	// 2. Создаем дебаунс-функцию.
	// Важно обернуть в useMemo, чтобы debounce не пересоздавался на каждом рендере
	const debouncedUpdate = useMemo(
		() =>
			debounce(async (sectionId, blockId, body, type) => {
				try {
					await UpdateLectureContent(sectionId, blockId, body, type)
				} catch (err) {
					console.error(err)
				}
			}, 500),
		[], // пустой массив, чтобы ссылка была стабильной
	)

	// 3. Основная функция, которую ты вызываешь
	const putContentInBlock = useCallback(
		async (blockId, body, type) => {
			// ЕСЛИ ТИП НЕ НУЖДАЕТСЯ В ДЕБАУНСЕ — отправляем мгновенно и выходим
			if (!DEBOUNCED_TYPES.includes(type)) {
				try {
					await UpdateLectureContent(sectionId, blockId, body, type)
				} catch (err) {
					console.error(err)
				}
				return
			}

			// --- ДАЛЬШЕ ЛОГИКА ТОЛЬКО ДЛЯ text, callout, formula ---

			// Проверка на первый (холостой) рендер
			if (firstRenderMap.current[blockId] === undefined) {
				firstRenderMap.current[blockId] = false
				console.log(
					`[Блокировка]: Пропущен первый рендер для ${type} (${blockId})`,
				)
				return
			}

			// Защита от "хуйни с пустым текстом" (дополнительный предохранитель)
			// Если body пришел пустой (или null/undefined), не пускаем его в дебаунс
			if (
				body === undefined ||
				body === null ||
				(typeof body === 'string' && body.trim() === '')
			) {
				console.log(
					`[Блокировка]: Попытка отправить пустой контент для ${type} (${blockId})`,
				)
				return
			}

			// Если все проверки пройдены — пускаем в дебаунс
			debouncedUpdate(sectionId, blockId, body, type)
		},
		[sectionId, debouncedUpdate],
	)

	useEffect(() => {
		if (sectionId) {
			readContent() // Теперь это вызовется при смене sectionId
		}
	}, [sectionId])

	return (
		<div className='h-fit overflow-y-scroll hide-scrollbar'>
			<div className='flex flex-col gap-3 p-2'>
				{SectionType === 'test' ? (
					<TestManager />
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
							].includes(type)

							return (
								<motion.div
									key={block.id}
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
										isEdit={isEdit}
										onChange={data => putContentInBlock(block.id, data, type)}
										onDelete={() => handleRemove(block.id)}
										courseId={courseId}
										sectionId={sectionId}
										onDeleteFile={data => handleRemoveFile(block.id, data)}
									/>
								</motion.div>
							)
						})}

						{isEdit && (
							<ConstructorMenu onAdd={type => addBlock(sectionId, type)} />
						)}
					</div>
				)}
			</div>
		</div>
	)
}

const ConstructorMenu = ({ onAdd }) => {
	const buttons = [
		{
			title: 'Текст',
			type: 'text',
			icon: <Text size={32} />,
		},
		{
			title: 'Код',
			type: 'code',
			icon: <Code size={32} />,
		},
		{
			title: 'Фото',
			type: 'images',
			icon: <Image size={32} />,
		},
		{
			title: 'Видео',
			type: 'video',
			icon: <Film size={32} />,
		},
		{
			title: 'Файлы',
			type: 'files',
			icon: <Files size={32} />,
		},
		// {
		// 	title: 'Таблица',
		// 	type: 'table',
		// 	icon: <Table size={32} />,
		// },
		// {
		// 	title: 'Аудио',
		// 	type: 'audio',
		// 	icon: <AudioLines size={32} />,
		// },
		{
			title: 'Выноска',
			type: 'callout',
			icon: <Layers2 size={32} />,
		},
		{
			title: 'Формула',
			type: 'formula',
			icon: <SquareFunction size={32} />,
		},
		{
			title: 'Кнопка',
			type: 'button',
			icon: <MousePointerClick size={32} />,
		},
	]

	return (
		<>
			<div className='grid lg:grid-cols-4 grid-cols-2 gap-2 p-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] w-fit'>
				{buttons.map((item, index) => (
					<button
						key={index}
						onClick={() => onAdd(item.type)}
						className='flex flex-col aspect-square items-center justify-center gap-2 bg-[var(--light-middle)] rounded-xl h-25 hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer text-[var(--middle)] transition-all duration-100'
					>
						{item.icon}
						<p className='text-base '>{item.title}</p>
					</button>
				))}
			</div>
		</>
	)
}

const Module = ({ title, index, isExpanded, onToggle, children }) => {
	return (
		<div className='flex flex-col gap-2 mb-4'>
			<div className='flex items-center justify-between bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-3'>
				<div className='flex items-center gap-3 text-[var(--black)]'>
					<Package size={20} className='text-[var(--middle)]' />
					<div>
						<p className='text-xs text-[var(--middle)]'>Модуль {index}</p>
						<h3 className='font-semibold text-sm leading-tight text-[var(--black)]'>
							{title}
						</h3>
					</div>
				</div>

				<button
					onClick={onToggle}
					className='p-1.5 hover:bg-[var(--light-middle)] text-[var(--black)] rounded-lg cursor-pointer transition-all'
				>
					<ChevronUp
						className={`${!isExpanded ? 'rotate-180' : ''} transition-all`}
						size={18}
					/>
				</button>
			</div>

			{/* Отрисовка внутреннего контента (секций) */}
			{isExpanded && (
				<div className='flex flex-col gap-2 pl-4 transition-all'>
					{children}
				</div>
			)}
		</div>
	)
}

// Компонент Контента (Лекция/Практика/Тест)
const Content = ({ type, title, isSelected, onClick, role }) => {
	const icons = {
		lecture: <BookMarked size={18} />,
		practice: <NotebookPen size={18} />,
		test: <LaptopMinimalCheck size={18} />,
	}

	const labels = {
		lecture: 'Лекция',
		practice: 'Практика',
		test: 'Тест',
	}

	const [score, setScore] = useState(3)

	// Вычисляем статус прямо при рендере
	const getStatus = s => {
		if (s >= 4) return 'good'
		if (s >= 3) return 'middle'
		return 'bad'
	}

	const status = getStatus(score)

	const colorClasses = {
		bad: 'bg-[var(--red-base)] text-[var(--red-surface)]',
		middle: 'bg-[var(--yellow-base)] text-[var(--yellow-surface)]',
		good: 'bg-[var(--green-base)] text-[var(--green-surface)]',
	}

	return (
		<div
			onClick={onClick}
			className={`flex flex-col gap-1 w-full p-3 rounded-xl transition-all shadow-[var(--shadow)] border 
                ${
									isSelected
										? 'border-[var(--hero)] bg-[var(--transparent-hero)]'
										: 'border-transparent bg-[var(--white)] hover:bg-[var(--light-middle)] cursor-pointer'
								}`}
		>
			<div className='flex items-center justify-between w-full'>
				<div className='flex items-center gap-2'>
					<span
						className={
							isSelected ? 'text-[var(--hero)]' : 'text-[var(--middle)]'
						}
					>
						{icons[type]}
					</span>
					<div className='flex flex-col'>
						<span className='text-[10px] uppercase tracking-wider text-[var(--middle)] font-bold'>
							{labels[type]}
						</span>
						<p className='font-medium text-sm text-[var(--black)]'>{title}</p>
					</div>
				</div>
				{type === 'test' ||
					(role === 'student' && (
						<div
							className={`flex items-center justify-center h-7 w-7 rounded-md ${
								colorClasses[status]
							} text-lg`}
						>
							{score}
						</div>
					))}
			</div>
		</div>
	)
}

const ContentHeader = ({ role }) => {
	const [searchParams, setSearchParams] = useSearchParams()

	// Достаем текущий questionId из URL (строка, содержащая UUID)
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const [questionsData, setQuestionsData] = useState([])

	const [totalTime, setTotalTime] = useState(0)
	const [timeLeft, setTimeLeft] = useState()
	const [sessionIsActive, setSessionIsActive] = useState(false)
	const [accessToTheTest, setAccessToTheTest] = useState(false)

	const progressWidth = (timeLeft / totalTime) * 100

	console.log(timeLeft)

	useEffect(() => {
		if (timeLeft <= 0) return

		const timer = setInterval(() => {
			setTimeLeft(prev => Math.max(prev - 1, 0))
		}, 1000) // Таймер обновляется каждую секунду

		return () => clearInterval(timer)
	}, [timeLeft])

	useEffect(() => {
		const getQuestions = async () => {
			try {
				const res = await GetQuestions(activeSection)
				if (res) {
					setQuestionsData(res)
					setTotalTime(res.time_limit)
				}
			} catch (err) {
				console.log(err)
			}
		}

		getQuestions()
	}, [activeSection])

	useEffect(() => {
		setSessionIsActive(false)

		const getSession = async () => {
			try {
				const res = await GetSession(activeSection)
				const currentTime = Date.now() / 1000 // Текущее время в секундах
				const tl = Math.floor(currentTime - res.expire_at)
				setSessionIsActive(true)
				setTimeLeft(totalTime - tl)
			} catch (err) {
				// Обработка ошибки
				setSessionIsActive(false)
			}
		}

		if (role === 'student' && activeSection) {
			getSession()
		}
	}, [activeSection, role])

	useEffect(() => {
		if (sessionIsActive === true && timeLeft > 0 && role === 'student') {
			setAccessToTheTest(true)
		} else {
			setAccessToTheTest(false)
		}
	}, [sessionIsActive, timeLeft, role])

	const changeTimeLimit = async time => {
		if (time > 0) {
			try {
				await EditTest(activeSection.id, null, null, time, null)
				setQuestionsData(res)
			} catch (err) {
				console.log(err)
			}
		}
	}

	const icons = {
		lecture: <BookMarked size={18} />,
		practice: <NotebookPen size={18} />,
		test: <LaptopMinimalCheck size={18} />,
	}

	const labels = {
		lecture: 'Лекция',
		practice: 'Практика',
		test: 'Тест',
	}

	return (
		<div className='relative flex items-center justify-between w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pr-3 pl-4 py-2 overflow-hidden'>
			<div className='flex items-center gap-3'>
				{questionsData && (
					<>
						<span className={'text-[var(--middle)] h-full w-auto'}>
							{icons[questionsData.type]}
						</span>
						<div className='flex flex-col'>
							<p
								className={'text-[var(--middle)] text-sm uppercase font-medium'}
							>
								{labels[questionsData.type]}
							</p>
							<p className={'text-[var(--black)] text-lg'}>
								{questionsData.name}
							</p>
						</div>
					</>
				)}
			</div>

			{accessToTheTest && (
				<>
					<p className='w-25 text-center text-[var(--black)] font-semibold'>
						<p className='w-25 text-center text-[var(--black)] font-semibold'>
							{formatTime(timeLeft >= 0 ? timeLeft : 0)}
						</p>
					</p>
					<DefaultButton
						onClick={() => console.log('Завершить тест')}
						rounded={'rounded-lg'}
						width='w-fit'
						flexParams='justify-center'
					>
						Завершить тест
					</DefaultButton>
					{/* Прогресс-бар с динамической шириной */}
					<div
						style={{
							width: `${progressWidth}%`,
							transition: 'width 1s linear',
						}}
						className='absolute bg-[var(--hero)] bottom-0 left-0 h-1 rounded-full'
					></div>
				</>
			)}

			{role === 'teacher' && (
				<TimeLimitInput
					COUNT_QUESTION={questionsData?.question_ids?.length}
					value={questionsData?.time_limit}
					onChange={data => changeTimeLimit(data)}
				/>
			)}
		</div>
	)
}

const CoursePage = () => {
	const { courseId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [activeSectionId, setActiveSectionId] = useState(
		searchParams.get('section') || '',
	)
	const [activeType, setActiveType] = useState('')

	const [role, setRole] = useState()
	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setRole(res?.role)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	const [blocks, setBlocks] = useState([])
	const [isEdit, setIsEdit] = useState(false)
	const [modules, setModules] = useState([])
	const [isLoading, setIsLoading] = useState(true) // Состояние загрузки

	// Переносим чтение курса в useCallback, чтобы функцию можно было вызывать из других методов
	const fetchCourseData = useCallback(async () => {
		if (!courseId) return
		try {
			// Убираем setIsLoading(true) отсюда, чтобы интерфейс не «моргал» при создании уроков
			const res = await ReadCourseById(courseId)
			if (res && res.modules) {
				setModules(res.modules)

				// Если в URL еще не выбран section, выбираем первый доступный из пришедших данных
				if (!searchParams.get('section') && res.modules[0]?.sections[0]?.id) {
					setSearchParams(
						{ section: res.modules[0].sections[0].id },
						{ replace: true },
					)
				}
			}
		} catch (err) {
			console.error('Ошибка при загрузке курса:', err)
		} finally {
			setIsLoading(false)
		}
	}, [courseId, searchParams, setSearchParams])

	// Первый рендер и смена courseId
	useEffect(() => {
		setIsLoading(true)
		fetchCourseData()
	}, [courseId, fetchCourseData])

	// Поиск активной секции (лекции/теста) для отображения в шапке контента
	const activeSection = modules
		?.flatMap(m => m.content)
		.find(s => s.id === activeSectionId)

	const toggleModule = id => {
		setModules(prev =>
			prev.map(m => (m.id === id ? { ...m, isExpanded: !m.isExpanded } : m)),
		)
	}

	const handleSectionClick = id => {
		setSearchParams({ section: id }, { replace: true })
	}

	// Обработчики создания с async/await
	const createModule = async name => {
		try {
			await CreateModule(name, courseId)
			await fetchCourseData() // Обновляем данные с сервера
		} catch (err) {
			console.error('Ошибка при создании модуля:', err)
		}
	}

	const createLesson = async (name, module_content_type, module_id) => {
		try {
			await CreateLesson(name, module_content_type, module_id)
			await fetchCourseData() // Обновляем данные с сервера
		} catch (err) {
			console.error('Ошибка при создании урока:', err)
		}
	}

	const addBlock = type => setBlocks(prev => [...prev, { type, content: null }])

	const icons = {
		lecture: <BookMarked />,
		practice: <NotebookPen />,
		test: <LaptopMinimalCheck />,
	}

	const labels = {
		lecture: 'Лекция',
		practice: 'Практика',
		test: 'Тест',
	}

	useEffect(() => {
		const id = searchParams.get('section')
		setActiveSectionId(id)

		// Находим тип активной секции из массива модулей
		if (id && modules.length > 0) {
			const section = modules.flatMap(m => m.content).find(s => s.id === id)
			if (section) {
				setActiveType(section.type)
			}
		}
	}, [searchParams, modules])

	const [timeLeft, setTimeLeft] = useState()

	return (
		<div className='grid grid-cols-[350px_1fr] h-screen gap-6 pt-30 pb-10 '>
			{/* Боковая панель (Sidebar) */}
			<div className='w-full h-full overflow-y-auto bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)]'>
					Содержание курса
				</h2>
				{modules?.map((module, idx) => (
					<Module
						key={module.id}
						title={module.name}
						index={idx + 1}
						isExpanded={module.isExpanded}
						onToggle={() => toggleModule(module.id)}
					>
						{module?.content?.map((section, index) => (
							<motion.div
								key={section.id}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
							>
								<Content
									role={role}
									title={section.name}
									type={section.type}
									isSelected={activeSectionId === section.id}
									onClick={() => {
										handleSectionClick(section.id)
										setActiveType(section.type)
									}}
								/>
							</motion.div>
						))}

						{/* Кнопка создания УРОКА внутри модуля */}
						{role === 'teacher' && (
							<CreateItemButton
								type='lesson'
								onAdd={lessonData => {
									// lessonData содержит { name, module_content_type }
									createLesson(
										lessonData.name,
										lessonData.module_content_type,
										module.id,
									)
								}}
							/>
						)}
					</Module>
				))}

				{/* Кнопка создания МОДУЛЯ в самом низу списка */}
				{role === 'teacher' && (
					<CreateItemButton
						type='module'
						onAdd={moduleData => {
							// moduleData содержит { name }
							createModule(moduleData.name)
						}}
					/>
				)}
			</div>

			{/* Основной контент */}
			<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				{activeSection && <ContentHeader role={role} />}

				<div className='w-full h-full overflow-y-auto px-2 py-4'>
					{/* Передаем id активной секции внутрь ContentView, чтобы он знал, что загружать */}
					<ContentView
						isEdit={role === 'teacher' && true}
						sectionId={activeSectionId}
						SectionType={activeType}
					/>
				</div>
			</div>
		</div>
	)
}

export default CoursePage
