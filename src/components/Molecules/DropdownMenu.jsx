import React from 'react'
import { Dropdown } from '../Atoms/Dropdown/Dropdown'
import { DropdownItem } from '../Atoms/Dropdown/DropdownItem'

export const DropdownMenu = ({ trigger, options = [], align = 'right' }) => {
	return (
		<Dropdown trigger={trigger} align={align}>
			{({ close }) => (
				<div className='flex flex-col'>
					{options.map((item, index) => (
						<DropdownItem
							key={index}
							icon={item.icon}
							label={item.label}
							variant={item.variant}
							onClick={() => {
								close()
								item.action?.()
							}}
						/>
					))}
				</div>
			)}
		</Dropdown>
	)
}
