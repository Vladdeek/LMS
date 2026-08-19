import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { IconButton } from '../../Atoms/Buttons/IconButton'
import { VolumeSlider } from '../../Atoms/VideoPlayer/VolumeSlider'

export const VolumeControl = ({
	volume,
	muted,
	onToggleMute,
	onVolumeChange,
}) => (
	<div className='flex items-center gap-2'>
		<IconButton onClick={onToggleMute}>
			{muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
		</IconButton>
		<VolumeSlider volume={muted ? 0 : volume} onChange={onVolumeChange} />
	</div>
)
