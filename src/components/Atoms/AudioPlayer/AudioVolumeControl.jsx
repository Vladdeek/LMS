import { Volume2, VolumeX } from 'lucide-react'

export const AudioVolumeControl = ({
	volume,
	isMuted,
	onVolumeChange,
	onToggleMute,
}) => (
	<div className='flex items-center space-x-2'>
		<input
			type='range'
			min='0'
			max='1'
			step='0.01'
			value={isMuted ? 0 : volume}
			onChange={e => onVolumeChange(parseFloat(e.target.value))}
			className='w-20 h-1 bg-[var(--light-middle)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full'
		/>
		<button
			type='button'
			onClick={onToggleMute}
			className='text-[var(--middle)] hover:text-[var(--hero-epta)] cursor-pointer p-2'
		>
			{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
		</button>
	</div>
)
