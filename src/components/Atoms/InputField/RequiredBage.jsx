import { CircleCheck } from 'lucide-react'

export const RequiredBadge = ({ active = false }) => {
	return (
		<CircleCheck
			className={active ? 'text-green-500' : 'text-[var(--middle)]'}
			size={16}
		/>
	)
}
