import Modal from '../../Atoms/Modal'
import { Text } from '../../Atoms/Text'
import { TestForm } from '../Forms/TestForm'

export const TestSettingsModal = ({ isOpen, onClose }) => {
	return (
		<Modal width={'w-fit'} isOpen={isOpen} onClose={onClose}>
			<Text
				size={'2xl'}
				font={'medium'}
				style={'primary'}
				className={'text-center'}
			>
				Настройки теста
			</Text>
			<TestForm />
		</Modal>
	)
}
