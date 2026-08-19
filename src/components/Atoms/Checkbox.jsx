export const Checkbox = ({ children, text, title, onChange, flex = false }) => {
	const [checked, setChecked] = useState(false)
	useEffect(() => {
		onChange?.(checked)
	}, [checked])
	return (
		<div className='flex flex-col items-start w-full'>
			{title && (
				<p className='text-[18px] text-[var(--middle)] pt-[2px] mb-1 ml-1'>
					{title}
				</p>
			)}
			<div className={`${flex && 'flex-row'} flex-col flex gap-1 w-full`}>
				<div className='flex items-center gap-3 w-fit'>
					<div
						onClick={() => setChecked(prev => !prev)}
						className={`flex justify-center items-center aspect-square rounded-[10px] border-1 h-7 w-auto text-[var(--white)] transition-all cursor-pointer ${!checked ? 'bg-transparent border-[var(--light-middle)]' : 'bg-[var(--hero)] border-[var(--hero)]'}`}
					>
						<Check className={`opacity-0 ${checked && 'opacity-100'}`} />
					</div>
					{text && <p className='text-[var(--black)]'>{text}</p>}
				</div>
				<div
					className={`${!checked && 'opacity-50 pointer-events-none'} w-full`}
				>
					{children}
				</div>
			</div>
		</div>
	)
}
