import {
	Divide,
	FunctionSquare,
	Sigma,
	SquareRadical,
	Superscript,
	X,
} from 'lucide-react'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { InputDefault } from '../Inputs'
import { RemoveButton } from './FileUploaderZone'
// Импортируй свой InputDefault
// import { InputDefault } from './ваша-путь-к-инпуту'

const mathJaxConfig = {
	loader: { load: ['input/tex', 'output/chtml'] },
	tex: {
		inlineMath: [
			['$', '$'],
			['\\(', '\\)'],
		],
		displayMath: [
			['$$', '$$'],
			['\\[', '\\]'],
		],
	},
}

export const Formula = ({
	isEdit = false,
	values,
	onChange,
	onDelete,
	data,
}) => {
	const [formula, setFormula] = useState(values?.formula || 'E = mc^2')

	useEffect(() => {
		if (data) {
			setFormula(data.formula)
		}
	}, [data])

	// Синхронизация с пропсами
	useEffect(() => {
		if (values?.formula !== undefined) {
			setFormula(values.formula)
		}
	}, [values?.formula])

	// Уведомление родителя об изменениях
	useEffect(() => {
		if (isEdit) {
			onChange?.({ formula })
		}
	}, [formula, isEdit])

	const insertTemplate = useCallback(tpl => {
		setFormula(prev => prev + tpl)
	}, [])

	const buttons = useMemo(
		() => [
			{ icon: <Superscript size={16} />, title: 'Степень', tpl: '^{x}' },
			{ icon: <Divide size={16} />, title: 'Дробь', tpl: '\\frac{a}{b}' },
			{ icon: <Sigma size={16} />, title: 'Сумма', tpl: '\\sum_{i=1}^{n}' },
			{ icon: <SquareRadical size={16} />, title: 'Корень', tpl: '\\sqrt{x}' },
			{
				icon: <FunctionSquare size={16} />,
				title: 'Интеграл',
				tpl: '\\int f(x) dx',
			},
		],
		[],
	)

	const renderPreview = isDisplayMode => (
		<div
			className={`p-4 rounded-xl bg-[var(--light-middle)] text-[var(--black)] text-center min-h-[80px] flex items-center justify-center shadow-sm`}
		>
			{/* dynamic={true} заставляет MathJax перерендеривать текст при изменении контента */}
			<MathJax dynamic>
				{isDisplayMode ? `$$${formula}$$` : `$${formula}$`}
			</MathJax>
		</div>
	)

	// Если контекст MathJax один на всё приложение — уберите MathJaxContext отсюда.
	// Если он только тут, оставляем.
	const content = (
		<MathJaxContext version={3} config={mathJaxConfig}>
			{!isEdit ? (
				<div className='flex justify-center w-full'>{renderPreview(true)}</div>
			) : (
				<div className='flex gap-4 w-full'>
					<RemoveButton onDelete={onDelete} />

					<div className='w-full max-w-xl p-6 bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl space-y-4'>
						<div className='flex items-center gap-2 text-lg font-semibold text-[var(--black)]'>
							<Sigma className='w-6 h-6' />
							<span>Конструктор формул</span>
						</div>

						<div className='flex flex-wrap gap-2'>
							{buttons.map((item, index) => (
								<button
									key={index}
									onClick={() => insertTemplate(item.tpl)}
									className='flex items-center gap-1 px-3 py-1 bg-[var(--transparent-hero)] text-[var(--hero)] rounded-lg hover:scale-105 transition-all cursor-pointer text-sm'
								>
									{item.icon} {item.title}
								</button>
							))}
						</div>

						{/* Используем твой кастомный инпут */}
						<InputDefault
							placeholder='Введи формулу...'
							value={formula}
							onChange={e => setFormula(e.target.value)}
							validate={val => val.length > 0}
						/>

						<div className='mt-4'>
							<p className='text-xs text-gray-400 mb-2'>Превью:</p>
							{renderPreview(false)}
						</div>
					</div>
				</div>
			)}
		</MathJaxContext>
	)

	return content
}
