import { useEffect, useState } from 'react'

export const Loading = ({ className }) => {
	const states = ['', '.', '..', '...']
	const [step, setStep] = useState(0)

	useEffect(() => {
		const i = setInterval(() => {
			setStep(prev => (prev + 1) % states.length)
		}, 500)

		return () => clearInterval(i)
	}, [])

	return (
		<span className={`inline-flex ${className || ''}`}>
			Загрузка
			<span className='flex justify-start' style={{ width: '2ch' }}>
				{states[step]}
			</span>
		</span>
	)
}
