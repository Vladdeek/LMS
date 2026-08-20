import { ArrowDown, Blocks, Filter, RotateCcw, Video } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from '../components/Atoms/Modal'
import { CreateCourseForm } from '../components/Organisms/Forms/CreateCourseForm'
import { RadioGroup } from '../components/Molecules/RadioGroup'
import { CourseCard } from '../components/Organisms/Cards/CourseCard'
import { motion } from 'framer-motion'
import { CreateCourseModal } from '../components/Organisms/Modals/CreateCourseModal'
import { Show } from '../components/Atoms/Show'
import { fetchCoursesApi } from '../api/Courses'
import { FilterOptionInput } from '../components/Molecules/InputFields/FilterOptionInput'
import { deleteWebinar, getWebinarById, getWebinars } from '../api/Webinars'
import { CreateWebinarModal } from '../components/Organisms/Modals/CreateWebinarModal'
import { WebinarCard } from '../components/Organisms/Cards/WebinarCard'
import { WebinarHistory } from '../components/Organisms/Modals/WebinarsHistoryModal'
import { ButtonCase } from '../components/Atoms/Buttons/ButtonCase'
import { ConfirmModal } from '../components/Organisms/Modals/ConfirmModal'

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-4xl group hover:border-[var(--hero)] hover:text-[var(--hero)] transition-all cursor-pointer h-full max-md:mb-30`}
		>
			<Video size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				{title}
			</span>
		</button>
	)
}

const WebinarsCatalog = () => {
	const { userInfo, role } = useUser()
	const [webinars, setWebinars] = useState([])
	const [loading, setLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const [historyWebinarOpen, setHistoryWebinarOpen] = useState(false)
	const navigate = useNavigate()
	const fetchWebinars = async () => {
		try {
			const data = await getWebinars('all')
			setWebinars(data)
		} catch (error) {
			console.error('Ошибка при загрузке вебинаров:', error)
		}
	}
	useEffect(() => {
		fetchWebinars()
	}, [])

	const getWebById = async id => {
		try {
			const data = await getWebinarById(id)
			setWebinarByIdInfo(data)
		} catch (error) {
			console.error('Ошибка при получении вебинара:', error)
		}
	}

	const delWebById = async id => {
		try {
			await deleteWebinar(id)
			fetchWebinars()
		} catch (error) {
			console.error('Ошибка при удалении вебинара:', error)
		}
	}

	const rowHeight = 'h-125'

	return (
		<>
			<CreateWebinarModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<WebinarHistory
				isOpen={historyWebinarOpen}
				onClose={() => setHistoryWebinarOpen(false)}
			/>

			{/* Сетка карточек */}
			<div className='flex flex-col gap-5 py-25 px-4'>
				<div className='flex justify-end items-center'>
					<ButtonCase
						onClick={() => setHistoryWebinarOpen(true)}
						backgroundColor='var(--white)'
						textColor='var(--black)'
						hoverStyles='hover:bg-[var(--hero)] hover:text-white'
					>
						История видео-конференций
					</ButtonCase>
				</div>
				<div className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-5'>
					{webinars.map((webinar, index) => (
						<motion.div
							key={webinar.id}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: index * 0.05,
								ease: 'easeOut',
							}}
							className={rowHeight}
						>
							<WebinarCard
								title={webinar.name}
								id={webinar.id}
								to={webinar.link_url}
								start={webinar.start_date}
								end={webinar.end_date}
								img_path={webinar.image_url}
							/>
						</motion.div>
					))}

					<Show when={role === 'teacher'}>
						<motion.div
							key='create-btn'
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: webinars.length * 0.05,
								ease: 'easeOut',
							}}
							className={rowHeight}
						>
							<CreateBtn
								onClick={() => setIsModalOpen(true)}
								title='Запланировать видео-конференцию'
							/>
						</motion.div>
					</Show>
				</div>
			</div>
		</>
	)
}
export default WebinarsCatalog
