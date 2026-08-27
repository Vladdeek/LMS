import { BookOpen, Save, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import {
	fetchCourseById,
	getCourseAttachments,
} from '../../../api/moderator/Courses'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FileView } from '../../Molecules/FileView'
import { MEDIA_API_URL } from '../../../API'
import { Text } from '../../Atoms/Text'
import { ReviewConfirmModal } from '../Modals/ReviewConfirmModal'
import { Input } from '../../Molecules/InputFields/Input'
import { TextArea } from '../../Molecules/InputFields/TextArea'
import { ButtonCase } from '../../Atoms/Buttons/ButtonCase'
import { CourseForm } from './CourseForm'

export const ModeratorCourseForm = ({ onChange, isEdit = false }) => {
	const [searchParams] = useSearchParams()
	const courseId = searchParams.get('course_id')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [courseInfo, setCourseInfo] = useState(null)
	const [files, setFiles] = useState([])
	const navigate = useNavigate()

	const getCourse = async () => {
		try {
			const res = await fetchCourseById(courseId)
			setCourseInfo(res || {})
			if (res?.files) setFiles(res.files)
		} catch (err) {
			console.error('Ошибка при загрузке курса:', err)
		}
	}

	const getAttachments = async () => {
		try {
			const res = await getCourseAttachments(courseId)
			setFiles(res)
		} catch (err) {
			console.error('Ошибка при загрузке вложений:', err)
		}
	}

	useEffect(() => {
		if (courseId) {
			getCourse()
			getAttachments()
		}
	}, [courseId])

	const accessCourse = async status => {
		try {
			setIsModalOpen(false)
			onChange?.()
		} catch (err) {
			console.error('Ошибка при изменении статуса курса:', err)
		}
	}

	if (!courseInfo) return null

	return (
		<div className='mx-4'>
			<div className='grid grid-cols-12 gap-10'>
				{/* ЛЕВАЯ КОЛОНКА: Превью курса и РПД */}
				<div className='col-span-12 lg:col-span-4 flex flex-col space-y-6 border-r border-[var(--light-middle)]/30 pr-6'>
					<div className='relative group h-auto aspect-video w-full rounded-3xl overflow-hidden ring-5 ring-[var(--white)] shadow-[var(--shadow)] bg-[var(--light-gray)]/50'>
						{courseInfo.image_path ? (
							<img
								src={`${MEDIA_API_URL}${courseInfo.image_path}`}
								alt='Preview'
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
								<BookOpen size={48} />
							</div>
						)}
						{courseInfo.course_status && (
							<div className='absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-[var(--hero)] shadow-sm uppercase'>
								{courseInfo.course_status}
							</div>
						)}
					</div>

					<ButtonCase
						onClick={() => navigate(`/course/${courseId}`)}
						backgroundColor={'var(--white)'}
						textColor={'var(--black)'}
						hoverStyles='hover:bg-[var(--hero)] hover:text-white'
						className={'px-5 py-2.5 text-sm flex items-center justify-center'}
					>
						Посмотреть содержимое
					</ButtonCase>

					{/* Блок с файлами (РПД) */}
					<div className='space-y-2 border-t border-[var(--light-middle)]/30 pt-5'>
						<p className='text-xs font-semibold text-[var(--middle)] uppercase tracking-wider'>
							Рабочая программа (РПД)
						</p>
						<div className='flex flex-col bg-[var(--light-middle)]/50 rounded-2xl'>
							{files.length > 0 ? (
								<FileView
									files={files}
									isEdit={isEdit}
									onDeleteFile={isEdit}
									onDownload
								/>
							) : (
								<Text
									font={'semibold'}
									style={'secondary'}
									className={'text-center my-10'}
								>
									Пусто
								</Text>
							)}
						</div>
					</div>
				</div>

				{/* ПРАВАЯ КОЛОНКА */}
				<div className='col-span-12 lg:col-span-8 flex flex-col space-y-8'>
					{isEdit ? (
						/* Режим редактирования: полноценная интерактивная форма */
						<CourseForm
							initialData={courseInfo}
							onUpdate={() => {
								getCourse()
								onChange?.()
							}}
						/>
					) : (
						/* Режим просмотра модератора */
						<>
							<section className='space-y-5'>
								<div className='flex items-center gap-3'>
									<div className='p-2 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
										<BookOpen size={20} />
									</div>
									<h3 className='text-lg font-bold text-[var(--black)]'>
										Основная информация
									</h3>
								</div>

								<Input
									title='Название курса'
									value={courseInfo.name || ''}
									readOnly
									placeholder='Не указано'
								/>
								<TextArea
									title='Описание'
									value={courseInfo.description || ''}
									readOnly
									placeholder='Не указано'
								/>
							</section>

							<section className='space-y-5'>
								<div className='flex items-center gap-3'>
									<div className='p-2 bg-[var(--hero-pale)] rounded-lg text-[var(--hero)]'>
										<BookOpen size={20} />
									</div>
									<h3 className='text-lg font-bold text-[var(--black)]'>
										Учебные параметры
									</h3>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<Input
										title='Уровень образования'
										value={courseInfo.study_level || ''}
										readOnly
										placeholder='Не указано'
									/>
									<Input
										title='Учебный год'
										value={courseInfo.study_year || ''}
										readOnly
										placeholder='Не указано'
									/>
									<Input
										title='Курс'
										value={
											courseInfo.course ? `${courseInfo.course}-й курс` : ''
										}
										readOnly
										placeholder='Не указано'
									/>
									<Input
										title='Семестр'
										value={
											courseInfo.semester
												? `${courseInfo.semester}-й семестр`
												: ''
										}
										readOnly
										placeholder='Не указано'
									/>
								</div>

								<Input
									title='Учебный план'
									value={courseInfo.study_plan || ''}
									readOnly
									placeholder='Не указано'
								/>
							</section>

							<div className='flex justify-end pt-4'>
								<SubmitButton
									className='w-full flex items-center gap-2 md:w-auto px-6 py-2'
									onClick={() => setIsModalOpen(true)}
								>
									<ShieldAlert size={18} strokeWidth={3} />
									<Text size={'lg'} font={'semibold'}>
										Рецензировать
									</Text>
								</SubmitButton>
							</div>
						</>
					)}
				</div>
			</div>

			<ReviewConfirmModal
				isModalOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAccess={accessCourse}
			/>
		</div>
	)
}
