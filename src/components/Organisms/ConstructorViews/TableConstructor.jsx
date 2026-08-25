import { Minus, Plus, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { RemoveButton } from '../../Atoms/Buttons/RemoveButton'
import { Show } from '../../Atoms/Show'

const LIMITS = {
	maxCols: import.meta.env.VITE_MAXCOLS_COUNT,
	maxRows: import.meta.env.VITE_MAXROWS_COUNT,
	minCols: import.meta.env.VITE_MINCOLS_COUNT,
	minRows: import.meta.env.VITE_MINROWS_COUNT,
}

// Компонент ячейки с фантомным дивом для авто-высоты всей строки
const AutoResizeTextarea = ({ value, onChange, readOnly, isDark }) => {
	return (
		<div
			className={`relative flex w-full h-full min-h-[42px] border-[1px] border-[var(--light-middle)] ${
				isDark ? 'bg-[var(--light-gray)]' : 'bg-[var(--white)]'
			}`}
		>
			{/* Невидимый фантом, который физически растягивает ячейку и всю строку grid */}
			<div
				className='p-2 text-sm break-words whitespace-pre-wrap invisible aria-hidden select-none pointer-events-none'
				aria-hidden='true'
			>
				{value || ' '}
			</div>

			{/* Сам инпут, который абсолютно позиционируется и занимает 100% высоты ячейки */}
			<textarea
				rows={1}
				value={value}
				readOnly={readOnly}
				onChange={onChange}
				className={`absolute inset-0 w-full h-full p-2 text-sm outline-none resize-none break-words whitespace-pre-wrap bg-transparent transition-all text-[var(--black)] ${
					!readOnly ? 'focus:bg-transparent' : 'cursor-default'
				}`}
			/>
		</div>
	)
}

export const DynamicTable = ({
	initialData = [],
	initialRows = 2,
	initialCols = 2,
	isEdit = true,
	onChange,
	onDelete,
}) => {
	const [grid, setGrid] = useState(() => {
		if (initialData.length > 0) {
			return Array.from({ length: initialRows }, (_, r) =>
				Array.from(
					{ length: initialCols },
					(_, c) => initialData[r * initialCols + c] || '',
				),
			)
		}
		return Array.from({ length: initialRows }, () =>
			Array(initialCols).fill(''),
		)
	})

	const rows = grid.length
	const cols = grid[0]?.length || 0

	const updateGrid = newGrid => {
		setGrid(newGrid)
		onChange?.({
			rows: newGrid.length,
			cols: newGrid[0]?.length || 0,
			data: newGrid.flat(),
		})
	}

	const addRow = () => {
		if (rows < LIMITS.maxRows) {
			updateGrid([...grid, Array(cols).fill('')])
		}
	}

	const removeRow = () => {
		if (rows > LIMITS.minRows) {
			updateGrid(grid.slice(0, -1))
		}
	}

	const addCol = () => {
		if (cols < LIMITS.maxCols) {
			updateGrid(grid.map(row => [...row, '']))
		}
	}

	const removeCol = () => {
		if (cols > LIMITS.minCols) {
			updateGrid(grid.map(row => row.slice(0, -1)))
		}
	}

	const updateCell = (r, c, value) => {
		const newGrid = grid.map((row, rowIndex) =>
			rowIndex === r
				? row.map((cell, colIndex) => (colIndex === c ? value : cell))
				: row,
		)
		updateGrid(newGrid)
	}

	return (
		<div className='flex gap-4 justify-center w-full'>
			<Show when={isEdit && onDelete}>
				<RemoveButton onDelete={onDelete} />
			</Show>

			<div className='flex flex-col bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl p-4 w-full max-xl:w-4/5'>
				<p className='text-[var(--middle)] font-medium mb-2'>Таблица</p>

				<div className='w-full overflow-x-auto'>
					<div className='flex justify-between w-full'>
						{/* Сетка таблицы */}
						<div
							className='grid w-full min-w-[300px] mb-1 mr-1 rounded-xl overflow-hidden border border-[var(--light-middle)] items-stretch'
							style={{
								gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))`,
							}}
						>
							{grid.map((row, r) =>
								row.map((cell, c) => {
									const isDark = c % 2 === 1
									return (
										<AutoResizeTextarea
											key={`${r}-${c}`}
											value={cell}
											readOnly={!isEdit}
											isDark={isDark}
											onChange={e => isEdit && updateCell(r, c, e.target.value)}
										/>
									)
								}),
							)}
						</div>

						{/* Контролы колонок */}
						{isEdit && (
							<div className='flex flex-col mb-1 gap-1'>
								<button
									type='button'
									disabled={cols >= LIMITS.maxCols}
									className='w-10 h-full rounded-xl flex items-center justify-center bg-[var(--light-middle)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 active:brightness-90 transition-all'
									onClick={addCol}
								>
									<Plus color='var(--middle)' />
								</button>
								<button
									type='button'
									disabled={cols <= LIMITS.minCols}
									className='w-10 h-full rounded-xl flex items-center justify-center bg-[var(--light-middle)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 active:brightness-90 transition-all'
									onClick={removeCol}
								>
									<Minus color='var(--middle)' />
								</button>
							</div>
						)}
					</div>

					{/* Контролы строк */}
					{isEdit && (
						<div className='flex mt-2 gap-1'>
							<button
								type='button'
								disabled={rows >= LIMITS.maxRows}
								className='w-full h-10 rounded-xl flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 active:brightness-90 transition-all'
								onClick={addRow}
							>
								<Plus color='var(--middle)' /> Добавить строку
							</button>
							<button
								type='button'
								disabled={rows <= LIMITS.minRows}
								className='w-full h-10 rounded-xl flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 active:brightness-90 transition-all'
								onClick={removeRow}
							>
								<Minus color='var(--middle)' /> Удалить строку
							</button>
							<div className='w-21' />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
