import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { accessApi } from '../../api/AccessManagment'
import { AccessBlock } from '../../components/Organisms/AccessBlock'

const ENTITY = {
	STUDENTS: 'students',
	TEACHERS: 'teachers',
}

export const AccessManagement = ({ onChange }) => {
	const { courseId } = useParams()

	const [selectedEntity, setSelectedEntity] = useState(ENTITY.STUDENTS)
	const [selectedChapter, setSelectedChapter] = useState(0)

	const [linked, setLinked] = useState(null)
	const [unlinked, setUnlinked] = useState(null)

	const [searchLinked, setSearchLinked] = useState('')
	const [searchUnlinked, setSearchUnlinked] = useState('')

	const [loading, setLoading] = useState(null)
	const [linkedPage, setLinkedPage] = useState(1)
	const [unlinkedPage, setUnlinkedPage] = useState(1)

	const fetchData = useCallback(
		async (type, linkedFlag, term = '') => {
			const isLinked = linkedFlag === 'linked'
			try {
				setLoading(isLinked ? 1 : 0)
				const apiMethod = isLinked
					? accessApi.getLinkedData
					: accessApi.getUnlinkedData
				const page = isLinked ? linkedPage : unlinkedPage

				const res = await apiMethod(type, courseId, page, term)
				if (isLinked) {
					setLinked(res.data)
				} else {
					setUnlinked(res.data)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(null)
			}
		},
		[courseId, linkedPage, unlinkedPage],
	)

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchData(selectedEntity, 'linked', searchLinked)
			fetchData(selectedEntity, 'unlinked', searchUnlinked)
		}, 500)

		return () => clearTimeout(timer)
	}, [selectedEntity, searchLinked, searchUnlinked, fetchData])

	useEffect(() => {
		setLinkedPage(1)
		setUnlinkedPage(1)
	}, [selectedEntity])

	useEffect(() => {
		onChange?.(linked)
	}, [linked, onChange])

	const handleAdd = async id => {
		await accessApi.addAccess(selectedEntity, courseId, id)
		fetchData(selectedEntity, 'linked', searchLinked)
		fetchData(selectedEntity, 'unlinked', searchUnlinked)
	}

	const handleRemove = async id => {
		await accessApi.removeAccess(selectedEntity, courseId, id)
		fetchData(selectedEntity, 'linked', searchLinked)
		fetchData(selectedEntity, 'unlinked', searchUnlinked)
	}

	return (
		<>
			{/* Десктопная сетка */}
			<div className='grid grid-cols-2 gap-5 max-lg:hidden'>
				<AccessBlock
					mass={unlinked?.items}
					onAdd={handleAdd}
					onSearchChange={e => setSearchUnlinked(e.target.value)}
					searchValue={searchUnlinked}
					loading={loading === 0}
					selectedEntity={selectedEntity}
					onEntityChange={setSelectedEntity}
					onChangePage={setUnlinkedPage}
					pagecounts={unlinked?.pages}
					page={unlinkedPage}
				/>

				<AccessBlock
					title={selectedEntity}
					mass={linked?.items}
					Accessed
					onRemove={handleRemove}
					onSearchChange={e => setSearchLinked(e.target.value)}
					searchValue={searchLinked}
					loading={loading === 1}
					selectedEntity={selectedEntity}
					onChangePage={setLinkedPage}
					pagecounts={linked?.pages}
					page={linkedPage}
				/>
			</div>

			{/* Мобильная версия */}
			<div className='min-lg:hidden'>
				{selectedChapter === 0 ? (
					<AccessBlock
						mass={unlinked?.items}
						onAdd={handleAdd}
						onSearchChange={e => setSearchUnlinked(e.target.value)}
						searchValue={searchUnlinked}
						loading={loading === 0}
						selectedEntity={selectedEntity}
						onEntityChange={setSelectedEntity}
						selectedChapter={selectedChapter}
						onChapterChange={setSelectedChapter}
						onChangePage={setUnlinkedPage}
						pagecounts={unlinked?.pages}
						page={unlinkedPage}
					/>
				) : (
					<AccessBlock
						title={selectedEntity}
						mass={linked?.items}
						Accessed
						onRemove={handleRemove}
						onSearchChange={e => setSearchLinked(e.target.value)}
						searchValue={searchLinked}
						loading={loading === 1}
						selectedEntity={selectedEntity}
						onEntityChange={setSelectedEntity}
						selectedChapter={selectedChapter}
						onChapterChange={setSelectedChapter}
						onChangePage={setLinkedPage}
						pagecounts={linked?.pages}
						page={linkedPage}
					/>
				)}
			</div>
		</>
	)
}

export default AccessManagement
