import React from 'react'
import { ProgressBar } from '../../Atoms/ProgressBar'
import { IconButton } from '../../Atoms/Buttons/IconButton'
import { Maximize, Minimize, Pause, Play } from 'lucide-react'
import { VolumeControl } from './VolumeControl'
import { TimeDisplay } from '../../Atoms/VideoPlayer/TimeDisplay'

export const ControlsOverlay = ({
	playing,
	volume,
	muted,
	progress,
	duration,
	fullScreen,
	onTogglePlay,
	onToggleMute,
	onVolumeChange,
	onSeek,
	onToggleFullScreen,
	formatTime,
}) => (
	<div className='absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-lg flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity'>
		<ProgressBar progress={progress} onSeek={onSeek} />

		<div className='flex items-center justify-between text-[var(--black)]'>
			<div className='flex items-center gap-5'>
				<IconButton onClick={onTogglePlay}>
					{playing ? (
						<Pause size={22} fill='currentColor' />
					) : (
						<Play size={22} fill='currentColor' />
					)}
				</IconButton>

				<VolumeControl
					volume={volume}
					muted={muted}
					onToggleMute={onToggleMute}
					onVolumeChange={onVolumeChange}
				/>

				<TimeDisplay
					current={formatTime(progress * duration)}
					total={formatTime(duration)}
				/>
			</div>

			<IconButton onClick={onToggleFullScreen}>
				{fullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
			</IconButton>
		</div>
	</div>
)
