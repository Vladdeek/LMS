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
		<p className={className}>
			Загрузка
			<span style={{ display: 'inline-block', width: '4ch' }}>
				{states[step]}
			</span>
		</p>
	)
}
