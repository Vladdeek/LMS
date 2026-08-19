import { Ban, ChevronsRight, GripVertical } from 'lucide-react'
import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { RadioButton } from '../../components/Buttons'
import Loader from '../../components/Loader'
import BasicPagination from '../../components/Pagination'
import { SearchInput } from '../../components/Inputs'
import { accessApi } from '../../../service/APIs/Access'

const ENTITY = {
	STUDENTS: 'students',
	TEACHERS: 'teachers',
}

// Мемоизация дочерних компонентов для предотвращения лишних перерисовок списка
const GroupComponent = memo(
	({
		id,
		number,
		lvl,
		course,
		studentsLength,
		onRemove,
		onAdd,
		dragged,
		Accessed,
		onDragStart,
		onDragEnd,
	}) => {
		const handleAction = () => (Accessed ? onRemove?.(id) : onAdd?.(id))

		return (
			<>
				{/* Desktop */}
				<div
					className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)] items-center'
					draggable
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
				>
					<p className='col-span-2 text-center'>{number}</p>
					<p className='col-span-2 text-center'>{lvl}</p>
					<p className='col-span-2 text-center'>{course}</p>
					<p className='col-span-2 text-center'>{studentsLength}</p>
					<div className='col-span-1 flex justify-center gap-3'>
						<GripVertical
							className={dragged === id ? 'cursor-grabbing' : 'cursor-grab'}
						/>
						{Accessed ? (
							<Ban className='cursor-pointer' onClick={handleAction} />
						) : (
							<ChevronsRight
								className='cursor-pointer'
								onClick={handleAction}
							/>
						)}
					</div>
				</div>
				{/* Mobile */}
				<div
					className='min-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] flex items-center justify-between rounded-lg p-4 text-[var(--black)]'
					draggable
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
				>
					<div className='flex flex-col items-start'>
						<p className='text-3xl'>{number}</p>
						<p className='text-xl'>
							{course}-й курс {lvl && `(${lvl})`}
						</p>
						<p className='text-lg text-[var(--middle)]'>
							Количество студентов - {studentsLength}
						</p>
					</div>
					{Accessed ? (
						<Ban className='cursor-pointer' onClick={handleAction} />
					) : (
						<ChevronsRight className='cursor-pointer' onClick={handleAction} />
					)}
				</div>
			</>
		)
	},
)

const TeacherComponent = memo(
	({
		id,
		name,
		onRemove,
		onAdd,
		dragged,
		Accessed,
		onDragStart,
		onDragEnd,
		isCreator,
	}) => {
		const ActionIcon = Accessed ? Ban : ChevronsRight
		const handleAction = () =>
			!isCreator && (Accessed ? onRemove?.(id) : onAdd?.(id))

		const containerClass = `${isCreator ? 'opacity-50 pointer-events-none' : ''} bg-[var(--white)] shadow-[var(--shadow)] rounded-lg text-[var(--black)]`

		return (
			<>
				{/* Desktop */}
				<div
					className={`${containerClass} max-xl:hidden grid grid-cols-9 py-[10px] items-center`}
					draggable={!isCreator}
					onDragStart={!isCreator ? onDragStart : undefined}
					onDragEnd={!isCreator ? onDragEnd : undefined}
				>
					<p className='col-span-8 px-4'>
						{name}{' '}
						{isCreator && (
							<span className='text-[var(--middle)]'>(создатель)</span>
						)}
					</p>
					<div className='col-span-1 flex justify-center gap-3'>
						<GripVertical
							className={dragged === id ? 'cursor-grabbing' : 'cursor-grab'}
						/>
						<ActionIcon className='cursor-pointer' onClick={handleAction} />
					</div>
				</div>
				{/* Mobile */}
				<div
					className={`${containerClass} min-xl:hidden flex items-center justify-between p-4`}
					draggable={!isCreator}
					onDragStart={!isCreator ? onDragStart : undefined}
					onDragEnd={!isCreator ? onDragEnd : undefined}
				>
					<p className='text-2xl'>
						{name}{' '}
						{isCreator && (
							<span className='text-[var(--middle)]'>(создатель)</span>
						)}
					</p>
					<ActionIcon className='cursor-pointer' onClick={handleAction} />
				</div>
			</>
		)
	},
)

const AccessBlock = ({
	title,
	mass,
	Accessed = false,
	onAdd,
	onRemove,
	onDropGroup,
	onSearchChange,
	searchValue,
	loading = false,
	searchLoading = false,
	onChange,
	onChangeChapter,
	onChangePage,
	pagecounts,
	page,
}) => {
	const [dragged, setDragged] = useState(null)
	const [selected, setSelected] = useState(0)
	const [selectedChapter, setSelectedChapter] = useState(0)

	const entityType =
		title ?? (selected === 0 ? ENTITY.STUDENTS : ENTITY.TEACHERS)
	const isStudents = entityType === ENTITY.STUDENTS

	useEffect(() => {
		onChange?.(selected)
		onChangeChapter?.(selectedChapter)
	}, [selected, selectedChapter, onChange, onChangeChapter])

	const headers = {
		students: ['Номер группы', 'Уровень обр.', 'Курс', 'Кол-во студентов', ''],
		teachers: ['ФИО преподавателя'],
	}

	const renderItem = (item, index) => (
		<motion.div
			key={item.id}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
		>
			{isStudents ? (
				<GroupComponent
					id={item.id}
					number={item.name}
					lvl={item.educational_level}
					course={item.course_level}
					studentsLength={item.count_students}
					onAdd={onAdd}
					onRemove={onRemove}
					dragged={dragged}
					Accessed={Accessed}
					onDragStart={e => {
						e.dataTransfer.setData('itemId', item.id)
						setDragged(item.id)
					}}
					onDragEnd={() => setDragged(null)}
				/>
			) : (
				<TeacherComponent
					id={item.id}
					name={item.mmis_teacher_name}
					onAdd={onAdd}
					onRemove={onRemove}
					dragged={dragged}
					Accessed={Accessed}
					onDragStart={e => {
						e.dataTransfer.setData('itemId', item.id)
						setDragged(item.id)
					}}
					onDragEnd={() => setDragged(null)}
					isCreator={item.is_creator}
				/>
			)}
		</motion.div>
	)

	return (
		<div
			className='w-full bg-[var(--white)] h-[72.5vh] rounded-xl shadow-[var(--shadow)] p-5 flex flex-col gap-5'
			onDrop={e => {
				e.preventDefault()
				const id = e.dataTransfer.getData('itemId')
				if (id) onDropGroup?.(id)
				setDragged(null)
			}}
			onDragOver={e => e.preventDefault()}
		>
			{/* Mobile Tabs */}
			<div className='flex gap-3 min-lg:hidden'>
				{['Недопущенные', 'Допущенные'].map((t, i) => (
					<RadioButton
						key={i}
						value={i}
						title={t}
						style='solid'
						checked={selectedChapter === i}
						onChange={() => setSelectedChapter(i)}
						width='100%'
					/>
				))}
			</div>

			<div className='flex gap-3 min-lg:hidden'>
				{['Группы студентов', 'Преподаватели'].map((t, i) => (
					<RadioButton
						key={i}
						value={i}
						title={t}
						style='solid'
						checked={selected === i}
						onChange={() => setSelected(i)}
					/>
				))}
			</div>

			{/* Desktop Tabs */}
			{!title && (
				<div className='flex gap-2 max-lg:hidden'>
					{['Группы студентов', 'Преподаватели'].map((t, i) => (
						<RadioButton
							key={i}
							value={i}
							title={t}
							style='solid'
							checked={selected === i}
							onChange={() => setSelected(i)}
						/>
					))}
				</div>
			)}

			{/* Search */}
			<SearchInput
				width='100%'
				height={48}
				onChange={onSearchChange}
				value={searchValue}
				loading={searchLoading}
			/>

			{/* Dynamic Headers Setup */}
			<div className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px]'>
				{headers[entityType].map((h, i) => (
					<p
						key={i}
						className={`${isStudents ? 'col-span-2' : 'col-span-9 px-4'} text-center text-[var(--black)] text-sm font-medium`}
					>
						{h}
					</p>
				))}
			</div>

			{/* List Container */}
			{loading ? (
				<div className='w-full h-full flex justify-center items-center'>
					<Loader />
				</div>
			) : (
				<div className='flex flex-col gap-3 overflow-y-scroll h-full hide-scrollbar p-2'>
					{mass?.length > 0 ? (
						mass.map(renderItem)
					) : (
						<p className='text-center text-[var(--middle)] mt-4'>Нет данных</p>
					)}
				</div>
			)}

			<BasicPagination
				count={pagecounts || 1}
				onPageChange={onChangePage}
				page={page}
			/>
		</div>
	)
}

const AccessManagement = ({ onChange }) => {
	const { courseId } = useParams()

	const [selectedEntity, setSelectedEntity] = useState(ENTITY.STUDENTS)
	const [selectedChapter, setSelectedChapter] = useState(0)

	const [linked, setLinked] = useState({ items: [], pages: 1 })
	const [unlinked, setUnlinked] = useState({ items: [], pages: 1 })

	const [searchLinked, setSearchLinked] = useState('')
	const [searchUnlinked, setSearchUnlinked] = useState('')

	const [loading, setLoading] = useState(null)
	const [linkedPage, setLinkedPage] = useState(1)
	const [unlinkedPage, setUnlinkedPage] = useState(1)

	// Стабильный метод получения данных без генерации лишних ссылок в памяти
	const fetchData = useCallback(
		async (type, linkedFlag, term = '') => {
			const page = linkedFlag === 'linked' ? linkedPage : unlinkedPage
			setLoading(linkedFlag === 'linked' ? 1 : 0)

			try {
				const res =
					linkedFlag === 'linked'
						? await accessApi.getLinked(type, courseId, page, term)
						: await accessApi.getUnlinked(type, courseId, page, term)

				if (linkedFlag === 'linked') setLinked(res.data)
				else setUnlinked(res.data)
			} catch (error) {
				console.error(`Ошибка при загрузке ${linkedFlag} данных:`, error)
			} finally {
				setLoading(null)
			}
		},
		[courseId, linkedPage, unlinkedPage],
	)

	// Эффект для дебаунса поисковых запросов и пагинации
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchData(selectedEntity, 'linked', searchLinked)
			fetchData(selectedEntity, 'unlinked', searchUnlinked)
		}, 400)

		return () => clearTimeout(timer)
	}, [selectedEntity, searchLinked, searchUnlinked, fetchData])

	// Сброс страниц при смене сущности (Студент / Преподаватель)
	useEffect(() => {
		setLinkedPage(1)
		setUnlinkedPage(1)
	}, [selectedEntity])

	useEffect(() => {
		onChange?.(linked)
	}, [linked, onChange])

	const handleAdd = useCallback(
		async id => {
			try {
				await accessApi.addAccess(selectedEntity, courseId, id)
				fetchData(selectedEntity, 'linked', searchLinked)
				fetchData(selectedEntity, 'unlinked', searchUnlinked)
			} catch (err) {
				console.error(err)
			}
		},
		[selectedEntity, courseId, fetchData, searchLinked, searchUnlinked],
	)

	const handleRemove = useCallback(
		async id => {
			try {
				await accessApi.removeAccess(selectedEntity, courseId, id)
				fetchData(selectedEntity, 'linked', searchLinked)
				fetchData(selectedEntity, 'unlinked', searchUnlinked)
			} catch (err) {
				console.error(err)
			}
		},
		[selectedEntity, courseId, fetchData, searchLinked, searchUnlinked],
	)

	return (
		<>
			{/* Desktop View */}
			<div className='grid grid-cols-2 gap-5 max-lg:hidden'>
				<AccessBlock
					mass={unlinked?.items}
					onAdd={handleAdd}
					onDropGroup={handleRemove} // Возврат обратно drag-and-drop'ом
					onSearchChange={e => setSearchUnlinked(e.target.value)}
					searchValue={searchUnlinked}
					loading={loading === 0}
					onChange={i =>
						setSelectedEntity(i === 0 ? ENTITY.STUDENTS : ENTITY.TEACHERS)
					}
					onChangePage={setUnlinkedPage}
					pagecounts={unlinked?.pages}
					page={unlinkedPage}
				/>

				<AccessBlock
					title={selectedEntity}
					mass={linked?.items}
					Accessed
					onRemove={handleRemove}
					onDropGroup={handleAdd} // Принятие элемента drag-and-drop'ом
					onSearchChange={e => setSearchLinked(e.target.value)}
					searchValue={searchLinked}
					loading={loading === 1}
					onChangePage={setLinkedPage}
					pagecounts={linked?.pages}
					page={linkedPage}
				/>
			</div>

			{/* Mobile View */}
			<div className='min-lg:hidden'>
				<AccessBlock
					title={selectedChapter === 1 ? selectedEntity : undefined}
					mass={selectedChapter === 0 ? unlinked?.items : linked?.items}
					Accessed={selectedChapter === 1}
					onAdd={handleAdd}
					onRemove={handleRemove}
					onSearchChange={e =>
						selectedChapter === 0
							? setSearchUnlinked(e.target.value)
							: setSearchLinked(e.target.value)
					}
					searchValue={selectedChapter === 0 ? searchUnlinked : searchLinked}
					loading={selectedChapter === 0 ? loading === 0 : loading === 1}
					onChange={i =>
						setSelectedEntity(i === 0 ? ENTITY.STUDENTS : ENTITY.TEACHERS)
					}
					onChangeChapter={setSelectedChapter}
					onChangePage={selectedChapter === 0 ? setUnlinkedPage : setLinkedPage}
					pagecounts={selectedChapter === 0 ? unlinked?.pages : linked?.pages}
					page={selectedChapter === 0 ? unlinkedPage : linkedPage}
				/>
			</div>
		</>
	)
}

export default AccessManagement
