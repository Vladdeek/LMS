import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { activityApi } from '../../api/ActivityStudents'
import { ActivityFilterBar } from '../../components/Organisms/ActivityStudents/ActivityFilterBar'
import { ActivityTable } from '../../components/Organisms/ActivityStudents/ActivityTabel'

const FILTER_MAP = {
	'Имя (А–Я)': { student_name_order: 'asc' },
	'Имя (Я–А)': { student_name_order: 'desc' },
	'Дата (сначала новые)': { module_section_date_order: 'desc' },
	'Дата (сначала старые)': { module_section_date_order: 'asc' },
	'Активность (по убыванию)': { session_time_order: 'desc' },
	'Активность (по возрастанию)': { session_time_order: 'asc' },
	'Занятие (по убыванию)': { module_section_title_order: 'desc' },
	'Занятие (по возрастанию)': { module_section_title_order: 'asc' },
}

export const ActivityStudents = () => {
	const { courseId } = useParams()

	const [groups, setGroups] = useState([])
	const [lessons, setLessons] = useState({})
	const [students, setStudents] = useState([])

	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)

	const [searchStudents, setSearchStudents] = useState('')
	const [isSearchLoading, setIsSearchLoading] = useState(false)

	const studentsDebounce = useRef(null)

	// Fetching Filter Static Data
	useEffect(() => {
		if (!courseId) return

		const fetchFiltersData = async () => {
			try {
				const [groupsRes, lessonsRes] = await Promise.all([
					activityApi.getLinkedGroups(courseId),
					activityApi.getLessons(courseId),
				])
				setGroups(groupsRes.data.items.map(item => item.name))
				setLessons(lessonsRes.data)
			} catch (error) {
				console.error('Error fetching filter data', error)
			}
		}

		fetchFiltersData()
	}, [courseId])

	// Fetching Students Activity Data
	const fetchStudents = useCallback(
		async (term = searchStudents) => {
			if (!courseId) return

			setIsSearchLoading(true)
			const lessonKeys = Object.keys(lessons)
			const lessonKey =
				selectedLesson !== null && selectedLesson !== undefined
					? lessonKeys[selectedLesson]
					: null

			const params = {
				...(term && { term }),
				...(selectedGroup !== null && { group_name: groups[selectedGroup] }),
				...(lessonKey && { module_section_id: lessons[lessonKey] }),
				...(selectedFilter && FILTER_MAP[selectedFilter]),
			}

			try {
				const res = await activityApi.getStudentsActivity(courseId, params)
				setStudents(res.data)
			} catch (e) {
				console.error('fetchStudents error', e)
			} finally {
				setIsSearchLoading(false)
			}
		},
		[courseId, selectedGroup, selectedLesson, selectedFilter, groups, lessons],
	)

	// Search Debounce Effect
	useEffect(() => {
		if (!courseId) return

		if (studentsDebounce.current) {
			clearTimeout(studentsDebounce.current)
		}

		studentsDebounce.current = setTimeout(() => {
			fetchStudents(searchStudents)
		}, 500)

		return () => clearTimeout(studentsDebounce.current)
	}, [searchStudents, fetchStudents, courseId])

	// Refetch when filters change
	useEffect(() => {
		fetchStudents()
	}, [selectedGroup, selectedFilter, selectedLesson, fetchStudents])

	return (
		<div>
			<ActivityFilterBar
				groups={groups}
				lessons={lessons}
				filterOptions={FILTER_MAP}
				selectedGroup={selectedGroup}
				setSelectedGroup={setSelectedGroup}
				selectedLesson={selectedLesson}
				setSelectedLesson={setSelectedLesson}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				searchStudents={searchStudents}
				setSearchStudents={setSearchStudents}
				isSearchLoading={isSearchLoading}
			/>

			<ActivityTable students={students} />
		</div>
	)
}

export default ActivityStudents
