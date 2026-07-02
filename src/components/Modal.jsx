import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useLockBodyScroll } from '../../service/Hooks/useLockBodyScroll'

const Modal = ({ isOpen, onClose, children, width }) => {
	useLockBodyScroll(isOpen)

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div
			className='bg-[#00000050] fixed top-0 z-100 left-0 right-0 bottom-0 flex justify-center items-center'
			onClick={onClose}
		>
			<div
				className={`bg-[var(--white)] ${width} p-5 relative rounded-3xl text-[var(--black)]`}
				onClick={e => e.stopPropagation()}
			>
				{onClose && (
					<X
						className='text-[var(--black)] absolute top-2 right-2 hover:scale-115 cursor-pointer transition-all z-10'
						onClick={onClose}
					/>
				)}

				{children}
			</div>
		</div>,
		document.body,
	)
}

export default Modal
