import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { use, useContext, useEffect, useState } from 'react'
import {
	BookText,
	BookUser,
	CalendarDays,
	CopyCheck,
	FileUser,
	GraduationCap,
	ShieldAlert,
} from 'lucide-react'
import { Me } from '../../../service/APIs/Authorization'
import { useUser } from '../../../service/context/UserContext'

export default function DashboardLayout({ onChange }) {
	const location = useLocation()
	const navigate = useNavigate()
	const HeaderLinkInfo = [
		{
			teacher: [
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
				{
					title: 'Расписание',
					icon: CalendarDays,
					to: '/schedule',
				},
				{
					title: 'Задания',
					icon: CopyCheck,
					to: '/students',
					not_clickable: true,
				},
				// {
				// 	title: 'Журнал',
				// 	icon: CopyCheck,
				// 	to: '/score',
				// 	not_clickable: true,
				// },
			],
			student: [
				{
					title: 'Курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
				{
					title: 'Расписание',
					icon: CalendarDays,
					to: '/schedule',
				},

				{
					title: 'Оценки',
					icon: CopyCheck,
					to: '/score',
					not_clickable: true,
				},
			],
			moderator: [
				{
					title: 'Проверка курсов',
					icon: ShieldAlert,
					to: '/moderation',
				},
			],
		},
	]

	const { role } = useUser()

	const links = HeaderLinkInfo[0][role]

	return (
		<>
			<div className='md:mx-10 mx-2 relative'>
				<Header links={links} />
				<Outlet />
			</div>
			{/* <div className='md:hidden'>
				<MobileMenuBar links={HeaderLinkInfo} />
			</div> */}
		</>
	)
}
