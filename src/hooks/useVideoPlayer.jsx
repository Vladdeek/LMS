import { useState, useRef, useEffect } from 'react'

export const useVideoPlayer = () => {
	const [playing, setPlaying] = useState(false)
	const [volume, setVolume] = useState(0.8)
	const [muted, setMuted] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const [fullScreen, setFullScreen] = useState(false)

	const videoRef = useRef(null)

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.volume = volume
		}
	}, [volume])

	const togglePlay = () => {
		if (!videoRef.current) return
		if (playing) {
			videoRef.current.pause()
		} else {
			videoRef.current.play()
		}
		setPlaying(!playing)
	}

	const toggleMute = () => {
		if (!videoRef.current) return
		const nextMuted = !muted
		videoRef.current.muted = nextMuted
		setMuted(nextMuted)
	}

	const handleVolumeChange = val => {
		setVolume(val)
		if (val > 0 && muted) {
			setMuted(false)
			if (videoRef.current) videoRef.current.muted = false
		}
	}

	const handleSeek = e => {
		if (!videoRef.current || !duration) return
		const rect = e.currentTarget.getBoundingClientRect()
		const percent = (e.clientX - rect.left) / rect.width
		const newTime = percent * duration
		videoRef.current.currentTime = newTime
		setProgress(percent)
	}

	const handleTimeUpdate = e => {
		if (duration > 0) {
			setProgress(e.target.currentTime / duration)
		}
	}

	const handleLoadedMetadata = e => {
		setDuration(e.target.duration)
	}

	const handleEnded = () => {
		setPlaying(false)
		setProgress(0)
	}

	const toggleFullScreen = () => {
		setFullScreen(!fullScreen)
	}

	const formatTime = seconds => {
		if (!seconds || isNaN(seconds)) return '0:00'
		const mm = Math.floor(seconds / 60)
		const ss = Math.floor(seconds % 60)
			.toString()
			.padStart(2, '0')
		return `${mm}:${ss}`
	}

	return {
		videoRef,
		playing,
		volume,
		muted,
		progress,
		duration,
		fullScreen,
		togglePlay,
		toggleMute,
		handleVolumeChange,
		handleSeek,
		handleTimeUpdate,
		handleLoadedMetadata,
		handleEnded,
		toggleFullScreen,
		formatTime,
	}
}
