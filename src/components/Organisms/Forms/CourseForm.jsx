import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { RadioGroup } from '../../Molecules/RadioGroup'
import { Input } from '../../Molecules/InputFields/Input'
import { TextArea } from '../../Molecules/InputFields/TextArea'
import { OptionInput } from '../../Molecules/InputFields/OptionInput'
import { BookOpen, GraduationCap, Layers, Calendar } from 'lucide-react'
import { Loader } from '../../Atoms/Loaders/Loader'

import { studyLevelOptions, useCourseForm } from '../../../hooks/useCourseForm'
import { Show } from '../../Atoms/Show'
import { ButtonCase } from '../../Atoms/Buttons/ButtonCase'
import { ConfirmModal } from '../Modals/ConfirmModal'
import { deleteCourse } from '../../../api/Courses'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ChangePreview } from '../ChangePreview'

const tabOptions = [
	{ value: 0, label: 'Свободное' },
	{ value: 1, label: 'По нагрузке' },
]

const semesterOptions = [
	{ value: '1', label: '1-й Семестр' },
	{ value: '2', label: '2-й Семестр' },
]

const courseOptions = [
	{ value: 1, label: '1-й' },
	{ value: 2, label: '2-й' },
	{ value: 3, label: '3-й' },
	{ value: 4, label: '4-й' },
	{ value: 5, label: '5-й' },
	{ value: 6, label: '6-й' },
]

export const CourseForm = ({ onClose, selectedCourse }) => {
	const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
	const navigate = useNavigate()
	const { courseId } = useParams()
	const {
		selectedTab,
		setSelectedTab,
		isLoading,
		yearsList,
		disciplinesList,
		formData,
		isEdit,
		setIsNameValid,
		handleChange,
		handleDirectChange,
		handleSubmit,
		isForm1Valid,
		isForm2Valid,
	} = useCourseForm({ onClose, selectedCourse })

	const coursesWithDisabled = courseOptions.map((course, index) => ({
		...course,
		disabled: formData.selectedStudyLevel === 1 && index > 1,
	}))

	const isSubmitDisabled = selectedTab === 0 ? !isForm1Valid : !isForm2Valid
	const buttonLabel = isEdit ? 'Сохранить изменения' : 'Создать курс'

	const handleDelete = async () => {
		try {
			await deleteCourse(courseId)
			navigate('/catalog/courses')
			toast.success('Курс успешно удален!')
		} catch (error) {
			toast.error('Ошибка удаления курса!')
		}
	}

	return (
		<>
			<ConfirmModal
				isOpen={confirmModalIsOpen}
				onClose={() => setConfirmModalIsOpen(false)}
				title='Удаление курса'
				text='Вы действительно хотите удалить этот курс?'
				confirmLabel='Удалить'
				confirmStyle='danger'
				action={handleDelete}
			/>
			<div className='w-full max-w-4xl mx-auto p-2 sm:p-4'>
				<div className='mb-4 w-full'>
					<ChangePreview
						initialUrl={formData.default_image_url || formData.img}
						onFileChange={data => handleDirectChange('default_image_url', data)}
					/>
				</div>

				{/* Переключатель табов скрыт в режиме редактирования */}
				<Show when={!isEdit}>
					<div className='mb-4 w-full max-w-md mx-auto'>
						<RadioGroup
							options={tabOptions}
							value={selectedTab}
							onChange={setSelectedTab}
							wfull={true}
							className='flex gap-2 w-full justify-center'
						/>
					</div>
				</Show>

				<form onSubmit={handleSubmit} className='w-full'>
					<div className='w-full space-y-6'>
						{selectedTab === 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* Основная информация */}
								<section className='space-y-4'>
									<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
										<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
											<BookOpen size={18} />
										</div>
										<h3 className='text-base font-bold text-[var(--black)]'>
											Основная информация
										</h3>
									</div>

									<div className='space-y-3.5'>
										<Input
											type='text'
											name='title'
											title='Название курса'
											required={true}
											onStatusChange={setIsNameValid}
											value={formData.title}
											onChange={handleChange}
										/>

										<TextArea
											title='Описание'
											value={formData.description}
											onChange={e =>
												handleDirectChange('description', e.target.value)
											}
											rows={4}
										/>
									</div>
								</section>

								{/* Параметры обучения */}
								<section className='space-y-4'>
									<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
										<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
											<GraduationCap size={18} />
										</div>
										<h3 className='text-base font-bold text-[var(--black)]'>
											Параметры обучения
										</h3>
									</div>

									<div className='space-y-3.5'>
										<div className='flex flex-col gap-1.5'>
											<p className='text-xs font-medium text-[var(--middle)]'>
												Семестр
											</p>
											<RadioGroup
												options={semesterOptions}
												value={formData.selectedSemester}
												onChange={val =>
													handleDirectChange('selectedSemester', val)
												}
												style='solid'
												wfull={true}
												className='flex gap-2 w-full justify-center'
											/>
										</div>

										<div className='flex flex-col gap-1.5'>
											<p className='text-xs font-medium text-[var(--middle)]'>
												Уровень образования
											</p>
											<RadioGroup
												options={studyLevelOptions}
												value={formData.selectedStudyLevel}
												onChange={val =>
													handleDirectChange('selectedStudyLevel', val)
												}
												style='solid'
												wfull={true}
												className='flex gap-2 w-full justify-center'
											/>
										</div>

										<div className='flex flex-col gap-1.5 w-full'>
											<p className='text-xs font-medium text-[var(--middle)]'>
												Курс
											</p>
											<RadioGroup
												options={coursesWithDisabled}
												value={formData.selectedCourses}
												onChange={val =>
													handleDirectChange('selectedCourses', val)
												}
												style='solid'
												wfull={true}
												className='grid grid-cols-6 w-full gap-1.5'
											/>
										</div>
									</div>
								</section>
							</div>
						) : (
							/* Форма 2: По нагрузке */
							<div className='space-y-6'>
								<section className='space-y-3'>
									<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
										<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
											<Calendar size={18} />
										</div>
										<h3 className='text-base font-bold text-[var(--black)]'>
											Учебный период
										</h3>
									</div>

									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
										<OptionInput
											title='Учебный год'
											required={true}
											options={yearsList.map(y => ({ value: y, label: y }))}
											onChange={data =>
												handleDirectChange('selectedYearIdx', data)
											}
										/>

										<div className='flex flex-col gap-1.5'>
											<p className='text-xs font-medium text-[var(--middle)]'>
												Семестр
											</p>
											<RadioGroup
												options={semesterOptions}
												value={formData.selectedSemester}
												onChange={val =>
													handleDirectChange('selectedSemester', val)
												}
												style='solid'
												wfull={true}
												className='flex gap-2 w-full justify-center'
											/>
										</div>
									</div>
								</section>

								<section className='space-y-3'>
									<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
										<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
											<Layers size={18} />
										</div>
										<h3 className='text-base font-bold text-[var(--black)]'>
											Выбор дисциплины из нагрузки
										</h3>
									</div>

									<div className='bg-[var(--light-middle)]/15 rounded-xl p-2.5 max-h-[260px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 border border-[var(--light-middle)]/30'>
										{disciplinesList?.map((item, i) => (
											<motion.div
												key={i}
												initial={{ scale: 0.98, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{ duration: 0.15, delay: i * 0.03 }}
											>
												<div
													onClick={() =>
														handleDirectChange('selectedDisciplineIdx', i)
													}
													className={`bg-[var(--white)] rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between gap-2 border ${
														formData.selectedDisciplineIdx === i
															? 'border-[var(--hero)] ring-2 ring-[var(--hero)]/20 bg-[var(--hero-pale)]/10'
															: 'border-[var(--light-middle)]/40 hover:border-[var(--light-middle)]'
													}`}
												>
													<div>
														<p className='font-bold text-[var(--black)] text-sm leading-snug line-clamp-2'>
															{item?.discipline}
														</p>
														<p className='text-[11px] font-light text-[var(--middle)] mt-0.5 truncate'>
															{item?.study_plan?.replace(/\.plx$/, '')}
														</p>
													</div>
													<div>
														<span
															className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded transition-all ${
																formData.selectedDisciplineIdx !== i
																	? 'text-[var(--hero)] bg-[var(--hero-pale)]'
																	: 'bg-[var(--hero)] text-white'
															}`}
														>
															{item?.course} Курс
														</span>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</section>
							</div>
						)}

						{/* Панель сабмита */}
						<div className='pt-4 border-t border-[var(--light-middle)]/30 flex gap-3 justify-end'>
							<Show when={!isLoading} fallback={<Loader />}>
								<Show when={isEdit}>
									<ButtonCase
										type='button'
										onClick={() => setConfirmModalIsOpen(true)}
										backgroundColor='var(--red-pale)'
										textColor='var(--red-text)'
										hoverStyles='hover:bg-[var(--red-text)] hover:text-[var(--red-pale)]'
									>
										Удалить курс
									</ButtonCase>
								</Show>
								<input
									className={`px-6 py-2.5 font-semibold text-sm rounded-xl w-full sm:w-auto transition-all shadow-sm ${
										!isSubmitDisabled
											? 'bg-[var(--black)] text-[var(--white)] cursor-pointer hover:bg-[var(--black)]/90 active:scale-[0.98]'
											: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
									}`}
									type='submit'
									value={buttonLabel}
									disabled={isSubmitDisabled}
								/>
							</Show>
						</div>
					</div>
				</form>
			</div>
		</>
	)
}
