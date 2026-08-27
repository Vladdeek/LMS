import { useState } from 'react'
import { CheckIcon } from '../Atoms/CheckIcon'
import { AnimatePresence } from 'framer-motion'
import { Text } from '../Atoms/Text'
import { Show } from '../Atoms/Show'

export const Checkbox = ({ title = 'текст', checked, onChange }) => {
	const [localChecked, setLocalChecked] = useState(false)

	const isCurrentChecked = checked !== undefined ? checked : localChecked
	const handleChange = onChange || (() => setLocalChecked(!localChecked))

	const CHECK_STYLES = {
		isCheck: 'bg-[var(--hero)]/25 border-[var(--hero-pale)]/25',
		isNotCheck: 'border-[var(--light-middle)] bg-[var(--white)]',
	}

	return (
		<label className='group flex items-center gap-2 cursor-pointer select-none'>
			<input
				type='checkbox'
				checked={isCurrentChecked}
				onChange={handleChange}
				className='sr-only'
			/>
			<div
				className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
					${isCurrentChecked ? CHECK_STYLES.isCheck : CHECK_STYLES.isNotCheck}`}
			>
				<AnimatePresence>
					<Show when={isCurrentChecked}>
						<CheckIcon />
					</Show>
				</AnimatePresence>
			</div>

			<Show when={title}>
				<Text text={'sm'} style={'primary'} font={'semibold'}>
					{title}
				</Text>
			</Show>
		</label>
	)
}
