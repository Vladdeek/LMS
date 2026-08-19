export const StartTestingButton = ({ title, onClick }) => {
	return (
		<button
			onClick={onClick}
			className='relative inline-flex h-14 active:scale-98 overflow-hidden rounded-2xl p-0 focus:outline-none hover:p-[2px] hover:shadow-[var(--hero-glow)] transition-all duration-300'
		>
			<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--darkness-hero)_0%,var(--hero)_50%,var(--light-hero)_100%)]'></span>
			<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] bg-[var(--black)] px-7 text-lg font-normal text-[var(--white)] backdrop-blur-3xl gap-2 undefined transition-all '>
				{title}
			</span>
		</button>
	)
}
