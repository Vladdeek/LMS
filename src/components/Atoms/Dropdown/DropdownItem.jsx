import React from 'react'

export const DropdownItem = ({
	icon: Icon,
	label,
	onClick,
	variant = 'default',
}) => {
	const variantStyles = {
		default: 'text-[var(--primary)] hover:bg-[var(--light-middle)]',
		danger: 'text-red-500 hover:bg-red-50 hover:text-red-600',
	}

	return (
		<button
			type='button'
			onClick={onClick}
			className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors cursor-pointer border-none bg-transparent ${variantStyles[variant]}`}
		>
			{Icon && <Icon size={16} />}
			<span>{label}</span>
		</button>
	)
}
