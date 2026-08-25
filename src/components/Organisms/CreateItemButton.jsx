import { useState } from 'react'
import {
	BookMarked,
	FilePlus2,
	LaptopMinimalCheck,
	NotebookPen,
	Package,
} from 'lucide-react'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'
import { Show } from '../Atoms/Show'
import { LessonTypeSelector } from '../Molecules/LessonTypeSelector'
import { Input } from '../Molecules/InputFields/Input'
import { LESSON_TYPES } from '../../Constants/lessonTypes'
import { createModule } from '../../api/CourseService'

export const CreateItemButton = ({ type = 'module', onAdd }) => {
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
				name: title,
				type: LESSON_TYPES[selectedTypeIndex].apiType,
			})
		}
		resetState()
	}

	return (
		<div className='w-full'>
			<SubmitButton
				invert
				className='w-full'
				onClick={() => setIsOpen(prev => !prev)}
			>
				<div className='flex items-center justify-center gap-3 w-full'>
					{isModule ? <Package size={20} /> : <FilePlus2 size={20} />}
					<span style={{ fontSize: '16px' }}>
						{isModule ? 'Добавить модуль' : 'Добавить занятие'}
					</span>
				</div>
			</SubmitButton>

			<Show when={isOpen}>
				<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 mt-3 flex flex-col gap-3 z-10 w-full'>
					<Show when={!isModule && step === 0}>
						<>
							<LessonTypeSelector
								types={LESSON_TYPES}
								selectedIndex={selectedTypeIndex}
								onSelect={setSelectedTypeIndex}
							/>
							<div className='flex justify-end mt-2'>
								<SubmitButton className='w-full' onClick={() => setStep(1)}>
									Далее
								</SubmitButton>
							</div>
						</>
					</Show>

					<Show when={isModule || step === 1}>
						<div className='flex flex-col gap-3'>
							<Input
								title={isModule ? 'Название модуля' : 'Название занятия'}
								placeholder='Введите название'
								required={true}
								value={title}
								onChange={e => setTitle(e.target.value)}
								onStatusChange={setIsNameValid}
							/>
							<div className='flex justify-between gap-2 mt-2'>
								{!isModule && (
									<SubmitButton
										className='w-full'
										invert
										onClick={() => setStep(0)}
									>
										Назад
									</SubmitButton>
								)}
								<SubmitButton
									className='w-full'
									flexParams='justify-center'
									onClick={handleSave}
									disabled={!isNameValid}
								>
									{isModule ? 'Добавить модуль' : 'Создать'}
								</SubmitButton>
							</div>
						</div>
					</Show>
				</div>
			</Show>
		</div>
	)
}
