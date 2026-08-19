import React from 'react'

export const VolumeSlider = ({ volume, onChange }) => (
	<input
		type='range'
		min='0'
		max='1'
		step='0.05'
		value={volume}
		onChange={e => onChange(parseFloat(e.target.value))}
		className='w-20 accent-[var(--hero)] cursor-pointer'
	/>
)
