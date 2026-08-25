import { LevelButton } from '../Atoms/Buttons/LevelButton'

export const LevelsBar = ({ questions, activeIndex, setActiveIndex }) => (
	<div className='flex flex-wrap gap-3 my-4 justify-center'>
		{questions.map((q, idx) => (
			<LevelButton
				key={q.id || idx}
				index={idx}
				isActive={activeIndex === idx}
				isFilled={q.filled}
				onClick={() => setActiveIndex(idx)}
			/>
		))}
	</div>
)
