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
	ChevronRight,
	RefreshCw,
	ChevronDown,
	Menu, // Добавлена иконка бургера
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { Loading } from '../Atoms/Loaders/Loading'
import { Text } from '../Atoms/Text'
import { DropdownMenu } from '../Molecules/DropdownMenu'
import { SelectRoleModal } from './Modals/ChangeRoleModal'
import { BurgerButton } from '../Atoms/Buttons/BurgerButton'
import { MobileMenuDrawer } from './MobileMenuDrawler'
import { HeaderButton } from '../Atoms/Buttons/HeaderButton'
import { Logout } from '../../api/Authorization'
import { toast } from 'sonner'
import { MEDIA_API_URL } from '../../API'

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
			className={`${'bg-[' + palette.bg + ']'} relative overflow-hidden shadow-[var(--shadow)] rounded-lg px-3 py-2`}
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
				onClick={() => setIsOpen(prev => !prev)}
				className={`relative rounded-xl p-[14px] hover:bg-[var(--hero)] hover:text-white text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer ${
					isOpen && 'bg-[var(--hero)] text-white'
				}`}
			>
				<Bell size={20} />
				{notifications?.length !== 0 && (
					<p
						className={`h-5 w-5 p-1 flex justify-center items-center ring-1 ring-[var(--white)] rounded-full absolute shadow-[var(--shadow)] -top-[6px] -right-[6px] bg-[var(--hero)] text-white ${
							notifications?.length > 9 ? 'text-[9px]' : 'text-[11px]'
						}`}
					>
						<span className='text-center pe-px'>
							{notifications?.length > 9 ? '9+' : notifications?.length}
						</span>
					</p>
				)}
			</button>

			{/* Десктопные уведомления */}
			{isOpen && (
				<div className='max-md:hidden absolute bg-[var(--white)] top-14 -right-5 shadow-[var(--shadow)] rounded-2xl p-4 h-fit max-h-150 w-125 z-100 overflow-y-scroll hide-scrollbar'>
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

			{/* Мобильные уведомления */}
			<div
				className={`md:hidden fixed bg-[var(--white)] shadow-[var(--shadow)] rounded-b-2xl p-4 h-0 opacity-0 ${
					isOpen && 'h-[75vh] opacity-100 top-0'
				} left-0 -top-100 w-full z-100 transition-all overflow-y-scroll hide-scrollbar`}
			>
				<div className='flex flex-col gap-3 relative'>
					<p className='text-center text-2xl font-medium'>Уведомления</p>
					<X
						size={32}
						className='absolute right-0 top-0 cursor-pointer'
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
			className='relative rounded-xl p-[14px] hover:bg-[var(--hero)] hover:text-white text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer'
		>
			{!isLight ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	)
}

const ROLES_CONFIG = {
	moderator: 'Модератор',
	teacher: 'Преподаватель',
	student: 'Студент',
}

export const Header = ({ links = [], onChangeRole }) => {
	const navigate = useNavigate()
	const { userInfo, loadingUserInfo } = useUser()

	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const handleLogout = async () => {
		try {
			await Logout()
			navigate('/authorization')
		} catch (err) {
			console.error('Logout error:', err)
			toast.error('Ошибка при выходе из аккаунта.')
		}
	}

	const menuOptions = [
		{
			label: 'Сменить роль',
			icon: RefreshCw,
			action: () => setIsRoleModalOpen(true),
			variant: 'default',
		},
		{
			label: 'Выйти',
			icon: LogOut,
			action: handleLogout,
			variant: 'danger',
		},
	]

	const firstName = userInfo?.personal_data?.first_name || ''
	const lastNameInitial = userInfo?.personal_data?.last_name?.[0]
		? `${userInfo.personal_data.last_name[0]}.`
		: ''
	const middleNameInitial = userInfo?.personal_data?.middle_name?.[0]
		? `${userInfo.personal_data.middle_name[0]}.`
		: ''
	const userRole = ROLES_CONFIG[userInfo?.current_user_role] || ''

	return (
		<>
			<SelectRoleModal
				isOpen={isRoleModalOpen}
				onClose={() => setIsRoleModalOpen(false)}
			/>

			<div className='flex justify-between items-center fixed w-full py-2 px-4 md:px-6 bg-[var(--white)] shadow-lg z-100 left-0 top-0'>
				{/* Левая часть: Кнопка бургера (для мобилок) и Десктоп Навигация */}
				<div className='flex items-center gap-3'>
					<BurgerButton
						onClick={() => setIsMobileMenuOpen(prev => !prev)}
						active={isMobileMenuOpen}
					/>

					{/* Десктопное меню навигации */}
					<div className='hidden lg:flex items-center gap-5'>
						{links?.map((item, index) => (
							<HeaderButton
								key={index}
								title={item.title}
								icon={item.icon}
								to={item.to}
								not_clickable={item.not_clickable}
							/>
						))}
					</div>
				</div>

				{/* Правая часть: Переключатели и Профиль */}
				<div className='flex items-center gap-2 md:gap-3'>
					<ToggleTheme />

					<DropdownMenu
						options={menuOptions}
						trigger={isOpen => (
							<div className='flex items-center py-2 px-2 md:pl-4 md:pr-2 shadow-[var(--shadow)] rounded-xl transition-all hover:opacity-90 bg-transparent cursor-pointer'>
								<div className='hidden sm:flex flex-col items-end mr-2'>
									<Text
										size={'sm'}
										font={'medium'}
										style={'primary'}
										className='whitespace-nowrap text-end leading-5 min-[406px]:text-base'
									>
										{loadingUserInfo ? (
											<Loading />
										) : (
											`${firstName} ${lastNameInitial} ${middleNameInitial}`.trim()
										)}
									</Text>

									<Text
										size={'sm'}
										font={'light'}
										style={'secondary'}
										className='whitespace-nowrap text-end leading-5 min-[406px]:text-base'
									>
										{loadingUserInfo ? <Loading /> : userRole}
									</Text>
								</div>

								{userInfo?.avatar_url ? (
									<img
										className='h-10 w-10 md:h-12 md:w-12 rounded-md object-cover aspect-square'
										src={MEDIA_API_URL + userInfo?.avatar_url}
										alt='Avatar'
									/>
								) : (
									<ImageOff className='h-10 w-10 md:h-12 md:w-12 rounded-md object-cover aspect-square p-2 md:p-3 text-[var(--middle)] bg-[var(--light-middle)]' />
								)}

								<ChevronDown
									className={`ml-1 transition-transform duration-200 ${
										isOpen ? 'rotate-180' : ''
									}`}
								/>
							</div>
						)}
					/>
				</div>
			</div>

			{/* Мобильная шторка со списком навигации (Drawer) */}
			<MobileMenuDrawer
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
				links={links}
				HeaderButtonComponent={HeaderButton}
			/>
		</>
	)
}
