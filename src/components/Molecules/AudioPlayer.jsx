import { useState, useRef, useEffect } from 'react'
import { AudioPlayerButton } from '../Atoms/AudioPlayer/AudioPlayerButton'
import { AudioPlayerProgressBar } from '../Atoms/AudioPlayer/AudioPlayerProgressBar'
import { AudioVolumeControl } from '../Atoms/AudioPlayer/AudioVolumeControl'

export const AudioPlayer = ({ audioUrl = null, volumeOn, course = false }) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(0.8)
	const [isMuted, setIsMuted] = useState(false)

	const audioRef = useRef(null)

	const togglePlayPause = () => {
		if (!audioRef.current) return
		if (isPlaying) {
			audioRef.current.pause()
		} else {
			audioRef.current.play()
		}
		setIsPlaying(!isPlaying)
	}

	const handleSeek = newTime => {
		if (!audioRef.current) return
		audioRef.current.currentTime = newTime
		setCurrentTime(newTime)
	}

	const handleVolumeChange = newVolume => {
		setVolume(newVolume)
		if (audioRef.current) {
			audioRef.current.volume = newVolume
		}
		setIsMuted(newVolume === 0)
	}

	const toggleMute = () => {
		if (!audioRef.current) return
		audioRef.current.volume = isMuted ? volume : 0
		setIsMuted(!isMuted)
	}

	const formatTime = time => {
		if (isNaN(time)) return '0:00'
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const handleLoadedMetadata = () => setDuration(audio.duration)
		const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
		const handleEnded = () => {
			setIsPlaying(false)
			setCurrentTime(0)
		}

		audio.addEventListener('loadedmetadata', handleLoadedMetadata)
		audio.addEventListener('timeupdate', handleTimeUpdate)
		audio.addEventListener('ended', handleEnded)

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
			audio.removeEventListener('timeupdate', handleTimeUpdate)
			audio.removeEventListener('ended', handleEnded)
		}
	}, [audioUrl])

	return (
		<div className='w-full flex justify-center'>
			<div className={course ? 'w-2/3' : 'w-full max-lg:w-4/5'}>
				<div className='bg-[var(--white)] rounded-lg p-4 shadow-[var(--shadow)]'>
					<audio ref={audioRef} src={audioUrl} className='hidden' />
					<div className='flex gap-3 items-center w-full'>
						<AudioPlayerButton
							isPlaying={isPlaying}
							onClick={togglePlayPause}
						/>
						<AudioPlayerProgressBar
							currentTime={currentTime}
							duration={duration}
							onSeek={handleSeek}
							formatTime={formatTime}
						/>
						{volumeOn && (
							<AudioVolumeControl
								volume={volume}
								isMuted={isMuted}
								onVolumeChange={handleVolumeChange}
								onToggleMute={toggleMute}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
