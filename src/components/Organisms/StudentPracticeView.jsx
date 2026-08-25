import { useEffect, useState } from 'react'
import { fetchStudentWork, sendResultOfWork } from '../../api/courseService'
import { TextArea } from '../Molecules/InputFields/TextArea'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'
import { FileView } from '../Molecules/FileView'
import { FileManager } from './ConstructorViews/FilesImport'

export const StudentPracticeView = ({ activeSectionId, courseId }) => {
	const [studentWork, setStudentWork] = useState([])
	const [studentDescription, setStudentDescription] = useState('')
	const [gradeStatus, setGradeStatus] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		const loadPractice = async () => {
			if (!activeSectionId) return
			try {
				const res = await fetchStudentWork(activeSectionId)
				if (res) {
					setStudentWork(res.content || [])
					setGradeStatus(res.grade_status || null)
				}
			} catch (err) {
				console.error(err)
			}
		}
		loadPractice()
	}, [activeSectionId])

	const handleSubmit = async () => {
		setIsSubmitting(true)
		try {
			await sendResultOfWork(activeSectionId, {
				files: studentWork,
				description: studentDescription,
			})
			setGradeStatus('pending')
		} catch (err) {
			console.error('Ошибка при отправке работы:', err)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='w-full flex flex-col justify-center gap-4 mt-6 p-4 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)]'>
			<p className='text-center font-medium text-xl text-[var(--black)]'>
				Прикрепить файл для проверки
			</p>
			{gradeStatus === null ? (
				<>
					<FileManager
						takeValues={studentWork?.map(file => ({
							file_path: file.file_path,
							name: file.original_name,
							type: file.mime_type,
							size: file.file_size,
						}))}
						maxFileSizeInMB={15}
						onChange={data => setStudentWork(data)}
						destination={`courses/${courseId}/sections/${activeSectionId}/assignments/user/`}
					/>

					<TextArea
						type='text'
						placeholder='Опишите выполненную работу...'
						title='Комментарий к работе'
						value={studentDescription}
						onChange={e => setStudentDescription(e.target.value)}
						InputStatus={false}
					/>
					<SubmitButton
						title={isSubmitting ? 'Отправка...' : 'Отправить на проверку'}
						onClick={handleSubmit}
					/>
				</>
			) : (
				<>
					<FileView
						Files={studentWork?.map(file => ({
							file_path: file.file_path,
							name: file.original_name,
							type: file.mime_type,
							size: file.file_size,
						}))}
					/>
					{studentDescription && (
						<div className='flex flex-col w-2/3 self-center'>
							<p className='text-md font-semibold text-[var(--black)]'>
								Описание к прикрепленному материалу
							</p>
							<p className='text-md text-[var(--black)] w-full min-h-20 p-2 rounded-lg shadow-inner bg-[var(--light-middle)]/50'>
								{studentDescription}
							</p>
						</div>
					)}
					<p className='text-center self-center text-md font-semibold text-[var(--middle)] bg-[var(--light-middle)] py-3 px-6 rounded-xl w-2/3'>
						{gradeStatus === 'pending' ? 'На рассмотрении' : 'Оценено'}
					</p>
				</>
			)}
		</div>
	)
}
