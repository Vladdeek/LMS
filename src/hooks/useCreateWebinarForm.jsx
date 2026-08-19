import { useState, useEffect } from 'react'

export const useCreateWebinarForm = ({
	isOpen,
	onClose,
	onCreate,
	takeinfo,
	editmode,
}) => {
	const [editMode, setEditMode] = useState(false)
	const [step, setStep] = useState(1)

	// Form fields
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
	const [stime, setSTime] = useState('')
	const [etime, setETime] = useState('')
	const [img, setImg] = useState(null)

	// Access and Groups
	const [selectedAccess, setSelectedAccess] = useState(1)
	const [searchGroups, setSearchGroups] = useState('')
	const [linkedGroups, setLinkedGroups] = useState([])
	const [unlinkedGroups, setUnlinkedGroups] = useState({ items: [], pages: 1 })
	const [page, setPage] = useState(1)
	const [isLoading, setIsLoading] = useState(false)

	// Form Validations
	const isFormValid = title.trim() !== '' && url.trim() !== ''
	const isStartDTValid = Boolean(stime)
	const isAccessValid =
		selectedAccess === 1 || (selectedAccess === 2 && linkedGroups.length > 0)

	const isSubmitDisabled = editMode
		? false
		: !(isFormValid && isStartDTValid && isAccessValid)

	// Initialize edit/create mode state
	useEffect(() => {
		if (editmode && takeinfo) {
			setEditMode(true)
			setStep(3)
			setTitle(takeinfo.name || '')
			setUrl(takeinfo.link_url || '')
			setLinkedGroups(takeinfo.linked_groups || [])
			setSelectedAccess(takeinfo.webinar_access === 'restricted' ? 2 : 1)
		} else {
			setEditMode(false)
			setStep(1)
			resetForm()
		}
	}, [editmode, takeinfo, isOpen])

	// Clear groups if access level changed to public
	useEffect(() => {
		if (step === 3 && selectedAccess === 1) {
			setLinkedGroups([])
		}
	}, [selectedAccess, step])

	// Fetch groups with debounce
	useEffect(() => {
		if (step === 3) {
			const timer = setTimeout(() => {
				fetchUnlinkedGroups(searchGroups)
			}, 500)
			return () => clearTimeout(timer)
		}
	}, [searchGroups, page, step])

	const resetForm = () => {
		setTitle('')
		setUrl('')
		setDate(new Date().toISOString().slice(0, 10))
		setSTime('')
		setETime('')
		setLinkedGroups([])
		setImg(null)
	}

	const fetchUnlinkedGroups = async (term = '') => {
		if (!takeinfo?.id) return
		setIsLoading(true)
		try {
			const query = new URLSearchParams({
				page,
				size: 25,
				webinar_id: takeinfo.id,
				...(term && { term }),
			})
			const res = await api.get(
				`${API}/webinar/student-group/unlinked?${query}`,
				{
					withCredentials: true,
				},
			)
			setUnlinkedGroups(res.data)
		} catch (e) {
			setGlobalError('Ошибка при загрузке данных')
		} finally {
			setIsLoading(false)
		}
	}

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

	const handleSubmit = async e => {
		e.preventDefault()
		const { formData, linkedGroupIds } = buildFormData()

		try {
			let res
			if (editMode) {
				const accessData = linkedGroupIds ? formData : null
				res = await api.put(
					`${API}/webinar/access/edit/${takeinfo.id}`,
					accessData,
					{
						withCredentials: true,
					},
				)
			} else {
				res = await api.post(`${API}/webinar`, formData, {
					withCredentials: true,
				})
			}

			onCreate(res.data)
			onClose()
			resetForm()
		} catch (error) {
			console.error('Ошибка сервера:', error)
		}
	}

	return {
		state: {
			editMode,
			step,
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
			setStep,
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
