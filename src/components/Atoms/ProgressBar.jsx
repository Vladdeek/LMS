import React from 'react'

export const ProgressBar = ({ progress, onSeek }) => (
	<div
		className='w-full h-1.5 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden'
		onClick={onSeek}
	>
		<div
			className='absolute h-full bg-[var(--hero)] ease-linear transition-all'
			style={{ width: `${progress * 100}%` }}
		/>
	</div>
)
