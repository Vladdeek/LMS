export const LessonTypeSelector = ({ types, selectedIndex, onSelect }) => (
	<>
		<div className='grid grid-cols-2 gap-2'>
			{types.map((item, index) => (
				<button
					key={index}
					type='button'
					onClick={() => onSelect(index)}
					className={`flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all ${
						selectedIndex === index
							? 'bg-[var(--hero-pale)] text-[var(--hero)]'
							: 'bg-[var(--bg)]/50 text-[var(--middle)]'
					} hover:scale-105 cursor-pointer`}
				>
					<span>{item.icon}</span>
					<span className='font-medium'>{item.label}</span>
				</button>
			))}
		</div>
		<p className='text-[var(--middle)] text-center text-sm'>
			{types[selectedIndex]?.description}
		</p>
	</>
)
