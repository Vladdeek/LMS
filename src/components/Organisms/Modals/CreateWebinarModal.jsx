import Modal from '../../Atoms/Modal'
import { ScrollFadeContainer } from '../../Atoms/ScrollFadeContainer'
import { Text } from '../../Atoms/Text'
import { CreateWebinarForm } from '../Forms/CreateWebinarForm/CreateWebinarForm'

export const CreateWebinarModal = ({
	isOpen,
	onClose,
	editmode = false,
	takeinfo = null,
	onCreate,
}) => {
	return (
		<Modal width={'w-fit'} isOpen={isOpen} onClose={onClose}>
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
			<CreateWebinarForm
				isOpen={isOpen}
				onClose={onClose}
				editmode={editmode}
				takeinfo={takeinfo}
				onCreate={onCreate}
			/>
		</Modal>
	)
}
