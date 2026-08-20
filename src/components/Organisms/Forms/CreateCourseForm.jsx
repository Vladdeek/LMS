import React from 'react'
import { motion } from 'framer-motion'
import { useCreateCourseForm } from '../../../hooks/useCreateCourseForm'
import { RadioGroup } from '../../Molecules/RadioGroup'
import { Input } from '../../Molecules/InputFields/Input'
import { TextArea } from '../../Molecules/InputFields/TextArea'
import { OptionInput } from '../../Molecules/InputFields/OptionInput'
import { CircleQuestionMark } from 'lucide-react'
import { PreviewInput } from '../../Molecules/InputFields/PreviewInput'
import { Loader } from '../../Atoms/Loaders/Loader'

// Константы опций для рендера
const tabOptions = [
	{ value: 0, label: 'Свободное' },
	{ value: 1, label: 'По нагрузке' },
]

const semesterOptions = [
	{ value: '1', label: '1-й Семестр' },
	{ value: '2', label: '2-й Семестр' },
]

const studyLevelOptions = [
	{ value: 0, label: 'Бакалавриат' },
	{ value: 2, label: 'Специалитет' },
	{ value: 1, label: 'Магистратура' },
]

const courseOptions = [
	{ value: 1, label: '1-й' },
	{ value: 2, label: '2-й' },
	{ value: 3, label: '3-й' },
	{ value: 4, label: '4-й' },
	{ value: 5, label: '5-й' },
	{ value: 6, label: '6-й' },
]

export const CreateCourseForm = ({ onCreate, onClose }) => {
	const {
		selectedTab,
		setSelectedTab,
		isCreateLoading,
		hintOpen,
		setHintOpen,
		yearsList,
		disciplinesList,
		formData,
		setIsNameValid,
		handleChange,
		handleDirectChange,
		handleSubmit,
		isForm1Valid,
		isForm2Valid,
	} = useCreateCourseForm({ onCreate, onClose })

	// Расчет заблокированных курсов для Магистратуры
	const coursesWithDisabled = courseOptions.map((course, index) => ({
		...course,
		disabled: formData.selectedStudyLevel === 1 && index > 1, // Индексы 2-5 (3-й - 6-й курсы)
	}))

	return (
		<div className='w-full'>
			<RadioGroup
				options={tabOptions}
				value={selectedTab}
				onChange={setSelectedTab}
				wfull={true}
				className='flex gap-3 w-full justify-center mb-3'
			/>

			<form
				onSubmit={handleSubmit}
				className='w-full inline-flex flex-col gap-5 p-2'
			>
				{selectedTab === 0 ? (
					<>
						{/* --- ФОРМА 1: СВОБОДНОЕ --- */}
						<Input
							type='text'
							name='title'
							title='Введите название курса'
							required={true}
							onStatusChange={setIsNameValid}
							value={formData.title}
							onChange={handleChange}
						/>

						<TextArea
							title='Введите описание'
							value={formData.description}
							onChange={e => handleDirectChange('description', e.target.value)}
						/>

						<RadioGroup
							options={semesterOptions}
							value={formData.selectedSemester}
							onChange={val => handleDirectChange('selectedSemester', val)}
							style='solid'
							wfull={true}
							className='flex gap-3 w-full justify-center mb-3'
						/>

						<RadioGroup
							options={studyLevelOptions}
							value={formData.selectedStudyLevel}
							onChange={val => handleDirectChange('selectedStudyLevel', val)}
							style='solid'
							wfull={true}
							className='flex gap-3 w-full justify-center mb-1'
						/>

						<div className='flex flex-col gap-1 w-full justify-center mb-3'>
							<p className='text-[var(--middle)] text-start text-lg'>
								Выберите курс
							</p>
							<RadioGroup
								options={coursesWithDisabled}
								value={formData.selectedCourses}
								onChange={val => handleDirectChange('selectedCourses', val)}
								style='solid'
								wfull={true}
								className='grid grid-cols-3 w-full gap-2'
							/>
						</div>
					</>
				) : (
					<>
						{/* --- ФОРМА 2: ПО НАГРУЗКЕ --- */}
						<div className='w-full flex flex-col gap-3'>
							<OptionInput
								title='Учебный год'
								required={true}
								options={yearsList.map(y => ({ value: y, label: y }))}
								onChange={data => handleDirectChange('selectedYearIdx', data)}
							/>

							<RadioGroup
								options={semesterOptions}
								value={formData.selectedSemester}
								onChange={val => handleDirectChange('selectedSemester', val)}
								style='solid'
								wfull={true}
								className='flex gap-3 w-full justify-center mb-3'
							/>
						</div>

						<div className='bg-[var(--light-middle)] rounded-lg shadow-inner p-2 pr-2.75 overflow-y-scroll flex flex-col gap-2 w-full h-[39.5vh]'>
							{disciplinesList?.map((item, i) => (
								<motion.div
									key={i}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: i * 0.1,
										ease: 'easeOut',
									}}
								>
									<div
										onClick={() =>
											handleDirectChange('selectedDisciplineIdx', i)
										}
										className={`bg-[var(--white)] rounded-md shadow-[var(--shadow)] px-4 py-2 cursor-pointer hover:scale-101 transition-all flex flex-col ${
											formData.selectedDisciplineIdx === i &&
											'ring-2 ring-[var(--hero)] shadow-[var(--hero-shadow)]'
										}`}
									>
										<p className='font-medium text-[var(--black)]'>
											{item?.discipline}
										</p>
										<p className='font-light text-[var(--middle)]'>
											{item?.study_plan?.replace(/\.plx$/, '')}
										</p>
										<p
											className={`font-light w-fit px-4 py-1 pt-1.5 rounded-md transition-all ${
												formData.selectedDisciplineIdx !== i
													? 'text-[var(--hero)] bg-[var(--hero-pale)]'
													: 'bg-[var(--hero)] text-white'
											}`}
										>
											{item?.course} Курс
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</>
				)}

				{/* --- ОБЩИЙ БЛОК ДЛЯ ОБЕИХ ФОРМ (Превью и Кнопка) --- */}
				<div className='flex flex-col gap-3 w-full'>
					<div className='inline-flex items-center gap-[10px]'>
						<p className='text-[18px] text-[var(--middle)]'>Загрузите превью</p>
						<div className='relative'>
							<CircleQuestionMark
								onClick={() => setHintOpen(prev => (prev === null ? 1 : null))}
								className='text-blue-500 cursor-pointer'
								size={16}
							/>
							<div
								className={`${
									hintOpen === 1
										? 'opacity-100 scale-100'
										: 'opacity-0 scale-0 -translate-x-1/2'
								} transition-all select-none cursor-default bg-[var(--white)] shadow-[var(--shadow)] absolute -top-12.5 left-7 h-auto w-75 px-3 py-2 rounded-lg`}
							>
								<p>
									При отсутствии загруженного изображения система автоматически
									сгенерирует превью.
								</p>
							</div>
						</div>
					</div>
					<PreviewInput
						onFileChange={file => handleDirectChange('img', file)}
					/>
				</div>

				{!isCreateLoading ? (
					<input
						className={`py-4 font-medium text-xl rounded-2xl w-full transition ${
							(selectedTab === 0 ? isForm1Valid : isForm2Valid)
								? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
								: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
						}`}
						type='submit'
						value='Создать курс'
						disabled={selectedTab === 0 ? !isForm1Valid : !isForm2Valid}
					/>
				) : (
					<div className='py-4 flex justify-center items-center rounded-2xl transition'>
						<Loader />
					</div>
				)}
			</form>
		</div>
	)
}
