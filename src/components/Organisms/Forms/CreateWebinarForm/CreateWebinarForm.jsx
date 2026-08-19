import React from 'react'
import { X } from 'lucide-react'
import { StepProgress } from './StepProgress'
import { StepOneGeneral } from './StepOne'
import { StepTwoSchedule } from './StepTwo'
import { StepThreeAccess } from './StepThree'
import { useCreateWebinarForm } from '../../../../hooks/useCreateWebinarForm'

export const CreateWebinarForm = props => {
	const { isOpen } = props
	const { state, actions } = useCreateWebinarForm(props) // Пропсы успешно уходят в хук

	if (!isOpen) return null

	const accessOptions = [
		{ value: 1, label: 'Доступно всем' },
		{ value: 2, label: 'Ограниченный доступ' },
	]

	return (
		<>
			<StepProgress
				step={state.step}
				setStep={actions.setStep}
				editMode={state.editMode}
				isFormValid={state.isFormValid}
				isStartDTValid={state.isStartDTValid}
				hasLinkedGroups={state.linkedGroups.length > 0}
			/>

			<form onSubmit={actions.handleSubmit}>
				{state.step === 1 && (
					<StepOneGeneral
						title={state.title}
						setTitle={actions.setTitle}
						url={state.url}
						setUrl={actions.setUrl}
						editMode={state.editMode}
						isFormValid={state.isFormValid}
						setImg={actions.setImg}
						onNext={() => actions.setStep(state.editMode ? 3 : 2)}
					/>
				)}

				{state.step === 2 && (
					<StepTwoSchedule
						date={state.date}
						setDate={actions.setDate}
						stime={state.stime}
						setSTime={actions.setSTime}
						etime={state.etime}
						setETime={actions.setETime}
						isStartDTValid={state.isStartDTValid}
						onNext={() => actions.setStep(3)}
					/>
				)}

				{state.step === 3 && (
					<StepThreeAccess
						accessOptions={accessOptions}
						selectedAccess={state.selectedAccess}
						setSelectedAccess={actions.setSelectedAccess}
						linkedGroups={state.linkedGroups}
						handleRemoveGroup={actions.handleRemoveGroup}
						unlinkedGroups={state.unlinkedGroups}
						handleAddGroup={actions.handleAddGroup}
						searchGroups={state.searchGroups}
						setSearchGroups={actions.setSearchGroups}
						page={state.page}
						setPage={actions.setPage}
						isSubmitDisabled={state.isSubmitDisabled}
						editMode={state.editMode}
					/>
				)}
			</form>
		</>
	)
}
