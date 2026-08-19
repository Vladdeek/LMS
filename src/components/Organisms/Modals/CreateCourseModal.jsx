import { ArrowDown } from 'lucide-react'
import Modal from '../../Atoms/Modal'
import { CreateCourseForm } from '../Forms/CreateCourseForm'
import { Text } from '../../Atoms/Text'
import { ScrollFadeContainer } from '../../Atoms/ScrollFadeContainer'

export const CreateCourseModal = ({ isOpen }) => {
	return (
		<Modal width={'w-175'} isOpen={isOpen}>
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
