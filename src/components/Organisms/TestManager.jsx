import { StartTestingButton } from '../Atoms/Buttons/StartTestingButton'
import { TestHeader } from '../Molecules/TestHeader'
import { TestingScore } from './TestingScore'
import { TestView } from './TestView'

export const TestManager = ({}) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const [sessionIsStart, setSessionIsStart] = useState(false)
	const [accessToTheTest, setAccessToTheTest] = useState(false)

	const [timeLeft, setTimeLeft] = useState(0)

	const [role, setRole] = useState()

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setRole(res?.role)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	const startSession = async () => {
		try {
			await StartSession(activeSection)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		const getQuestions = async () => {
			try {
				const res = await GetQuestions(activeSection)
				return res.time_limit
			} catch (err) {
				console.log(err)
			}
		}
		const getSession = async () => {
			try {
				const res = await GetSession(activeSection)
				const currentTime = Date.now() / 1000 // Текущее время в секундах
				const tl = Math.floor(currentTime - res.expire_at)
				setSessionIsStart(true)
				setTimeLeft(getQuestions() - tl)
			} catch (err) {
				// Обработка ошибки
				setSessionIsStart(false)
			}
		}

		if (role === 'student' && activeSection) {
			getSession()
		}
	}, [activeSection, role])

	useEffect(() => {
		if (sessionIsStart === true && timeLeft > 0 && role === 'student') {
			setAccessToTheTest(true)
		} else {
			setAccessToTheTest(false)
		}
	}, [sessionIsStart, timeLeft, role])

	console.log(accessToTheTest)

	console.log(activeQuestionId)

	return (
		<>
			{role === 'student' ? (
				<>
					{sessionIsStart ? (
						accessToTheTest ? (
							<>
								<TestHeader timeLeft={timeLeft} isEdit={role === 'teacher'} />
								{activeQuestionId ? (
									<>
										<TestView role={role} isEdit={role === 'teacher'} />
									</>
								) : (
									<div className='flex justify-center items-center w-full h-full text-center text-[var(--middle)] font-medium'>
										Вопрос не выбран
									</div>
								)}
							</>
						) : (
							<TestingScore />
						)
					) : (
						<div className={`w-full h-150 flex justify-center items-center`}>
							<StartTestingButton
								title={'Начать тестирование'}
								onClick={startSession}
							/>
						</div>
					)}
				</>
			) : (
				<>
					<TestHeader timeLeft={timeLeft} isEdit={role === 'teacher'} />
					{activeQuestionId ? (
						<>
							<TestView role={role} isEdit={role === 'teacher'} />
						</>
					) : (
						<div className='flex justify-center items-center w-full h-full text-center text-[var(--middle)] font-medium'>
							Вопрос не выбран
						</div>
					)}
				</>
			)}
		</>
	)
}
