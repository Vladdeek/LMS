import React from 'react'
import { motion } from 'framer-motion'
import { RadioGroup } from '../../../Molecules/RadioGroup'
import { Input } from '../../../Molecules/InputFields/Input'
import BasicPagination from '../../../Pagination'

export const StepThreeAccess = ({
	accessOptions,
	selectedAccess,
	setSelectedAccess,
	linkedGroups,
	handleRemoveGroup,
	unlinkedGroups,
	handleAddGroup,
	searchGroups,
	setSearchGroups,
	page,
	setPage,
	isSubmitDisabled,
	editMode,
}) => {
	return (
		<div className='sm:w-[482px] w-full inline-flex flex-col items-center gap-5'>
			{/* Выбор уровня доступа через новый RadioGroup */}
			<RadioGroup
				options={accessOptions}
				value={selectedAccess}
				onChange={setSelectedAccess}
				wfull
				sizeButton='md'
				className='flex gap-3 w-full justify-center'
			/>

			{/* Выбранные/привязанные группы */}
			{linkedGroups.length > 0 && (
				<div className='grid grid-cols-3 gap-3 w-full'>
					<p className='col-span-3 text-center font-medium'>
						Привязанные группы к видео-конференции
					</p>
					{linkedGroups.map((item, i) => (
						<motion.div
							key={item.id}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
						>
							<div
								onClick={() => handleRemoveGroup(item.id)}
								className='bg-[var(--hero)] rounded-md shadow-[var(--shadow)] px-4 py-2 cursor-pointer hover:scale-101 transition-all flex justify-between text-white font-medium'
							>
								{item.name}
							</div>
						</motion.div>
					))}
				</div>
			)}

			{/* Поиск и доступные группы */}
			<div
				className={`relative bg-[var(--light-middle)] rounded-lg shadow-inner p-2 pr-2.75 overflow-y-scroll flex flex-col gap-2 w-full h-[39.5vh] transition-all ${
					selectedAccess === 1 ? 'opacity-50 pointer-events-none' : ''
				}`}
			>
				<Input
					type='text'
					placeholder='Поиск групп...'
					value={searchGroups}
					onChange={e => setSearchGroups(e.target.value)}
				/>

				{unlinkedGroups?.items?.map((item, i) => (
					<motion.div
						key={item.id}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.3, delay: i * 0.05 }}
					>
						<div
							onClick={() => handleAddGroup(item.id)}
							className='bg-[var(--white)] rounded-md shadow-[var(--shadow)] px-4 py-2 cursor-pointer hover:scale-101 transition-all flex flex-col text-[var(--black)] font-medium'
						>
							{item.name}
						</div>
					</motion.div>
				))}

				<div className='absolute bottom-2 bg-[var(--white)] flex w-[96%] rounded-lg shadow-[var(--shadow)] justify-center p-1'>
					<BasicPagination
						count={unlinkedGroups?.pages || 1}
						page={page}
						onPageChange={setPage}
						siblingCount={2}
					/>
				</div>
			</div>

			{/* Кнопка отправки формы */}
			<input
				className={`px-[51px] py-[14.5px] font-medium text-md sm:text-xl rounded-lg w-fit transition-all ${
					isSubmitDisabled
						? 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
						: 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
				}`}
				type='submit'
				value={editMode ? 'Сохранить изменения' : 'Создать видео-конференцию'}
				disabled={isSubmitDisabled}
			/>
		</div>
	)
}
