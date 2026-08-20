import { HintTooltip } from '../../../Atoms/HintTooltip'
import { Text } from '../../../Atoms/Text'
import { DateInput } from '../../../Molecules/InputFields/DateInput'
import { Input } from '../../../Molecules/InputFields/Input'

export const StepTwoSchedule = ({
	date,
	setDate,
	stime,
	setSTime,
	etime,
	setETime,
	isStartDTValid,
	onNext,
}) => (
	<div className='sm:w-[482px] w-full inline-flex flex-col items-center gap-5'>
		<DateInput
			title='Введите дату проведения вебинара'
			required
			value={date}
			onChange={setDate}
		/>
		<div className='flex gap-3 items-center w-full'>
			<Input
				type='time'
				title='Время начала'
				required
				value={stime}
				onChange={e => setSTime(e.target.value)}
			/>
			<div className='flex w-full flex-col'>
				<div className='inline-flex items-center gap-2 mb-1'>
					<p className='text-[18px] text-[var(--middle)]'>Время окончания</p>
					<HintTooltip>
						<Text>
							При отсутствии указанной даты окончания система автоматически
							устанавливает её на час позже времени начала.
						</Text>
					</HintTooltip>
				</div>
				<Input
					type='time'
					value={etime}
					onChange={e => setETime(e.target.value)}
				/>
			</div>
		</div>

		<input
			className={`px-[51px] py-[14.5px] font-medium text-xl rounded-lg w-fit transition ${
				isStartDTValid
					? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
					: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
			}`}
			type='button'
			value='Далее'
			disabled={!isStartDTValid}
			onClick={onNext}
		/>
	</div>
)
