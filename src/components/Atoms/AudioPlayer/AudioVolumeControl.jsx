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
			className='w-20 h-3 bg-transparent appearance-none cursor-pointer
				[&::-webkit-slider-runnable-track]:w-full
				[&::-webkit-slider-runnable-track]:h-1
				[&::-webkit-slider-runnable-track]:bg-[var(--light-middle)]
				[&::-webkit-slider-runnable-track]:rounded-lg
				[&::-webkit-slider-thumb]:appearance-none
				[&::-webkit-slider-thumb]:h-3
				[&::-webkit-slider-thumb]:w-3
				[&::-webkit-slider-thumb]:rounded-full
				[&::-webkit-slider-thumb]:bg-[var(--hero)]
				[&::-webkit-slider-thumb]:-mt-1
				[&::-moz-range-track]:h-1
				[&::-moz-range-track]:bg-[var(--light-middle)]
				[&::-moz-range-track]:rounded-lg'
		/>
		<button
			type='button'
			onClick={onToggleMute}
			className='text-[var(--middle)] hover:text-[var(--hero)] cursor-pointer p-2 flex items-center justify-center'
		>
			{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
		</button>
	</div>
)
