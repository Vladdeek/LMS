import Modal from '../../Atoms/Modal'
import { Text } from '../../Atoms/Text'
import { CourseForm } from '../Forms/CourseForm'

export const CourseModal = ({ isOpen, onClose, selectedCourse }) => {
	const isEdit = Boolean(selectedCourse)

	return (
		<Modal width={'w-fit'} isOpen={isOpen} onClose={onClose}>
			<Text
				size={'2xl'}
				font={'medium'}
				style={'primary'}
				className={'text-center'}
			>
				{isEdit ? 'Редактирование курса' : 'Создание курса'}
			</Text>
			<CourseForm onClose={onClose} selectedCourse={selectedCourse} />
		</Modal>
	)
}
