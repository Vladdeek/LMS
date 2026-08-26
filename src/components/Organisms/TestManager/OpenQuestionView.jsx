// OpenQuestionView.jsx

import { Show } from '../../Atoms/Show'
import { Input } from '../../Molecules/InputFields/Input'

export const OpenQuestionView = ({
	isEdit,
	studentAnswer,
	onChange,
	onChangeTypeToChoice,
}) => {
	return (
		<div className='flex flex-col items-center gap-4 w-full'>
			<Show when={!isEdit}>
				<div className='w-full'>
					<Input
						title='Введите ответ'
						name='student_answer'
						value={studentAnswer}
						onChange={onChange}
					/>
				</div>
			</Show>
		</div>
	)
}
