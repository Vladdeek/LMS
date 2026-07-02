import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { use, useContext, useEffect, useState } from 'react'
import {
	BookText,
	BookUser,
	CopyCheck,
	FileUser,
	GraduationCap,
	ShieldAlert,
} from 'lucide-react'
import { Me } from '../../../service/APIs/Authorization'

export default function DashboardLayout({ onChange }) {
	const location = useLocation()
	const navigate = useNavigate()
	const HeaderLinkInfo = [
		{
			student: [
				{
					title: 'Курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
			],
			teacher: [
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
				{
					title: 'Проверка заданий',
					icon: CopyCheck,
					to: '/checking',
				},
			],
			moderator: [
				{
					title: 'Пользователи',
					icon: BookUser,
					to: '/moderation-users',
				},
				{
					title: 'Курсы',
					icon: BookText,
					to: '/moderation-courses/pending_review',
				},
				{
					title: 'Заявки',
					icon: FileUser,
					to: '/acceptance-of-applications',
				},
			],
		},
	]

	const [userInfo, setUserInfo] = useState([])

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setUserInfo(res)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	const links = HeaderLinkInfo[0][userInfo?.role]

	return (
		<>
			<div className='md:mx-10 mx-2 relative'>
				<Header links={links} userInfo={userInfo} />
				<Outlet />
			</div>
			{/* <div className='md:hidden'>
				<MobileMenuBar links={HeaderLinkInfo} />
			</div> */}
		</>
	)
}
