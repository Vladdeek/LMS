import React from 'react'

export const IconButton = ({ onClick, children, className = '' }) => (
	<button
		onClick={onClick}
		className={`hover:text-[var(--hero)] transition-all ${className}`}
	>
		{children}
	</button>
)
