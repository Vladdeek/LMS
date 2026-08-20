import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
import { Header } from '../../components/Organisms/Header'
import { useUser } from '../../context/UserContext'
import { HEADER_CONFIG } from '../../Constants/headerConfig'

export default function DashboardLayout({ onChange }) {
	const location = useLocation()
	const navigate = useNavigate()
	const { role } = useUser()

	const links = HEADER_CONFIG[0][role]

	return (
		<>
			<div className='md:mx-10 mx-2 relative'>
				<Header links={links} />
				<Outlet />
			</div>
			{/* <div className='md:hidden'>
				<MobileMenuBar links={HeaderButtonInfo} />
			</div> */}
		</>
	)
}
