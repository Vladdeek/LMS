import { Play, Pause } from 'lucide-react'

export const AudioPlayerButton = ({ isPlaying, onClick }) => (
	<button
		type='button'
		onClick={onClick}
		className='bg-[var(--hero)] hover:brightness-95 text-white p-3 rounded-full transition-all cursor-pointer'
	>
		{isPlaying ? <Pause size={24} /> : <Play size={24} />}
	</button>
)
