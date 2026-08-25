import { useState } from 'react'
import { motion } from 'framer-motion'
import { GroupItem } from '../Molecules/GroupItem'
import { TeacherItem } from '../Molecules/TeacherItem'
import { RadioGroup } from '../Molecules/RadioGroup'
import { SearchInput } from '../Molecules/InputFields/SearchInput'
import { BasicPagination } from '../Molecules/Pagination'
import { Loader } from '../Atoms/Loaders/Loader'
import { Show } from '../Atoms/Show'

const HEADERS = {
	students: ['Номер группы', 'Уровень обр.', 'Курс', 'Кол-во студентов', ''],
	teachers: ['Ф.И.О.'],
}

const ENTITY_OPTIONS = [
	{ value: 'students', label: 'Группы студентов' },
	{ value: 'teachers', label: 'Преподаватели' },
]

const CHAPTER_OPTIONS = [
	{ value: 0, label: 'Недопущенные' },
	{ value: 1, label: 'Допущенные' },
]

export const AccessBlock = ({
	title,
	mass = [],
	Accessed = false,
	onAdd,
	onRemove,
	onDropGroup,
	onSearchChange,
	searchValue,
	loading = false,
	searchLoading = false,
	selectedEntity,
	onEntityChange,
	selectedChapter,
	onChapterChange,
	onChangePage,
	pagecounts,
	page,
}) => {
	const [dragged, setDragged] = useState(null)
	const isStudents = selectedEntity === 'students'

	const renderItem = (item, index) => (
		<motion.div
			key={item.id}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
		>
			{isStudents ? (
				<GroupItem
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
						e.dataTransfer.setData('groupNumber', item.id)
						setDragged(item.id)
					}}
					onDragEnd={() => setDragged(null)}
				/>
			) : (
				<TeacherItem
					id={item.id}
					name={item.mmis_teacher_name}
					onAdd={onAdd}
					onRemove={onRemove}
					dragged={dragged}
					Accessed={Accessed}
					onDragStart={e => {
						e.dataTransfer.setData('groupNumber', item.id)
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
				const id = e.dataTransfer.getData('groupNumber')
				if (id) onDropGroup?.(id)
				setDragged(null)
			}}
			onDragOver={e => e.preventDefault()}
		>
			{/* Мобильные фильтры главок */}
			{onChapterChange && (
				<div className='min-lg:hidden'>
					<RadioGroup
						options={CHAPTER_OPTIONS}
						value={selectedChapter}
						onChange={onChapterChange}
						style='alt'
						wfull
					/>
				</div>
			)}

			{/* Мобильные переключатели сущностей */}
			{onEntityChange && (
				<div className='min-lg:hidden'>
					<RadioGroup
						options={ENTITY_OPTIONS}
						value={selectedEntity}
						onChange={onEntityChange}
					/>
				</div>
			)}

			{/* Десктопные переключатели сущностей */}
			<Show when={!title && onEntityChange}>
				<div className='max-lg:hidden'>
					<RadioGroup
						options={ENTITY_OPTIONS}
						value={selectedEntity}
						onChange={onEntityChange}
					/>
				</div>
			</Show>

			{/* Поиск */}
			<div className='flex gap-3'>
				<SearchInput
					width='100%'
					height={48}
					onChange={onSearchChange}
					value={searchValue}
					loading={searchLoading}
				/>
			</div>

			{/* Заголовки */}
			<div className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px]'>
				{HEADERS[selectedEntity]?.map((h, i) => (
					<p key={i} className='col-span-2 text-center text-[var(--black)]'>
						{h}
					</p>
				))}
			</div>

			{/* Список данных */}
			<Show
				when={!loading}
				fallback={
					<div className='flex h-full w-full justify-center items-center'>
						<Loader />
					</div>
				}
			>
				<div className='flex flex-col gap-3 overflow-y-scroll h-full hide-scrollbar p-2'>
					{mass?.map(renderItem)}
				</div>
			</Show>

			<BasicPagination
				count={pagecounts}
				onPageChange={onChangePage}
				page={page}
			/>
		</div>
	)
}
