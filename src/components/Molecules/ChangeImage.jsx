import React, { useState } from 'react'
import { Dropdown } from '../Atoms/Dropdown/Dropdown'
import { Show } from '../Atoms/Show'
import { RadioGroup } from './RadioGroup'
import { PreviewInput } from './InputFields/PreviewInput'

export const COVERS = [
	'https://i.pinimg.com/1200x/56/2f/59/562f59bc2f8501bfb5763c0b2d641ebe.jpg',
	'https://i.pinimg.com/736x/02/90/4e/02904ea6206f7c3e3fc89015e534ca4f.jpg',
	'https://i.pinimg.com/1200x/ad/b8/cc/adb8ccdd8be7369e1f8c4216fc68ddb2.jpg',
	'https://i.pinimg.com/1200x/c8/f5/47/c8f5479a08324e0e1a70d7da9c42d713.jpg',
	'https://i.pinimg.com/736x/e2/d0/37/e2d037c45a81c52a041d81894566b740.jpg',
	'https://i.pinimg.com/1200x/84/ff/9a/84ff9ae67b2dfe79460a391fa37e2b96.jpg',
	'https://i.pinimg.com/736x/a9/68/12/a96812a5e0131ac3cbb77cca0269f95c.jpg',
	'https://i.pinimg.com/1200x/48/c7/45/48c745e113793b266f060189f60d3f4e.jpg',
	'https://i.pinimg.com/736x/67/e3/1a/67e31a45bb768b580d228906f5ebb643.jpg',
]

export const ChangeImage = ({ trigger, options = [], align = 'right' }) => {
	const [selectedChapter, setSelectedChapter] = useState('selective')

	const OPTIONS = [
		{ value: 'selective', label: 'Выбор' },
		{ value: 'upload', label: 'Загрузить' },
	]

	return (
		<Dropdown trigger={trigger} align={align}>
			<div className='flex flex-col gap-2 w-100 bg-[var(--white)] shadow-[var(--shadow)] p-2 rounded-2xl'>
				<RadioGroup
					options={OPTIONS}
					value={selectedChapter}
					onChange={setSelectedChapter}
					style='alt'
					className='flex gap-3'
					wfull
				/>

				<Show when={selectedChapter === 'selective'}>
					<div className='grid grid-cols-3 gap-2 overflow-y-scroll h-60'>
						{COVERS.map((item, idx) => (
							<img
								className='w-full h-full object-cover rounded-xl ring-0 ring-[var(--hero)] hover:scale-102 hover:ring-1 hover:shadow-md transition-all cursor-pointer'
								src={item}
								alt=''
							/>
						))}
					</div>
				</Show>
				<Show when={selectedChapter === 'upload'}>
					<div className='w-full '>
						<PreviewInput onFileChange={file => actions.setImg(file)} />
					</div>
				</Show>
			</div>
		</Dropdown>
	)
}
