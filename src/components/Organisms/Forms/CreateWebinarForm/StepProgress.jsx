export const StepProgress = ({
	step,
	setStep,
	editMode,
	isFormValid,
	isStartDTValid,
	hasLinkedGroups,
}) => {
	const steps = editMode ? [1, 2] : [1, 2, 3]

	const getStepStatusClass = stepNumber => {
		if (step === stepNumber) {
			return 'bg-[var(--hero-pale)] ring-[var(--hero)] shadow-[var(--hero-shadow)] text-[var(--hero)] ring-2'
		}

		const isValid =
			(stepNumber === 1 && isFormValid) ||
			(stepNumber === 2 && isStartDTValid) ||
			(stepNumber === 3 && hasLinkedGroups)

		return isValid
			? 'bg-[var(--hero)] text-white'
			: 'text-[var(--middle)] bg-[var(--light-middle)]'
	}

	return (
		<div className='flex gap-2 items-center justify-center mb-3'>
			{steps.map((num, idx) => (
				<div key={num} className='flex items-center gap-2'>
					<p
						onClick={() => setStep(num)}
						className={`${getStepStatusClass(num)} h-10 w-10 p-1.75 text-xl font-semibold text-center rounded-full cursor-pointer`}
					>
						{num}
					</p>
					{idx < steps.length - 1 && (
						<div
							className={`h-1 w-10 rounded-full ${
								(num === 1 && isFormValid) || (num === 2 && isStartDTValid)
									? 'bg-[var(--hero)]'
									: 'bg-[var(--light-middle)]'
							}`}
						/>
					)}
				</div>
			))}
		</div>
	)
}
