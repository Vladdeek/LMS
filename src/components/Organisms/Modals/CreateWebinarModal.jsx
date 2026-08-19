// CreateCourseModal.jsx
import Modal from '../../Atoms/Modal'
import { Text } from '../../Atoms/Text'
import { ScrollFadeContainer } from '../../Atoms/ScrollFadeContainer'
import { CreateWebinarForm } from '../Forms/CreateWebinarForm/CreateWebinarForm'

export const CreateCourseModal = ({
	isOpen,
	onClose,
	editmode = false,
	takeinfo = null,
	onCreate,
}) => {
	return (
		<Modal width={'w-175'} isOpen={isOpen} onClose={onClose}>
			<Text
				size={'2xl'}
				font={'medium'}
				style={'primary'}
				className={'mb-5 text-center'}
			>
				{editmode
					? 'Редактирование видео-конференции'
					: 'Создание видео-конференции'}
			</Text>
			<ScrollFadeContainer height={'h-[70vh]'}>
				<CreateWebinarForm
					isOpen={isOpen}
					onClose={onClose}
					editmode={editmode}
					takeinfo={takeinfo}
					onCreate={onCreate}
				/>
			</ScrollFadeContainer>
		</Modal>
	)
}
