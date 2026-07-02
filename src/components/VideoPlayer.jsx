import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

const VideoPlayer = ({ url }) => {
	const [playing, setPlaying] = useState(false)
	const [volume, setVolume] = useState(0.8)
	const [muted, setMuted] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const [fullScreen, setFullScreen] = useState(false)

	const videoRef = useRef(null)
	const containerRef = useRef(null)

	// Управление воспроизведением
	const togglePlay = () => {
		if (!videoRef.current) return
		if (playing) {
			videoRef.current.pause()
		} else {
			videoRef.current.play()
		}
		setPlaying(!playing)
	}

	// Звук
	const toggleMute = () => {
		if (!videoRef.current) return
		videoRef.current.muted = !muted
		setMuted(!muted)
	}

	const handleVolume = v => {
		setVolume(v)
		if (videoRef.current) {
			videoRef.current.volume = v
		}
	}

	// Перемотка
	const handleSeek = e => {
		if (!videoRef.current || !duration) return
		const rect = e.currentTarget.getBoundingClientRect()
		const percent = (e.clientX - rect.left) / rect.width
		videoRef.current.currentTime = percent * duration
	}

	const formatTime = seconds => {
		if (!seconds) return '0:00'
		const mm = Math.floor(seconds / 60)
		const ss = Math.floor(seconds % 60)
			.toString()
			.padStart(2, '0')
		return `${mm}:${ss}`
	}

	// Обработка полноэкранного режима через API браузера (по желанию) или через твой класс
	const toggleFullScreen = () => {
		setFullScreen(!fullScreen)
	}

	return (
		<div
			ref={containerRef}
			className={`relative w-full overflow-hidden rounded-xl bg-black group transition-all ${
				fullScreen
					? 'fixed inset-0 z-[1000] h-screen w-screen'
					: 'aspect-video shadow-[var(--shadow)]'
			}`}
		>
			{url ? (
				<video
					ref={videoRef}
					src={url}
					className='w-full h-full object-contain'
					onTimeUpdate={e => setProgress(e.target.currentTime / duration)}
					onLoadedMetadata={e => setDuration(e.target.duration)}
					onClick={togglePlay}
				/>
			) : (
				<div className='absolute inset-0 flex items-center justify-center bg-[var(--light-gray)]'>
					<p className='text-[var(--middle)]'>Видео не загружено</p>
				</div>
			)}

			{/* Контролы появляются при наведении на группу */}
			{url && (
				<div className='absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-lg flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity'>
					{/* Progress Bar */}
					<div
						className='w-full h-1.5 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden'
						onClick={handleSeek}
					>
						<div
							className='absolute h-full bg-[var(--hero-epta)] transition-all'
							style={{ width: `${progress * 100}%` }}
						/>
					</div>

					<div className='flex items-center justify-between text-[var(--black)]'>
						<div className='flex items-center gap-5'>
							{/* Play/Pause */}
							<button
								onClick={togglePlay}
								className='hover:text-[var(--hero-epta)] transition-all'
							>
								{playing ? (
									<Pause size={22} fill='currentColor' />
								) : (
									<Play size={22} fill='currentColor' />
								)}
							</button>

							{/* Volume */}
							<div className='flex items-center gap-2'>
								<button
									onClick={toggleMute}
									className='hover:text-[var(--hero-epta)] transition-all'
								>
									{muted || volume === 0 ? (
										<VolumeX size={20} />
									) : (
										<Volume2 size={20} />
									)}
								</button>
								<input
									type='range'
									min='0'
									max='1'
									step='0.05'
									value={volume}
									onChange={e => handleVolume(parseFloat(e.target.value))}
									className='w-20 accent-[var(--hero-epta)] cursor-pointer'
								/>
							</div>

							{/* Time */}
							<span className='text-xs font-medium text-gray-500 tabular-nums'>
								{formatTime(progress * duration)} / {formatTime(duration)}
							</span>
						</div>

						{/* Fullscreen */}
						<button
							onClick={toggleFullScreen}
							className='hover:text-[var(--hero-epta)] transition-all'
						>
							{fullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default VideoPlayer
