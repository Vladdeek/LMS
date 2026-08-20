import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Me } from '../api/Authorization'
import { toast } from 'sonner'

//сам контекст
const UserContext = createContext()

//Провайдер
export const UserProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null)
	const [role, setRole] = useState(null)
	const [loadingUserInfo, setLoadingUserInfo] = useState(false)
	const location = useLocation()

	useEffect(() => {
		setLoadingUserInfo(true)
		const getUserInfo = async () => {
			try {
				const res = await Me()
				setUserInfo(res)
				setRole(res.current_user_role)
			} catch (err) {
				console.log(err)
				// toast.error(err)
			} finally {
				setLoadingUserInfo(false)
			}
		}

		location.pathname !== '/authorization' && getUserInfo()
	}, [location.pathname])

	return (
		// Прокидываем и данные, и текущую роль, и функцию её смены
		<UserContext.Provider value={{ userInfo, role, loadingUserInfo }}>
			{children}
		</UserContext.Provider>
	)
}

//хук
export const useUser = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error('useUser нужно использовать внутри UserProvider')
	}
	return context
}
