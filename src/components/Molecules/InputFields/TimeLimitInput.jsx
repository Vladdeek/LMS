import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { formatTime } from '../../../utils/formatTime'

export const TimeLimitInput = ({ COUNT_QUESTION = 0, onChange, value }) => {
	const [time, setTime] = useState(0)

	const TIME_FOR_ONE_QUESTION = 90
	const TIME_STEP = 30
	const MIN_TIME_LIMIT = COUNT_QUESTION * TIME_FOR_ONE_QUESTION

	useEffect(() => {
		if (!value) {
			if (COUNT_QUESTION > 0) setTime(MIN_TIME_LIMIT)
		} else if (value) {
			setTime(value < MIN_TIME_LIMIT ? MIN_TIME_LIMIT : value)
		}
	}, [COUNT_QUESTION, value, MIN_TIME_LIMIT])

	useEffect(() => {
		onChange?.(time)
	}, [time])

	return (
		<div className='flex flex-col gap-1'>
			<label className='text-xs text-end font-medium text-[var(--black)]/60'>
				Лимит времени на тест
			</label>

			<div className='flex items-center w-fit px-2 py-1 border border-[var(--light-middle)]/25 bg-[var(--white)] rounded-md shadow-inner'>
				<span className='text-sm font-medium tabular-nums w-30 text-center'>
					{formatTime(time)}
				</span>

				<div
					className='flex flex-col border-l border-[var(--light-middle)]/20 ml-1 pl-1'
					title={`Шаг изменения: ${formatTime(TIME_STEP)} \nМин. время на вопрос: ${formatTime(TIME_FOR_ONE_QUESTION)}`}
				>
					<Plus
						onClick={() => setTime(prev => prev + TIME_STEP)}
						size={14}
						className='cursor-pointer hover:text-[var(--primary)] transition-colors'
					/>
					<Minus
						onClick={() =>
							time > MIN_TIME_LIMIT && setTime(prev => prev - TIME_STEP)
						}
						size={14}
						className={`cursor-pointer transition-colors ${time <= MIN_TIME_LIMIT ? 'opacity-20 cursor-default' : 'hover:text-[var(--primary)]'}`}
					/>
				</div>
			</div>
		</div>
	)
}
