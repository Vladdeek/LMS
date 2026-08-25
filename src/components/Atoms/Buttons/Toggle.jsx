import { useEffect, useState } from 'react'

export const Toggle = ({
	label = '',
	value,
	defaultValue = false,
	onChange,
}) => {
	const [isActive, setIsActive] = useState(value || defaultValue)
	const handleClick = () => {
		setIsActive(prev => !prev)
	}
	useEffect(() => {
		onChange?.(isActive)
	}, [isActive])

	return (
		<button
			type='button'
			role='switch'
			aria-checked={isActive}
			onClick={handleClick}
			className='inline-flex flex-row-reverse items-center gap-3 cursor-pointer bg-transparent border-none p-0 select-none focus:outline-none '
		>
			{/* Эллипс (трек тумблера) */}
			<span
				className={`
					relative inline-block h-6 w-11 flex-shrink-0 rounded-full ring-2 ring-[var(--white)]
					transition-colors duration-200 ease-in-out shadow-inner
					${isActive ? 'bg-[var(--hero)]' : 'bg-[var(--bg)]'}
				`}
			>
				{/* Внутренний шарик */}
				<span
					className={`
						absolute top-[3px] left-0 inline-block h-[18px] w-[18px] rounded-full bg-[var(--white)]
						transition-transform duration-200 ease-in-out shadow-sm
						${isActive ? 'translate-x-[23px]' : 'translate-x-[3px]'}
					`}
				/>
			</span>

			{/* Подпись */}
			{label && (
				<span className=' font-medium text-[var(--black)]'>{label}</span>
			)}
		</button>
	)
}
