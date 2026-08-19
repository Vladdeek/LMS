import { createRoot } from 'react-dom/client'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
	BrowserRouter,
} from 'react-router-dom'
import {
	StrictMode,
	Suspense,
	use,
	useContext,
	useEffect,
	useState,
} from 'react'
import './index.css'
import './themes.css'
import DashboardLayout from './pages/layout/DashboardLayout'
import Catalog from './pages/Сatalog'
import Authorization from './pages/Authorization'
import StudentCourseRequest from './pages/StudentCourseRequest'
import CoursePage from './pages/CoursePage'
import { Me } from '../service/APIs/Authorization'
import ModerateCourses from './pages/Moderator/ModerateCourses'
import Profile from './pages/Profile'
import AcceptanceOfApplications from './pages/Moderator/AcceptanceOfApplications'
import TaskChecking from './pages/TaskCheking'
import { Toaster } from 'sonner'
import { UserProvider } from '../service/context/UserContext'
import SchedulePage from './pages/Schedule'

function MainApp() {
	return (
		<Suspense>
			<Routes>
				<Route path='/authorization' element={<Authorization />}></Route>
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/catalog/:type?' element={<Catalog />}></Route>
					<Route path='/course/:courseId?' element={<CoursePage />} />
					{/* <Route path='/moderation-users' element={<ModerateUsers />} /> */}
					<Route path='/schedule' element={<SchedulePage />} />
					<Route
						path='/acceptance-of-applications'
						element={<AcceptanceOfApplications />}
					/>
					<Route
						path='/moderation-courses/:type'
						element={<ModerateCourses />}
					/>
					<Route path='/profile' element={<Profile />} />
					<Route path='/checking' element={<TaskChecking />} />
					<Route path='/request/:courseId' element={<StudentCourseRequest />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<UserProvider>
			<MainApp />
			<Toaster
				theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
				position='top-right'
				richColors
				closeButton
			/>
		</UserProvider>
	</BrowserRouter>,
)
