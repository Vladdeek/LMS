import React, { useEffect, useState } from 'react'
import { ProgressBar } from '../Atoms/ProgressBar'

export const TestTimerBar = ({ submittedAt, expiresAt, onExpire }) => {
	const [timeLeftFormatted, setTimeLeftFormatted] = useState('')
	const [progress, setProgress] = useState(1)

	useEffect(() => {
		const startTime = new Date(submittedAt).getTime()
		const endTime = new Date(expiresAt).getTime()
		const totalDuration = endTime - startTime

		if (totalDuration <= 0) {
			setProgress(0)
			setTimeLeftFormatted('00:00')
			return
		}

		const updateTimer = () => {
			const now = new Date().getTime()
			const remaining = endTime - now

			if (remaining <= 0) {
				setProgress(0)
				setTimeLeftFormatted('00:00')
				if (onExpire) onExpire()
				return
			}

			// Вычисляем процент оставшегося времени (от 1.0 до 0.0)
			const currentProgress = Math.max(0, remaining / totalDuration)
			setProgress(currentProgress)

			// Форматируем MM:SS
			const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
			const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
			setTimeLeftFormatted(formatted)
		}

		updateTimer()
		const intervalId = setInterval(updateTimer, 1000)

		return () => clearInterval(intervalId)
	}, [submittedAt, expiresAt])

	return (
		<div className='w-full flex flex-col'>
			<div className='flex justify-end mx-2 items-center text-sm font-medium'>
				<span className='font-mono text-base font-bold'>
					{timeLeftFormatted}
				</span>
			</div>
			<ProgressBar progress={progress} />
		</div>
	)
}
