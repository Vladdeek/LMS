import { useEffect, useState } from 'react'
import {
	BookMarked,
	LaptopMinimalCheck,
	NotebookPen,
	Settings,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { LESSON_ICONS, LESSON_LABELS } from '../../Constants/lessonTypes'
import { Toggle } from '../Atoms/Buttons/Toggle'
import { SubmitButton } from '../Atoms/Buttons/SubmitButton'
import { TimeLimitInput } from '../Molecules/InputFields/TimeLimitInput'
import { getSectionInfo } from '../../api/CourseService'
import { Show } from '../Atoms/Show'
import { Loading } from '../Atoms/Loaders/Loading'
import { ButtonCase } from '../Atoms/Buttons/ButtonCase'
import { Text } from '../Atoms/Text'
import { TestSettingsModal } from './Modals/TestSettingsModal'

const formatTime = seconds => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const ContentHeader = ({ isEdit, onIsEditChange }) => {
	const { role } = useUser()
	const [searchParams] = useSearchParams()

	const activeSection = searchParams.get('section')
	const activeType = searchParams.get('type')

	const [sectionInfo, setSectionInfo] = useState(null)
	const [questionsData, setQuestionsData] = useState(null)
	const [testSettingsIsOpen, setTestSettingsIsOpen] = useState(false)

	const [totalTime, setTotalTime] = useState(0)
	const [timeLeft, setTimeLeft] = useState(0)
	const [testStatus, setTestStatus] = useState(null)

	const progressWidth = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

	useEffect(() => {
		if (timeLeft <= 0) return
		const timer = setInterval(() => {
			setTimeLeft(prev => Math.max(prev - 1, 0))
		}, 1000)
		return () => clearInterval(timer)
	}, [timeLeft])

	useEffect(() => {
		if (!activeSection) return
		const fetchInfo = async () => {
			try {
				const res = await getSectionInfo(activeSection)
				console.log(res)
				setSectionInfo(res)
			} catch (err) {
				console.error(err)
			}
		}
		fetchInfo()
	}, [activeSection])

	const fetchTestSessionInfo = async () => {
		if (!activeSection) return
		try {
			const res = await getSession(activeSection)
			const currentTime = Math.floor(Date.now() / 1000)
			const remaining = res.expire_at
				? Math.max(0, res.expire_at - currentTime)
				: 0

			setTestStatus(res.status)
			setTimeLeft(remaining)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		if (role === 'student' && activeType === 'test' && activeSection) {
			fetchTestSessionInfo()
		}
	}, [activeSection, role, activeType])

	const changeTimeLimit = async time => {
		if (time > 0 && activeSection) {
			try {
				const res = await editTest(activeSection, null, null, time, null)
				setQuestionsData(res)
			} catch (err) {
				console.error(err)
			}
		}
	}

	const handleEndSession = async () => {
		try {
			await endSession(activeSection)
		} catch (err) {
			console.error(err)
		} finally {
			await fetchTestSessionInfo()
		}
	}

	const icons = LESSON_ICONS

	const labels = LESSON_LABELS

	return (
		<>
			<TestSettingsModal
				isOpen={testSettingsIsOpen}
				onClose={() => setTestSettingsIsOpen(false)}
			/>
			<div className='flex flex-col gap-3'>
				<div className='relative flex items-center justify-between w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pr-3 pl-4 py-2 overflow-hidden'>
					<div className='flex items-center gap-3'>
						<Show when={sectionInfo}>
							<>
								<span className='text-[var(--middle)] h-full w-auto'>
									{icons[activeType]}
								</span>
								<div className='flex flex-col'>
									<p className='text-[var(--middle)] text-xs uppercase font-medium'>
										{labels[activeType]}
									</p>
									<Show when={sectionInfo !== null} fallback={<Loading />}>
										<p className='text-[var(--black)] text-lg font-semibold'>
											{sectionInfo?.title}
										</p>
									</Show>
								</div>
							</>
						</Show>
					</div>

					<Show when={role !== 'student' && activeType === 'test'}>
						<button
							onClick={() => setTestSettingsIsOpen(true)}
							className={
								'flex items-center justify-center group cursor-pointer bg-[var(--white)] shadow-[var(--shadow)] h-full w-auto aspect-square rounded-lg hover:bg-[var(--light-middle)]  transition-all'
							}
							invert
						>
							<Settings className='group-hover:rotate-360 duration-500 transition-all group-hover:scale-105' />
						</button>
					</Show>
					<Show when={role !== 'student' && activeType !== 'test'}>
						<Toggle
							label='Режим редактирования'
							isActive={isEdit}
							defaultValue={true}
							onChange={data => onIsEditChange?.(data)}
						/>
					</Show>

					<Show when={activeType === 'test' && testStatus === 'pending'}>
						<>
							<p className='w-24 text-center text-[var(--black)] font-semibold'>
								{formatTime(timeLeft >= 0 ? timeLeft : 0)}
							</p>
							<SubmitButton
								onClick={handleEndSession}
								rounded='rounded-lg'
								className='w-fit'
								flexParams='justify-center'
							>
								Завершить тест
							</SubmitButton>
							<div
								style={{
									width: `${progressWidth}%`,
									transition: 'width 1s linear',
								}}
								className='absolute bg-[var(--hero)] bottom-0 left-0 h-1 rounded-full'
							/>
						</>
					</Show>
				</div>
			</div>
		</>
	)
}
