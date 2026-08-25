export const LevelButton = ({ index, isActive, isFilled, onClick }) => (
	<button
		type='button'
		onClick={onClick}
		className={`w-10 h-10 flex justify-center items-center rounded-md shadow-[var(--shadow)] transition-all ${
			isActive
				? 'bg-[var(--hero-epta)] text-[var(--white)]'
				: isFilled
					? 'bg-[var(--white)] text-[var(--black)] border-b-[3px] border-[var(--hero-epta)]'
					: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
		} active:scale-90 cursor-pointer`}
	>
		{index + 1}
	</button>
)
