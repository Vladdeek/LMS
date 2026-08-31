import { useEffect, useState } from 'react'
import { SubmitButton } from '../../Atoms/Buttons/SubmitButton'
import { Loader } from '../../Atoms/Loaders/Loader'
import { FileView } from '../../Molecules/FileView'
import { API_URL } from '../../../API'
import api from '../../../api/client'

const PracticeView = ({ id, studentId }) => {
	const [files, setFiles] = useState([])
	const [selectScore, setSelectScore] = useState(null)
	const [fullInfo, setFullInfo] = useState([])
	const [loading, setLoading] = useState(false)

	const normalizeAnswers = (answers = []) => {
		return answers.map(item => ({
			name: item.original_name,
			size: item.file_size,
			type: item.mime_type,
			file_path: item.file_path,
		}))
	}

	useEffect(() => {
		setLoading(true)

		const fetchStudentsWork = async () => {
			try {
				const res = await api.get(
					`${API_URL}/student-profile/${studentId}/assignment/practice/answer?practice_id=${id}`,
				)
				setFiles(normalizeAnswers(res.data.answers))
				setFullInfo(res.data)
				setLoading(false)
			} catch (e) {
				console.error(e)
			}
		}
		fetchStudentsWork()
	}, [id, studentId])

	const finishCheck = async () => {
		try {
			const res = await api.put(
				`${API_URL}/student-profile/${studentId}/assignment/practice/grade?practice_id=${id}`,
				{
					score: selectScore,
				},
			)
		} catch (e) {}
	}

	return (
		<div className='flex flex-col w-full gap-3'>
			<div className='flex justify-between items-center'>
				<p className='font-medium'>Оценивание</p>
				{fullInfo?.score === null ? (
					<SubmitButton onClick={finishCheck}>
						Завершить оценивание
					</SubmitButton>
				) : (
					<p className='px-5 py-2 w-56 font-medium flex justify-center text-md bg-[var(--light-middle)] text-[var(--middle)] rounded-md'>
						Оценено
					</p>
				)}
			</div>
			<ScoreMoodBlock onChange={setSelectScore} value={fullInfo?.score} />
			<p className='font-medium'>Предоставлены материалы для оценки</p>
			{loading ? (
				<div className='flex justify-center items-center w-full h-25'>
					<Loader />
				</div>
			) : (
				<FileView Files={files} pinedFiles={true} />
			)}

			<div className='flex flex-col items-center justify-center gap-3 w-full'></div>
		</div>
	)
}
