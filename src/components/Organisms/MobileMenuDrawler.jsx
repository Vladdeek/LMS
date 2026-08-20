import { X } from 'lucide-react'
import { Drawer } from '../Molecules/Drawler'
import { HeaderButton } from '../Atoms/Buttons/HeaderButton'

export const MobileMenuDrawer = ({ isOpen, onClose, links = [] }) => {
	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<div className='p-5 flex flex-col gap-4 h-full'>
				<div className='flex justify-between items-center pb-3 border-b border-[var(--light-middle)]'>
					<p className='text-xl font-medium text-[var(--black)]'>Меню</p>
					<X
						size={24}
						className='cursor-pointer text-[var(--black)] hover:opacity-75 transition-opacity'
						onClick={onClose}
					/>
				</div>

				<div className='flex flex-col gap-3 mt-2 overflow-y-auto hide-scrollbar'>
					{links?.map((item, index) => (
						<HeaderButton
							key={index}
							title={item.title}
							icon={item.icon}
							to={item.to}
							not_clickable={item.not_clickable}
							onClick={onClose}
						/>
					))}
				</div>
			</div>
		</Drawer>
	)
}
