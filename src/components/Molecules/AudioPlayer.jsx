import { useState, useRef, useEffect } from 'react'
import { AudioPlayerButton } from '../Atoms/AudioPlayer/AudioPlayerButton'
import { AudioPlayerProgressBar } from '../Atoms/AudioPlayer/AudioPlayerProgressBar'
import { AudioVolumeControl } from '../Atoms/AudioPlayer/AudioVolumeControl'
import { MEDIA_API_URL } from '../../API'

export const AudioPlayer = ({ data, volumeOn, course = false }) => {
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

	// Форматирование размера файла из байт в KB / MB
	const formatFileSize = bytes => {
		if (!bytes || isNaN(bytes)) return ''
		if (bytes < 1024 * 1024) {
			return `${(bytes / 1024).toFixed(1)} KB`
		}
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
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
	}, [data])

	return (
		<div className='w-full flex justify-center'>
			<div className={course ? 'w-2/3' : 'w-full max-lg:w-4/5'}>
				<div className='bg-[var(--white)] rounded-2xl p-4 shadow-[var(--shadow)] flex flex-col gap-2'>
					{/* Информация о файле */}
					<div className='flex items-center justify-between text-sm font-medium text-gray-700 truncate'>
						<span
							className='truncate font-semibold'
							title={data?.original_name}
						>
							{data?.original_name || 'Без названия'}
						</span>
						<span className='text-xs text-gray-400 uppercase ml-2 whitespace-nowrap'>
							{data?.file_extension} • {formatFileSize(data?.file_size)}
						</span>
					</div>

					<audio
						ref={audioRef}
						src={MEDIA_API_URL + data?.file_path}
						className='hidden'
					/>

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
						{/* <AudioVolumeControl
							volume={volume}
							isMuted={isMuted}
							onVolumeChange={handleVolumeChange}
							onToggleMute={toggleMute}
						/> */}
					</div>
				</div>
			</div>
		</div>
	)
}
