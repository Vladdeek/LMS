import { useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { LESSON_ICONS, LESSON_LABELS } from '../../Constants/lessonTypes'
import { Toggle } from '../Atoms/Buttons/Toggle'
import { Show } from '../Atoms/Show'
import { Loading } from '../Atoms/Loaders/Loading'
import { Text } from '../Atoms/Text'
import { TestSettingsModal } from './Modals/TestSettingsModal'
import { getSectionInfo } from '../../api/courseService'
import { TestTimerBar } from '../Molecules/TestTimeBar'
import { useTestSession } from '../../hooks/useTestSession'

export const ContentHeader = ({ isEdit, onIsEditChange }) => {
	const { role } = useUser()
	const [searchParams] = useSearchParams()

	const activeSection = searchParams.get('section')
	const activeType = searchParams.get('type')

	const [sectionInfo, setSectionInfo] = useState(null)
	const [testSettingsIsOpen, setTestSettingsIsOpen] = useState(false)

	const { session } = useTestSession(
		activeType === 'test' ? activeSection : null,
	)

	useEffect(() => {
		if (!activeSection) return
		const fetchInfo = async () => {
			try {
				const res = await getSectionInfo(activeSection)
				setSectionInfo(res)
			} catch (err) {
				console.error(err)
			}
		}
		fetchInfo()
	}, [activeSection])

	const icons = LESSON_ICONS
	const labels = LESSON_LABELS

	return (
		<>
			<TestSettingsModal
				isOpen={testSettingsIsOpen}
				onClose={() => setTestSettingsIsOpen(false)}
			/>
			<div className='flex flex-col gap-3 relative'>
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
							className='flex gap-1 items-center px-3 justify-center group cursor-pointer bg-[var(--white)] shadow-[var(--shadow)] h-full w-fit rounded-lg hover:bg-[var(--light-middle)] transition-all'
						>
							<Text size={'md'}>Настройки теста</Text>
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

					<Show
						when={Boolean(session?.expires_at) && activeType === 'test'}
						fallback={null}
					>
						<div className='absolute -bottom-0 left-0 w-full'>
							<TestTimerBar
								submittedAt={session?.submitted_at}
								expiresAt={session?.expires_at}
							/>
						</div>
					</Show>
				</div>
			</div>
		</>
	)
}
