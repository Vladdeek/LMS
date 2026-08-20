export const TextStroke = ({ title, value, textarea }) => {
	return (
		<div className='flex flex-col gap-1 w-full'>
			{title && (
				<span className='text-xs md:text-sm font-medium text-[var(--middle)] ml-1 select-none'>
					{title}
				</span>
			)}

			{textarea ? (
				<div className='rounded-2xl p-4 bg-[var(--light-middle)]/10 text-[var(--black)] shadow-inner border-1 border-[var(--middle)]/3 min-h-32 whitespace-pre-wrap break-words leading-relaxed cursor-default select-text'>
					{value || '—'}
				</div>
			) : (
				<div className='rounded-2xl p-3 bg-[var(--light-middle)]/10 text-[var(--black)] shadow-inner border-1 border-[var(--middle)]/3 truncate cursor-default select-text font-medium'>
					{value || '—'}
				</div>
			)}
		</div>
	)
}
