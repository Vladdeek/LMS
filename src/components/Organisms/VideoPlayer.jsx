import React from 'react'
import { useVideoPlayer } from '../../hooks/useVideoPlayer'
import { ControlsOverlay } from '../Molecules/VideoPlayer/ControlsOverlay'

export const VideoPlayer = ({ url }) => {
	const player = useVideoPlayer()

	return (
		<div
			className={`relative w-full overflow-hidden rounded-xl bg-black group transition-all ${
				player.fullScreen
					? 'fixed inset-0 z-[1000] h-screen w-screen'
					: 'aspect-video shadow-[var(--shadow)]'
			}`}
		>
			{url ? (
				<>
					<video
						ref={player.videoRef}
						src={url}
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
						onToggleFullScreen={player.toggleFullScreen}
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
