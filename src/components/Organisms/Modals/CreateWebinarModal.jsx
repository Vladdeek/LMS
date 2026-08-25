import Modal from '../../Atoms/Modal'
import { ScrollFadeContainer } from '../../Atoms/ScrollFadeContainer'
import { Text } from '../../Atoms/Text'

import { WebinarForm } from '../Forms/WebinarForm'

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
				className={'text-center'}
			>
				{editmode
					? 'Редактирование видео-конференции'
					: 'Создание видео-конференции'}
			</Text>
			<WebinarForm
				isOpen={isOpen}
				onClose={onClose}
				editmode={editmode}
				takeinfo={takeinfo}
				onCreate={onCreate}
			/>
		</Modal>
	)
}
