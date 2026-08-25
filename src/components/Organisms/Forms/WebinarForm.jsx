import React, { useState, useEffect } from 'react'
import { Calendar, Video, Users, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '../../Molecules/InputFields/Input'
import { DateInput } from '../../Molecules/InputFields/DateInput'
import { HintTooltip } from '../../Atoms/HintTooltip'
import { Text } from '../../Atoms/Text'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { AltPreviewInput } from '../../Molecules/InputFields/AltPreviewInput'
import { useCreateWebinarForm } from '../../../hooks/useCreateWebinarForm'
import { SelectGroupsModal } from '../Modals/SelectGroupModal'

export const WebinarForm = props => {
	const { isOpen } = props
	const { state, actions } = useCreateWebinarForm(props)
	const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

	// Автосинхронизация типа доступа для бекенда/стейта
	useEffect(() => {
		if (state.linkedGroups.length === 0) {
			actions.setSelectedAccess(1) // Доступно всем
		} else {
			actions.setSelectedAccess(2) // Ограниченный доступ
		}
	}, [state.linkedGroups.length])

	if (!isOpen) return null

	return (
		<>
			<form
				onSubmit={actions.handleSubmit}
				className='w-full max-w-5xl mx-auto p-2 sm:p-4'
			>
				<div className='space-y-6'>
					<AltPreviewInput />

					{/* ОСНОВНАЯ СЕТКА В 2 КОЛОНКИ */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
						{/* ЛЕВАЯ КОЛОНКА */}
						<section className='space-y-3'>
							<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
								<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
									<Video size={18} />
								</div>
								<h3 className='text-base font-bold text-[var(--black)]'>
									Основная информация
								</h3>
							</div>

							<div className='space-y-3'>
								<Input
									type='text'
									placeholder='Название видео-конференции'
									title={
										state.editMode
											? 'Название видео-конференции'
											: 'Введите название'
									}
									required
									value={state.title}
									onChange={e => actions.setTitle(e.target.value)}
									disabled={state.editMode}
								/>

								<Input
									type='text'
									placeholder='https://example.ru/...'
									title={
										state.editMode
											? 'Ссылка на конференцию'
											: 'Введите ссылку на видео-конференцию'
									}
									required
									value={state.url}
									onChange={e => actions.setUrl(e.target.value)}
								/>
							</div>
						</section>

						{/* ПРАВАЯ КОЛОНКА */}
						<section className='space-y-3'>
							<div className='flex items-center gap-2.5 pb-2 border-b border-[var(--light-middle)]/30'>
								<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
									<Calendar size={18} />
								</div>
								<h3 className='text-base font-bold text-[var(--black)]'>
									Расписание проведения
								</h3>
							</div>

							<div className='space-y-3'>
								<DateInput
									title='Дата проведения вебинара'
									required
									value={state.date}
									onChange={actions.setDate}
								/>

								<div className='grid grid-cols-2 gap-3 items-end'>
									<Input
										type='time'
										title='Время начала'
										required
										value={state.stime}
										onChange={e => actions.setSTime(e.target.value)}
									/>

									<div className='flex flex-col w-full'>
										<div className='inline-flex items-center gap-1.5 mb-2'>
											<Text size={'sm'} style={'secondary'}>
												Время окончания
											</Text>
											<HintTooltip>
												<Text>
													Если не выставить время окончания, время по умолчанию
													устанавливается на 1 час позже.
												</Text>
											</HintTooltip>
										</div>
										<Input
											type='time'
											value={state.etime}
											onChange={e => actions.setETime(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</section>
					</div>

					{/* СЕКЦИЯ ДОСТУПА И ГРУПП */}
					<section className='flex flex-col w-full pt-2 border-t border-[var(--light-middle)]/30'>
						<div className='flex w-full items-center justify-between pb-2 border-b border-[var(--light-middle)]/30'>
							<div className='flex items-center gap-2.5'>
								<div className='p-1.5 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
									<Users size={18} />
								</div>
								<h3 className='text-base font-bold text-[var(--black)]'>
									Настройки доступа
								</h3>
							</div>

							<HintTooltip>
								<Text>
									Если ни одна группа не выбрана, вебинар будет автоматически
									доступен всем пользователям.
								</Text>
							</HintTooltip>
						</div>

						{/* КНОПКА ВЫБОРА ГРУПП */}
						<SubmitButton
							onClick={() => setIsGroupModalOpen(true)}
							className={'flex gap-3 items-center justify-center'}
						>
							<Plus size={18} />
							<span>Выбрать группы для доступа</span>
						</SubmitButton>

						{/* СПИСОК ВЫБРАННЫХ ГРУПП */}
						{state.linkedGroups.length > 0 ? (
							<div className='space-y-2 pt-1'>
								<p className='text-[11px] font-semibold text-[var(--middle)] uppercase tracking-wider'>
									Выбранные группы ({state.linkedGroups.length})
								</p>
								<div className='flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1'>
									{state.linkedGroups.map((item, i) => (
										<motion.div
											key={item.id}
											initial={{ scale: 0.95, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ duration: 0.15, delay: i * 0.02 }}
										>
											<div
												onClick={() => actions.handleRemoveGroup(item.id)}
												className='bg-[var(--transparent-hero)] text-[var(--hero)] border border-[var(--hero)]/20 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center gap-2 text-xs font-medium group'
											>
												<span className='truncate max-w-[180px]'>
													{item.name}
												</span>
												<span className='opacity-60 group-hover:opacity-100 text-[11px]'>
													✕
												</span>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						) : (
							<p className='text-xs text-[var(--middle)] text-center italic pt-1'>
								Группы не ограничены — доступ открыт для всех.
							</p>
						)}
					</section>

					{/* КНОПКА САБМИТА */}
					<div className='flex justify-end pt-4 border-t border-[var(--light-middle)]/30'>
						<SubmitButton
							className='w-full sm:w-auto px-6 py-2.5'
							disabled={state.isSubmitDisabled}
						>
							<Text size={'md'} font={'semibold'}>
								{state.editMode
									? 'Сохранить изменения'
									: 'Создать видео-конференцию'}
							</Text>
						</SubmitButton>
					</div>
				</div>
			</form>

			{/* МОДАЛЬНОЕ ОКНО ВЫБОРА ГРУПП */}
			<SelectGroupsModal
				isOpen={isGroupModalOpen}
				onClose={() => setIsGroupModalOpen(false)}
				unlinkedGroups={state.unlinkedGroups}
				searchGroups={state.searchGroups}
				onSearchChange={actions.setSearchGroups}
				page={state.page}
				onPageChange={actions.setPage}
				onAddGroup={actions.handleAddGroup}
			/>
		</>
	)
}
