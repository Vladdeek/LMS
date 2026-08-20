import { X } from 'lucide-react'

export const TestHeaderBlock = ({
	num,
	questionId,
	isActive,
	onClick,
	delQuestion,
	isEdit,
}) => {
	const STYLES = {
		// По умолчанию все блоки в дефолтном стиле
		default: 'bg-[var(--white)] text-[var(--middle)] hover:text-[var(--hero)] ',
		// При клике активируется этот стиль
		active: 'bg-[var(--hero)] text-white',
	}

	return (
		<div
			onClick={() => onClick(questionId)} // Передаем UUID вопроса при клике
			className={`w-10 h-10 flex items-center justify-center rounded-[10px] relative font-semibold text-xl shadow-[var(--shadow)] select-none cursor-pointer transition-all hover:scale-101 active:scale-99 active:shadow-inner group
                ${isActive ? STYLES.active : STYLES.default}
            `}
		>
			<p>{num}</p> {/* Порядковый номер для красоты отображения */}
			{isEdit && (
				<X
					onClick={e => delQuestion(e)}
					className='w-[16px] h-[16px] absolute -top-1 -right-1 bg-[var(--red-base)] rounded-full p-[3px] text-[var(--red-pale)] opacity-0 group-hover:opacity-100 hover:contrast-150 hover:scale-105 active:scale-95 transition-all z-10'
				/>
			)}
		</div>
	)
}
