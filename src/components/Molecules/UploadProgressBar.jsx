export const UploadProgressBar = ({ progress }) => {
	return (
		<div className='flex flex-col items-center gap-3 w-1/2'>
			<div className='flex items-center gap-2'>
				<p className='text-sm font-bold text-[var(--black)]'>{progress}%</p>
				{/* Вместо старого Loader используем простую CSS-крутилку */}
				<div className='w-4 h-4 border-2 border-[var(--hero)] border-t-transparent rounded-full animate-spin' />
			</div>

			<div className='w-full bg-[var(--light-middle)] h-2 rounded-full overflow-hidden'>
				<div
					className='bg-[var(--hero)] h-full transition-all duration-300 ease-out'
					style={{ width: `${progress}%` }}
				/>
			</div>
			<p className='text-[10px] uppercase tracking-wider text-[var(--middle)] font-medium'>
				Загрузка на сервер...
			</p>
		</div>
	)
}
