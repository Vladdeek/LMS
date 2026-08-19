import { useState } from 'react'
import { InputBase } from '../../Atoms/InputField/InputBase'

export const FileInput = ({
	onChange,
	title,
	required,
	description,
	accept,
}) => {
	const [fileName, setFileName] = useState('')

	const handleChange = e => {
		const file = e.target.files[0]
		if (file) {
			setFileName(file.name)
			onChange?.(file)
		}
	}

	return (
		<InputBase
			title={title}
			required={required}
			status={fileName.length > 0}
			description={description}
		>
			<div className='relative w-full'>
				<input
					type='text'
					value={fileName}
					readOnly
					accept={accept}
					placeholder='Файл не выбран'
					className='w-full rounded-2xl p-3 pr-32 bg-[var(--white)] shadow-inner border border-[var(--black)]/2.5'
				/>

				<label className='absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer px-3 py-2.75 bg-black text-white rounded-xl text-sm'>
					Выбрать файл
					<input type='file' onChange={handleChange} className='hidden' />
				</label>
			</div>
		</InputBase>
	)
}
