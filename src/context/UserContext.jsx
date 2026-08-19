import React, { createContext, useContext, useState, useEffect } from 'react'
import { Me } from '../APIs/Authorization'
import { useLocation } from 'react-router-dom'

//сам контекст
const UserContext = createContext()

//Провайдер
export const UserProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null)
	const [role, setRole] = useState(null)
	const location = useLocation()

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await Me()
				setUserInfo(res)
				setRole(res.role)
			} catch (err) {
				console.error('Ошибка загрузки:', err)
			}
		}

		location.pathname !== '/authorization' && getUserInfo()
	}, [location.pathname])

	return (
		// Прокидываем и данные, и текущую роль, и функцию её смены
		<UserContext.Provider value={{ userInfo, role }}>
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
