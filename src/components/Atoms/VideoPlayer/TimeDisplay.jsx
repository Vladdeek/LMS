import React from 'react'

export const TimeDisplay = ({ current, total }) => (
	<span className='text-xs font-medium text-gray-500 tabular-nums'>
		{current} / {total}
	</span>
)
