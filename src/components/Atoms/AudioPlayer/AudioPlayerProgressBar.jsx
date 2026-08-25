import { useRef } from 'react'

export const AudioPlayerProgressBar = ({
	currentTime,
	duration,
	onSeek,
	formatTime,
}) => {
	const barRef = useRef(null)

	const handleClick = e => {
		if (!barRef.current || !duration) return
		const rect = barRef.current.getBoundingClientRect()
		const clickPosition = (e.clientX - rect.left) / rect.width
		onSeek(clickPosition * duration)
	}

	const progressPercent = duration ? (currentTime / duration) * 100 : 0

	return (
		<div className='flex flex-col w-full gap-1'>
			<div
				ref={barRef}
				className='w-full h-2 bg-[var(--light-middle)] rounded-full cursor-pointer overflow-hidden'
				onClick={handleClick}
			>
				<div
					className='h-full bg-[var(--hero-epta)] rounded-full transition-all duration-150'
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
			<div className='flex justify-between text-sm text-[var(--middle)]'>
				<span>{formatTime(currentTime)}</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>
	)
}
