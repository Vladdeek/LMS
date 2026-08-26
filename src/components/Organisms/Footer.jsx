import { MessageCircleQuestionMark } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const FooterLink = ({ to, title, index }) => {
	return (
		<NavLink
			to={to}
			className={`group text-base max-lg:text-sm max-[913px]:text-xs w-fit ${
				index === 0
					? 'font-medium text-[var(--black)]'
					: index > 0 && index < 10
						? 'font-normal text-[var(--middle)]'
						: index === 10 && 'font-normal text-[var(--black)]'
			}`}
		>
			<p className='text-end'>
				{title.split('\n').map((line, i) => (
					<React.Fragment key={i}>
						{line}
						<br />
					</React.Fragment>
				))}
			</p>
			<div
				className={`${
					index === 0
						? 'bg-[var(--black)]'
						: index > 0 && index < 10
							? 'bg-[var(--middle)]'
							: index === 10 && 'bg-[var(--black)]'
				} h-[1px] w-0 group-hover:w-full transition-all`}
			></div>
		</NavLink>
	)
}

const AltFooterLink = ({ to, title, index }) => {
	const isTitle = index === 0
	const isLast = index === 10

	const textColor =
		isTitle || isLast
			? 'text-[var(--black)] font-medium'
			: 'text-[var(--middle)]'
	const lineColor =
		isTitle || isLast ? 'bg-[var(--black)]' : 'bg-[var(--middle)]'

	return (
		<a
			href={to}
			target='_blank'
			rel='noopener noreferrer'
			className={`group inline-block cursor-pointer pointer-events-auto ${textColor}`}
		>
			<p className='text-end'>
				{title.split('\n').map((line, i) => (
					<React.Fragment key={i}>
						{line}
						<br />
					</React.Fragment>
				))}
			</p>

			<div
				className={`${lineColor} h-[1px] w-0 group-hover:w-full transition-all`}
			/>
		</a>
	)
}

const Footer = () => {
	const FooterLinks = [
		[
			{ title: 'Каталог', to: '/catalogs' },
			{ title: 'Добавление курса', to: '/catalogs/courses' },
			{ title: 'Видео-конференции', to: '/catalogs/webinars' },
		],
		[
			{ title: 'Проверка заданий', to: '/' },
			{ title: 'Журнал оценок', to: '/' },
			{ title: 'Успеваемость студентов', to: '/' },
		],
		[
			{ title: 'Университет', to: '/' },
			{ title: 'Студенту', to: '/' },
			{ title: 'Сотруднику', to: '/' },
		],
	]

	const teh = 'Техническая поддержка'
	return (
		<footer className='bg-[var(--white)] w-full mt-auto p-4'>
			<div className=' grid grid-cols-[1fr_3fr]  gap-5  w-full border-b-1 border-[var(--middle)] mb-3 pb-3'>
				<div className='flex flex-col gap-5'>
					<p className='uppercase text-4xl max-xl:text-2xl font-bold text-[var(--black)]'>
						МелГУ СДО
					</p>
					<p className='text-sm max-xl:text-xs font-normal text-[var(--middle)]'>
						Учись, общайся и достигай целей без границ. Доступ к лекциям,
						расписанию и заданиям — всегда под рукой.
					</p>
				</div>
				<div className='flex justify-between'>
					{FooterLinks.map((column, colIndex) => (
						<div key={colIndex} className='flex flex-col gap-4'>
							{column.map((link, linkIndex) => (
								<FooterLink key={linkIndex} {...link} index={linkIndex} />
							))}
						</div>
					))}

					<div className='flex flex-col gap-4 items-end max-xl:hidden'>
						<a
							href='https://t.me/VersaCRM_bot?start=1'
							target='_blank'
							rel='noopener noreferrer'
							className='p-3 w-fit rounded-lg bg-[var(--hero)] text-white'
						>
							<MessageCircleQuestionMark size={24} />
						</a>
						<AltFooterLink
							title={`Техническая \n поддержка`}
							index={1}
							to={'https://t.me/VersaCRM_bot?start=1'}
						/>
						<p className='text-end text-base font-normal text-[var(--middle)]'></p>
					</div>
				</div>
			</div>
			<div className='flex justify-between items-center'>
				<div className='flex gap-5'>
					<p className='font-medium text-[var(--black)]'>МелГУ СДО</p>
					<FooterLink title={`Все права защищены`} index={10} />
				</div>
				<div className='flex gap-5 max-xl:flex-row-reverse items-center'>
					<FooterLink title={`Политика конфиденциальности`} index={10} />
				</div>
			</div>
		</footer>
	)
}
export default Footer
