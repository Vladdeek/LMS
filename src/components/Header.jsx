import { use, useEffect, useState } from 'react'
import {
	Sun,
	Moon,
	Bell,
	X,
	TriangleAlert,
	OctagonX,
	ThumbsUp,
	GraduationCap,
	ShieldAlert,
	ImageOff,
} from 'lucide-react'
import api, { API } from '../API'
import { NavLink, useNavigate } from 'react-router-dom'
import { Logout } from '../../service/APIs/Authorization'
import { LogOut } from 'lucide-react'

const GradientIcon = ({ Icon, id, palette, size = '125%' }) => (
	<svg width={size} height={size} className='rotate-y-180' viewBox='0 0 24 24'>
		<defs>
			<linearGradient id={id} x1='0%' y1='0%' x2='100%' y2='100%'>
				<stop offset='0%' stopColor={palette.bg} />
				<stop offset='100%' stopColor={palette.description} />
			</linearGradient>
		</defs>

		<Icon stroke={`url(#${id})`} strokeWidth={2} fill='none' />
	</svg>
)

const NotificationCard = ({ key, title, description, type }) => {
	const colors = {
		default: {
			bg: 'var(--white)',
			title: 'var(--black)',
			description: 'var(--middle)',
		},
		bad: {
			bg: 'var(--red-status-bg)',
			title: 'var(--red-status-text)',
			description: 'var(--red-status-middle-text)',
			icon: OctagonX,
		},
		good: {
			bg: 'var(--green-status-bg)',
			title: 'var(--green-status-text)',
			description: 'var(--green-status-middle-text)',
			icon: ThumbsUp,
		},
		middle: {
			bg: 'var(--yellow-status-bg)',
			title: 'var(--yellow-status-text)',
			description: 'var(--yellow-status-middle-text)',
			icon: TriangleAlert,
		},
	}
	const palette = colors[type] || colors.default

	const splitDescription = description.split('\n')

	return (
		<div
			className={`${'bg-[' + palette.bg + ']'} relative overflow-hidden  shadow-[var(--shadow)] rounded-lg px-3 py-2`}
		>
			{palette.icon && (
				<div className='absolute h-full top-0 -right-[2.5%] opacity-25'>
					<GradientIcon
						palette={palette}
						Icon={palette.icon}
						id={`grad-${type}`}
					/>
				</div>
			)}

			<p
				className={`text-lg max-md:text-2xl font-medium ${'text-[' + palette.title + ']'}`}
			>
				{title}
			</p>
			<div className='flex flex-col relative'>
				{splitDescription.map((item, idx) => (
					<p
						key={idx}
						className={`text-base max-md:text-xl gap-1 font-normal ${'text-[' + palette.description + ']'}`}
					>
						{item}
					</p>
				))}
			</div>
		</div>
	)
}

const Notification = () => {
	const [isOpen, setIsOpen] = useState(false)

	const [notifications, setNotifications] = useState([])

	return (
		<div className='relative'>
			<button
				onClick={() => {
					setIsOpen(prev => !prev)
				}}
				className={`relative rounded-xl p-[14px] hover:bg-[var(--hero-epta)] hover:text-white text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer ${
					isOpen && 'bg-[var(--hero-epta)] text-white'
				}`}
			>
				<Bell size={20} />
				{notifications?.length !== 0 && (
					<p
						className={`h-5 w-5 p-1 flex justify-center items-center ring-1 ring-[var(--white)] rounded-full absolute shadow-[var(--shadow)] -top-[6px] -right-[6px] bg-[var(--hero-epta)] text-white ${
							notifications?.length > 9 ? 'text-[9px]' : 'text-[11px]'
						}`}
					>
						<span className='text-center pe-px'>
							{notifications?.length > 9 ? '9+' : notifications?.length}
						</span>
					</p>
				)}
			</button>
			{isOpen && (
				<div className='max-md:hidden absolute bg-[var(--white)] top-14 -right-5 shadow-[var(--shadow)] rounded-2xl p-4 h-fit max-h-150  w-125 z-100 overflow-y-scroll hide-scrollbar'>
					<div className='flex flex-col gap-3'>
						{notifications?.map((item, idx) => (
							<NotificationCard
								key={idx}
								title={item?.title}
								description={item?.description}
								type={item?.notification_type}
							/>
						))}
						{notifications?.length === 0 && (
							<p className='text-center text-[var(--middle)] text-xl py-5'>
								Пусто
							</p>
						)}
					</div>
				</div>
			)}

			<div
				className={`min-md:hidden fixed bg-[var(--white)]  shadow-[var(--shadow)] rounded-b-2xl p-4 h-0 opacity-0  ${isOpen && 'h-[75vh] opacity-100 top-0 '} left-0 -top-100 w-full z-100 transition-all overflow-y-scroll hide-scrollbar`}
			>
				<div className='flex flex-col gap-3 relative'>
					<p className='text-center text-2xl font-medium'>Уведомления</p>
					<X
						size={32}
						className='absolute right-0 top-0'
						onClick={() => setIsOpen(false)}
					/>
					{notifications?.map((item, idx) => (
						<NotificationCard
							key={idx}
							title={item?.title}
							description={item?.description}
							type={item?.notification_type}
						/>
					))}
					{notifications?.length === 0 && (
						<p className='text-center text-[var(--middle)] text-xl py-5'>
							Пусто
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

const ToggleTheme = () => {
	const [isLight, setIsLight] = useState(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			return savedTheme === 'light'
		}
		return document.documentElement.dataset.theme === 'light'
	})

	useEffect(() => {
		const theme = isLight ? 'light' : 'dark'
		document.documentElement.dataset.theme = theme
		localStorage.setItem('theme', theme)
	}, [isLight])

	const toggleTheme = () => {
		setIsLight(prev => !prev)
	}

	return (
		<button
			onClick={toggleTheme}
			className={`relative rounded-xl p-[14px] hover:bg-[var(--hero-epta)] hover:text-white text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer `}
		>
			{!isLight ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	)
}

const HeaderLink = ({ title, icon: Icon, to, not_clickable = false }) => {
	const clearError = () => {
		setGlobalError(null)
	}

	return (
		<NavLink
			to={!not_clickable && to}
			onClick={!not_clickable && clearError}
			className={({ isActive }) =>
				`inline-flex justify-center items-center gap-2 rounded-xl px-4 pb-3 pt-2 cursor-pointer shadow-[var(--shadow)] text-[var(--black)] transition-all select-none ${
					not_clickable
						? 'bg-[var(--light-middle)] text-[var(--middle)] opacity-75'
						: `${
								!isActive
									? 'bg-[var(--white)]'
									: 'bg-[var(--hero-epta)] text-white'
							}`
				} `
			}
		>
			{({ isActive }) => (
				<>
					<Icon size={24} />
					<p
						className={`font-medium text-base whitespace-nowrap transition-all pt-1 ${
							not_clickable
								? 'text-[var(--middle)]'
								: ` ${isActive ? 'text-white' : 'hover:text-[var(--black)]'}`
						} `}
					>
						{title}
					</p>
				</>
			)}
		</NavLink>
	)
}

export const Header = ({ links = [], userInfo }) => {
	const navigate = useNavigate()
	const handleLogout = async e => {
		try {
			const res = await Logout()
		} catch (err) {
		} finally {
			navigate('/authorization')
		}
	}
	return (
		<div className='relative'>
			<div className='flex justify-between items-center fixed w-full py-2 px-6 bg-[var(--white)] shadow-lg z-100 left-0'>
				<div className='flex items-center gap-5'>
					{links?.map((item, index) => (
						<HeaderLink
							key={index}
							title={item.title}
							icon={item.icon}
							to={item.to}
							not_clickable={item.not_clickable}
						/>
					))}
				</div>

				<div className='flex items-center gap-3'>
					<ToggleTheme />
					<div
						className={`
								flex items-center gap-4 py-2 pl-4 pr-2 shadow-[var(--shadow)] rounded-xl transition-all relative
							`}
					>
						<div className='flex flex-col items-end'>
							<p
								className={`text-sm min-[406px]:text-base font-medium whitespace-nowrap text-end leading-5 text-[var(--black)] `}
							>
								{userInfo?.length !== 0
									? `${userInfo?.first_name} ${userInfo?.last_name[0]}. ${userInfo?.patronymic[0]}.`
									: 'Загрузка...'}
							</p>
							<div
								onClick={() => handleLogout()}
								className='flex items-center gap-2 text-[var(--middle)] active:scale-97 hover:text-red-500 transition-all cursor-pointer '
							>
								<p className={`font-normal text-xs min-[406px]:text-base pt-1`}>
									Выйти
								</p>
								<LogOut strokeWidth={2} size={20} />
							</div>
						</div>
						{userInfo?.avatar_url ? (
							<img
								className='h-12 rounded-md object-cover aspect-square'
								src={userInfo?.avatar_url}
								alt=''
							/>
						) : (
							<ImageOff className='h-12 rounded-md object-cover aspect-square w-auto p-3 text-[var(--middle)] bg-[var(--light-middle)]' />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
