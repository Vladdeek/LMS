import { useState, useEffect } from 'react'
import {
	createWebinar,
	getUnlinkedGroups,
	updateWebinarAccess,
} from '../api/Webinars'

export const useCreateWebinarForm = ({
	isOpen,
	onClose,
	onCreate,
	takeinfo,
	editmode,
}) => {
	const [editMode, setEditMode] = useState(false)

	// Поля формы
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
	const [stime, setSTime] = useState('')
	const [etime, setETime] = useState('')
	const [img, setImg] = useState(null)

	// Доступ и Группы
	const [selectedAccess, setSelectedAccess] = useState(1)
	const [searchGroups, setSearchGroups] = useState('')
	const [linkedGroups, setLinkedGroups] = useState([])
	const [unlinkedGroups, setUnlinkedGroups] = useState({ items: [], pages: 1 })
	const [page, setPage] = useState(1)
	const [isLoading, setIsLoading] = useState(false)

	// Валидация
	const isFormValid = title.trim() !== '' && url.trim() !== ''
	const isStartDTValid = Boolean(stime)
	const isAccessValid =
		selectedAccess === 1 || (selectedAccess === 2 && linkedGroups.length > 0)

	const isSubmitDisabled = editMode
		? false
		: !(isFormValid && isStartDTValid && isAccessValid)

	const resetForm = () => {
		setTitle('')
		setUrl('')
		setDate(new Date().toISOString().slice(0, 10))
		setSTime('')
		setETime('')
		setLinkedGroups([])
		setImg(null)
		setSearchGroups('')
		setPage(1)
	}

	// Инициализация данных при открытии / изменении режимов
	useEffect(() => {
		if (isOpen) {
			if (editmode && takeinfo) {
				setEditMode(true)
				setTitle(takeinfo.name || '')
				setUrl(takeinfo.link_url || '')
				setLinkedGroups(takeinfo.linked_groups || [])
				setSelectedAccess(takeinfo.webinar_access === 'restricted' ? 2 : 1)
			} else {
				setEditMode(false)
				resetForm()
			}
		}
	}, [editmode, takeinfo, isOpen])

	// Авто-загрузка непривязанных групп при поиске / смене страницы
	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				fetchUnlinkedGroups(searchGroups)
			}, 500)
			return () => clearTimeout(timer)
		}
	}, [searchGroups, page, isOpen])

	const fetchUnlinkedGroups = async (term = '') => {
		setIsLoading(true)
		try {
			const data = await getUnlinkedGroups({
				webinarId: takeinfo?.id,
				page,
				size: 25,
				term,
			})
			setUnlinkedGroups(data)
		} catch (e) {
			console.error('Ошибка при загрузке групп:', e)
		} finally {
			setIsLoading(false)
		}
	}

	// Логика перекидывания групп между списками
	const handleAddGroup = id => {
		const group = unlinkedGroups?.items?.find(g => g.id === id)
		if (!group) return
		setLinkedGroups(prev => [...prev, group])
		setUnlinkedGroups(prev => ({
			...prev,
			items: prev.items.filter(g => g.id !== id),
		}))
	}

	const handleRemoveGroup = id => {
		const group = linkedGroups.find(g => g.id === id)
		if (!group) return
		setLinkedGroups(prev => prev.filter(g => g.id !== id))
		setUnlinkedGroups(prev => ({
			...prev,
			items: [...prev.items, group],
		}))
	}

	// Сборка FormData для API
	const buildFormData = () => {
		const formData = new FormData()
		formData.append('name', title)
		formData.append('link_url', url)

		const startISO =
			new Date(`${date}T${stime}:00Z`).toISOString().slice(0, 19) + 'Z'
		formData.append('start_date', startISO)

		const enddate = new Date(`${date}T${etime || stime}:00Z`)
		if (!etime) enddate.setHours(enddate.getHours() + 1)
		formData.append('end_date', enddate.toISOString().slice(0, 19) + 'Z')

		const linkedGroupIds = linkedGroups.map(({ id }) => id).join(',')
		formData.append('linked_groups', linkedGroupIds)

		if (img) formData.append('image', img)

		return { formData, linkedGroupIds }
	}

	// Сабмит формы
	const handleSubmit = async e => {
		e.preventDefault()
		const { formData, linkedGroupIds } = buildFormData()

		try {
			let resData
			if (editMode) {
				const accessData = linkedGroupIds ? formData : null
				resData = await updateWebinarAccess(takeinfo.id, accessData)
			} else {
				resData = await createWebinar(formData)
			}

			if (onCreate) onCreate(resData)
			if (onClose) onClose()
			resetForm()
		} catch (error) {
			console.error('Ошибка сервера при сохранении вебинара:', error)
		}
	}

	return {
		state: {
			editMode,
			title,
			url,
			date,
			stime,
			etime,
			selectedAccess,
			searchGroups,
			linkedGroups,
			unlinkedGroups,
			page,
			isLoading,
			isFormValid,
			isStartDTValid,
			isSubmitDisabled,
		},
		actions: {
			setTitle,
			setUrl,
			setDate,
			setSTime,
			setETime,
			setImg,
			setSelectedAccess,
			setSearchGroups,
			setPage,
			handleAddGroup,
			handleRemoveGroup,
			handleSubmit,
		},
	}
}
