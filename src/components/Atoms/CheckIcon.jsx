import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const CheckIcon = () => (
	<motion.svg
		className='absolute -top-1.5 -right-2 w-7 h-7 pointer-events-none'
		viewBox='0 0 24 24'
		fill='none'
		initial={{ scale: 0.6, opacity: 0 }}
		animate={{ scale: 1, opacity: 1 }}
		exit={{ scale: 0.6, opacity: 0 }}
		transition={{ duration: 0.2, ease: 'easeOut' }}
	>
		<motion.path
			d='M4 12L9 17L20 6'
			stroke='var(--hero)'
			strokeWidth={2.5}
			strokeLinecap='round'
			strokeLinejoin='round'
			initial={{ pathLength: 0 }}
			animate={{ pathLength: 1 }}
			exit={{ pathLength: 0 }}
			transition={{
				type: 'spring',
				stiffness: 120,
				damping: 15,
				delay: 0.05,
			}}
		/>
	</motion.svg>
)
