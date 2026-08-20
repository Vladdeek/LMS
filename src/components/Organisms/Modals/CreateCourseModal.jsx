import Modal from '../../Atoms/Modal'
import { ScrollFadeContainer } from '../../Atoms/ScrollFadeContainer'
import { Text } from '../../Atoms/Text'
import { CreateCourseForm } from '../Forms/CreateCourseForm'

export const CreateCourseModal = ({ isOpen, onClose }) => {
	return (
		<Modal width={'w-175'} isOpen={isOpen} onClose={onClose}>
			<Text
				size={'2xl'}
				font={'medium'}
				style={'primary'}
				className={'mb-5 text-center'}
			>
				Создание курса
			</Text>
			<ScrollFadeContainer height={'h-[70vh]'}>
				<CreateCourseForm />
			</ScrollFadeContainer>
		</Modal>
	)
}
