import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
	const [isAuth, setIsAuth] = useState(true)
	return isAuth ? (
		<Outlet /> // рендер вложенных маршрутов
	) : (
		<Navigate to='/auth' replace />
	)
}
