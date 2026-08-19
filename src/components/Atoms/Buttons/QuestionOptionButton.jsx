import { Check } from 'lucide-react'

export const QuestionOptionButton = ({
	id,
	initialText,
	initialIsSelected,
	onHandleAnswer,
}) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const [textValue, setTextValue] = useState(initialText || '')
	const [isSelected, setIsSelected] = useState(initialIsSelected || false)

	const handleAnswer = () => {
		setIsSelected(prev => !prev)
		onHandleAnswer?.()
	}

	return (
		<div onClick={handleAnswer} className='flex gap-2 w-full'>
			{/* Инпут с дебаунсом */}
			<div className='flex-1'>
				<p
					className={`flex justify-between rounded-2xl p-3 shadow-[var(--shadow)] outline-0 transition-all cursor-pointer  hover:ring-3 ${isSelected ? 'bg-[var(--hero)] text-white ring-[var(--transparent-hero)]' : 'text-[var(--black)] bg-[var(--white)] ring-[var(--hero)]'}`}
				>
					{initialText}
					<Check
						className={`transition-all ${isSelected ? 'opacity-100' : 'opacity-0'}`}
					/>
				</p>
			</div>
		</div>
	)
}
