import { useState } from 'react'
import { motion } from 'framer-motion'
import { LibraryBig } from 'lucide-react'
import ResponsiveSidebar from '../Molecules/ResponsiveSidebar'
import { ModuleItem } from './ModuleItem'
import { LessonItem } from './LessonItem'
import { CreateItemButton } from './CreateItemButton'
import { createLesson, createModule } from '../../api/CourseService'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { LESSON_LABELS } from '../../Constants/lessonTypes'
import { Show } from '../Atoms/Show'

export const CourseSidebar = ({
	role,
	modules,
	toggleModule,
	activeSectionId,
	handleSectionClick,
	setActiveType,
	createLessonHandler,
	createModuleHandler,
	onItemChange,
	onSuccess,
}) => {
	const { courseId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()

	const [isOpen, setIsOpen] = useState(false)

	const redirect = (type, id) => {
		// Создаем копию текущих параметров, чтобы НЕ СТЕРЕТЬ существующий параметр ?section=...
		const newParams = new URLSearchParams(searchParams)

		// Добавляем или обновляем только questionId
		newParams.set('type', type, 'section', id)

		// Обновляем URL строки браузера
		setSearchParams(newParams)
	}

	const CreateModule = async name => {
		try {
			await createModule(name, courseId)
			toast.success(`Модуль "${name}" успешно создан!`)
			onSuccess?.()
		} catch (error) {
			toast.error(`Не удалось создать модуль "${name}"!`)
		}
	}

	const CreateLesson = async (name, type, moduleId) => {
		try {
			const res = await createLesson(name, type, moduleId)
			toast.success(
				`${LESSON_LABELS[type]} "${name}" успешно ${type === 'test' ? 'создан!' : 'создана!'}`,
			)
			onSuccess?.()
			redirect(res.type, res.id)
		} catch (error) {
			toast.error(`Не удалось создать занятие`)
		}
	}

	return (
		<ResponsiveSidebar
			title='Содержание курса'
			triggerTitle='Содержимое'
			triggerIcon={LibraryBig}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<div className='w-full h-full overflow-y-auto p-2'>
				{modules?.map((module, idx) => (
					<ModuleItem
						key={module.id}
						title={module.name}
						index={idx + 1}
						id={module.id}
						isExpanded={module.isExpanded}
						onToggle={() => toggleModule(module.id)}
						onChange={onItemChange}
						length={modules?.length}
					>
						{module?.module_contents?.map((section, index) => (
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
								<LessonItem
									index={index}
									role={role}
									module_id={module.id}
									section_id={section.id}
									title={section.title}
									type={section.type}
									isSelected={activeSectionId === section.id}
									onClick={() => {
										handleSectionClick(section.type, section.id)
										setActiveType(section.type)
										setIsOpen(false)
									}}
									onChange={onItemChange}
									length={module?.content?.length}
								/>
							</motion.div>
						))}
						<Show when={role !== 'student'}>
							<CreateItemButton
								type='lesson'
								onAdd={lessonData =>
									CreateLesson(lessonData.name, lessonData.type, module.id)
								}
							/>
						</Show>
					</ModuleItem>
				))}
				<Show when={role !== 'student'}>
					<CreateItemButton
						type='module'
						onAdd={moduleData => CreateModule(moduleData.name)}
					/>
				</Show>
			</div>
		</ResponsiveSidebar>
	)
}
