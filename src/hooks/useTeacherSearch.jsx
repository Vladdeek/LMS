import { useEffect, useRef, useState } from 'react'
import { fetchTeachersList } from '../api/schedule'

export const useTeacherSearch = () => {
	const [selected, setSelected] = useState(false)
	const [teachers, setTeachers] = useState([])
	const [searchTeachers, setSearchTeachers] = useState('')
	const teachersDebounce = useRef(null)

	useEffect(() => {
		const loadTeachers = async () => {
			try {
				const data = await fetchTeachersList(searchTeachers)
				setTeachers(data)
			} catch (error) {
				console.error(error)
			}
		}

		if (searchTeachers === '') {
			loadTeachers()
			return
		}

		if (teachersDebounce.current) clearTimeout(teachersDebounce.current)
		teachersDebounce.current = setTimeout(loadTeachers, 1500)

		return () => clearTimeout(teachersDebounce.current)
	}, [searchTeachers])

	return { selected, setSelected, teachers, searchTeachers, setSearchTeachers }
}
