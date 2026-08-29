import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react'
import Modal from '../../Atoms/Modal'
import { ButtonCase } from '../../Atoms/Buttons/ButtonCase'
import { changeCourseStatus } from '../../../api/courseService'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useState } from 'react'

export const ReviewConfirmModal = ({ isModalOpen, onClose }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const courseId = searchParams.get('course_id')
	const navigate = useNavigate()
	const accessCourse = async verdictStatus => {
		console.log('click - ', verdictStatus)
		try {
			await changeCourseStatus(courseId, verdictStatus)
			onClose
			navigate('/moderation-courses')
		} catch (err) {
			console.error(err)
		}
	}
	return (
		<Modal width={'w-110'} isOpen={isModalOpen}>
			<div className='flex flex-col gap-6 p-2 w-full'>
				<div className='flex flex-col items-center text-center gap-3'>
					<div className='p-4 bg-[var(--hero-pale)] rounded-full text-[var(--hero)]'>
						<ShieldAlert size={40} />
					</div>
					<h2 className='text-2xl font-bold text-[var(--black)]'>
						Модерация курса
					</h2>
					<p className='text-[var(--middle)]'>
						Проверьте корректность всех заполненных данных перед тем, как
						изменить статус доступа к редактированию.
					</p>
				</div>

				<div className='flex items-center w-full gap-4'>
					<ButtonCase
						className='w-full flex items-center justify-center gap-3'
						backgroundColor={'var(--green-base)'}
						textColor={'var(--green-pale)'}
						hoverStyles={'hover:bg-[var(--green-hover)]'}
						onClick={() => accessCourse('approved')}
					>
						<CheckCircle2 size={24} />
						<span className='font-semibold'>Допустить</span>
					</ButtonCase>
					<ButtonCase
						className='w-full flex items-center justify-center gap-3'
						backgroundColor={'var(--red-base)'}
						textColor={'var(--red-pale)'}
						hoverStyles={'hover:bg-[var(--red-hover)]'}
						onClick={() => accessCourse('in_development')}
					>
						<XCircle size={24} />
						<span className='font-semibold'>Запретить</span>
					</ButtonCase>
				</div>

				<ButtonCase
					className='self-end'
					backgroundColor={'transparent'}
					textColor={'var(--middle)'}
					hoverStyles={'hover:bg-[var(--light-middle)]'}
					onClick={() => onClose?.(null)}
				>
					Отмена
				</ButtonCase>
			</div>
		</Modal>
	)
}
