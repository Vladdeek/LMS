import { BookOpen, Calendar, ShieldAlert, Tag, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TextStroke } from '../../Atoms/TextStroke'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'

export const CourseForm = ({ courseId, onChange }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	// Инициализируем пустым объектом, чтобы не падали проверки типа courseInfo.id
	const [courseInfo, setCourseInfo] = useState({})

	useEffect(() => {
		const getCourse = async () => {
			try {
				const res = await GetCourseInfoById(courseId)
				setCourseInfo(res)
			} catch (err) {
				console.error('Ошибка при загрузке курса:', err)
			}
		}
		if (courseId) getCourse()
	}, [])

	const accessCourse = async status => {
		try {
			const res = await AccessCourse(courseId, status)
			setIsModalOpen(false)
			onChange?.()
		} catch (err) {}
	}

	return (
		<>
			{/* Модальное окно: Допуск */}
			<div className='mx-40'>
				<div className='grid grid-cols-12 gap-10'>
					{/* ЛЕВАЯ КОЛОНКА: Виджет курса и Создатель */}
					<div className='col-span-12 lg:col-span-4 flex flex-col space-y-6 border-r border-[var(--light-middle)]/30 pr-6'>
						<div className='relative group h-64 w-full rounded-3xl overflow-hidden ring-5 ring-[var(--white)] shadow-[var(--shadow)] bg-[var(--light-gray)]/50'>
							{courseInfo.preview_url ? (
								<img
									src={courseInfo.preview_url}
									alt='Preview'
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
									<BookOpen size={48} />
								</div>
							)}
							<div className='absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-[var(--hero)] shadow-sm'>
								ID: {courseInfo.id?.slice(0, 8)}...
							</div>
						</div>

						<div className='space-y-4 border-t border-[var(--light-middle)]/30 pt-5'>
							<div className='flex items-center gap-3 p-3 bg-[var(--white)] shadow-[var(--shadow)] rounded-2xl'>
								<div className='w-12 h-12 rounded-lg ring-4 ring-[var(--white)] shadow-[var(--shadow)] overflow-hidden shrink-0'>
									{courseInfo.creator?.avatar_url ? (
										<img
											src={courseInfo.creator.avatar_url}
											alt='Avatar'
											className='w-full h-full object-cover'
										/>
									) : (
										<User className='p-2 bg-[var(--light-gray)]/50 text-[var(--middle)] w-full h-full' />
									)}
								</div>
								<div className='overflow-hidden'>
									<p className='text-xs text-[var(--middle)]'>
										Создатель курса
									</p>
									<p className='text-sm font-semibold truncate text-[var(--black)]'>
										{courseInfo.creator?.last_name}{' '}
										{courseInfo.creator?.first_name}{' '}
										{courseInfo.creator?.patronymic}
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2 px-3 py-2 bg-[var(--transparent-hero)] text-[var(--hero)] rounded-xl w-fit text-sm font-medium'>
								<Tag size={14} />
								{courseInfo.tag || 'Без тега'}
							</div>
						</div>
					</div>

					{/* ПРАВАЯ КОЛОНКА: Использование компонента TextStroke */}
					<div className='col-span-12 lg:col-span-8 flex flex-col space-y-8'>
						{/* Блок 1: Основное */}
						<section className='space-y-5'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
									<BookOpen size={20} />
								</div>
								<h3 className='text-lg font-bold text-[var(--black)]'>
									Основная информация
								</h3>
							</div>

							<TextStroke title='Название курса' value={courseInfo.name} />
							<TextStroke
								title='Описание'
								value={courseInfo.description}
								textarea
							/>
						</section>

						{/* Блок 2: Даты */}
						<section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-4'>
								<div className='flex items-center gap-2 text-[var(--hero)] font-medium text-sm uppercase tracking-wider mb-1'>
									<Calendar size={16} /> Регистрация
								</div>
								<TextStroke
									title='Начало'
									value={courseInfo.registration_start?.split('T')[0]}
								/>
								<TextStroke
									title='Конец'
									value={courseInfo.registration_end?.split('T')[0]}
								/>
							</div>

							<div className='space-y-4'>
								<div className='flex items-center gap-2 text-[var(--hero)] font-medium text-sm uppercase tracking-wider mb-1'>
									<Calendar size={16} /> Обучение
								</div>
								<TextStroke
									title='Дата старта'
									value={courseInfo.start_date?.split('T')[0]}
								/>
								<TextStroke
									title='Дата завершения'
									value={courseInfo.end_date?.split('T')[0]}
								/>
							</div>
						</section>

						{/* Блок 3: Стоимость и Доп. информация */}
						<section className='grid grid-cols-1 md:grid-cols-3 gap-6 items-end'>
							<div className='md:col-span-2 flex flex-col gap-4 w-full'>
								<TextStroke
									title='Формат обучения'
									value={courseInfo.format_name}
								/>
								<TextStroke
									title='Тип сертификата'
									value={courseInfo.certificate_type_name}
								/>
							</div>
							<div className='flex flex-col gap-1 w-full'>
								<span className='flex items-center gap-2 text-sm font-medium text-[var(--middle)] mb-1 select-none'>
									<CreditCard size={16} /> Цена
								</span>
								<TextStroke
									value={
										courseInfo.is_free
											? 'Бесплатно'
											: `${courseInfo.price || 0} ₽`
									}
								/>
							</div>
						</section>

						{/* Кнопка действия */}
						<div className='flex justify-end pt-4'>
							<SubmitButton
								className='w-full md:w-auto px-8 py-4'
								onClick={() => setIsModalOpen(true)}
							>
								<div className='flex items-center gap-3'>
									<ShieldAlert size={18} strokeWidth={3} />
									Допустить к редактированию
								</div>
							</SubmitButton>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
