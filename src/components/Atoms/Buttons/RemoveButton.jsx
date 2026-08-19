export const RemoveButton = ({ onDelete }) => {
	return (
		<button
			onClick={onDelete}
			className='self-start p-2 bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer '
		>
			<X size={20} />
		</button>
	)
}
