import { Check } from 'lucide-react'
import { CheckCheck } from 'lucide-react'
import { useEffect } from 'react'
import { useState } from 'react'

export const ToggleButton = ({
	select,
	setSelect,
	toggles = ['вариант 1', 'вариант 2'],
}) => {
	return (
		<div className='bg-[var(--white)] relative shadow-inner w-full h-12 rounded-3xl border border-[#25252507] overflow-hidden'>
			{/* Переключатель (фон) */}
			<div
				className={`absolute top-[2px] left-[2px] w-[calc(50%-4px)] h-[calc(100%-4px)] bg-[var(--black)] rounded-[22px] transition-transform duration-300`}
				style={{
					transform: `translateX(${select === 1 ? '102%' : '0%'})`,
				}}
			/>

			{/* Текст */}
			<div className='relative flex h-full w-full items-center z-10'>
				<p
					onClick={() => setSelect?.(0)}
					className={`w-1/2 text-center cursor-pointer font-medium transition-colors duration-300 ${
						select === 0 ? 'text-[var(--white)]' : 'text-[var(--black)]'
					}`}
				>
					{toggles[0]}
				</p>
				<p
					onClick={() => setSelect?.(1)}
					className={`w-1/2 text-center cursor-pointer font-medium transition-colors duration-300 ${
						select === 1 ? 'text-[var(--white)]' : 'text-[var(--black)]'
					}`}
				>
					{toggles[1]}
				</p>
			</div>
		</div>
	)
}

export const DefaultButton = ({
	children,
	onClick,
	disabled,
	paddings = 'px-4 py-2',
	rounded = 'rounded-xl',
	width = 'w-fit',
	height = '',
	flexParams = 'gap-3',
	invert = false,
}) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={` ${disabled ? 'bg-[var(--middle)] text-[var(--light-middle)] cursor-not-allowed' : `${invert ? 'bg-[var(--white)] text-[var(--black)]' : 'bg-[var(--black)] text-[var(--white)]'} hover:bg-[var(--hero)] hover:text-white cursor-pointer`}  ${paddings} ${rounded} ${width} flex  ${flexParams} font-bold transition-all shadow-[var(--shadow)] text-center `}
		>
			{children}
		</button>
	)
}

export const SubmitButton = ({
	onClick,
	icon: Icon,
	title,
	IconColor,
	disabled = false,
}) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`${
				!disabled
					? 'active:scale-99 active:brightness-90 hover:bg-[var(--hero-epta)] hover:text-white  cursor-pointer'
					: 'opacity-25 cursor-not-allowed'
			} bg-[var(--black)] text-[var(--white)] rounded-xl h-full flex gap-4 items-center justify-center transition-all py-4`}
		>
			{Icon && <Icon size={size / 1.75 || 24} color={IconColor} />}
			{title && (
				<span className='font-medium truncate text-ellipsis'>{title}</span>
			)}
		</button>
	)
}

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

export const RadioButton = ({
	name,
	value,
	checked,
	onChange,
	icon: Icon,
	title,
	fill = false,
	wfull = false,
	disabled = false,
	className,
}) => {
	return (
		<label
			className={`${className} ${
				disabled && 'opacity-50'
			} flex items-center gap-2 px-4 py-2 ${
				wfull && 'w-full justify-center'
			} max-md:w-full max-md:justify-center rounded-xl border cursor-pointer transition-all ${
				checked
					? `${
							fill ? 'bg-[var(--hero)]' : 'bg-[var(--white)]'
						} border-[var(--hero)] ${
							fill ? 'text-white' : 'text-[var(--hero)]'
						} `
					: 'bg-transparent border-[var(--middle)] text-[var(--middle)] hover:border-[var(--hero)] hover:text-[var(--hero)]'
			}`}
		>
			<input
				type='radio'
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				className='hidden'
				disabled={disabled}
			/>
			{Icon && <Icon className='w-5 h-5' />}
			<span className='text-sm font-medium'>{title}</span>
		</label>
	)
}
