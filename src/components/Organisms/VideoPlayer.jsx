import React from 'react'
import { useVideoPlayer } from '../../hooks/useVideoPlayer'
import { ControlsOverlay } from '../Molecules/VideoPlayer/ControlsOverlay'
import { MEDIA_API_URL } from '../../API'

export const VideoPlayer = ({ url }) => {
	const player = useVideoPlayer()
	// 1. Создаем реф для главного контейнера
	const containerRef = React.useRef(null)

	// 2. Функция для переключения полноэкранного режима через Browser API
	const handleToggleFullScreen = () => {
		if (!document.fullscreenElement) {
			containerRef.current?.requestFullscreen().catch(err => {
				console.error(`Ошибка включения полноэкранного режима: ${err.message}`)
			})
		} else {
			document.exitFullscreen()
		}
		// Запускаем кастомный хендлер, если он меняет стейт в хуке
		player.toggleFullScreen?.()
	}

	return (
		<div
			ref={containerRef}
			className={`relative w-full overflow-hidden rounded-xl bg-black group transition-all ${
				player.fullScreen
					? 'fixed inset-0 z-[1000] h-full w-full rounded-none'
					: 'aspect-video shadow-[var(--shadow)]'
			}`}
		>
			{url ? (
				<>
					<video
						ref={player.videoRef}
						src={MEDIA_API_URL + url}
						className='w-full h-full object-contain'
						onTimeUpdate={player.handleTimeUpdate}
						onLoadedMetadata={player.handleLoadedMetadata}
						onEnded={player.handleEnded}
						onClick={player.togglePlay}
					/>
					<ControlsOverlay
						playing={player.playing}
						volume={player.volume}
						muted={player.muted}
						progress={player.progress}
						duration={player.duration}
						fullScreen={player.fullScreen}
						onTogglePlay={player.togglePlay}
						onToggleMute={player.toggleMute}
						onVolumeChange={player.handleVolumeChange}
						onSeek={player.handleSeek}
						onToggleFullScreen={handleToggleFullScreen}
						formatTime={player.formatTime}
					/>
				</>
			) : (
				<div className='absolute inset-0 flex items-center justify-center bg-[var(--light-gray)]'>
					<p className='text-[var(--middle)]'>Видео не загружено</p>
				</div>
			)}
		</div>
	)
}
