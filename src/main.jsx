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
import { Toaster } from 'sonner'

import Authorization from './pages/Authorization'
import DashboardLayout from './pages/layout/DashboardLayout'
import Catalog from './pages/Сatalog'
import CoursePage from './pages/CoursePage'
import SchedulePage from './pages/Schedule'
import ModerateCourses from './pages/Moderator/ModerateCourses'
import Profile from './pages/Profile'
import TaskChecking from './pages/TaskChecking'
import { UserProvider } from './context/UserContext'
import WebinarsCatalog from './pages/WebinarsСatalog'

function MainApp() {
	return (
		<Suspense>
			<Routes>
				<Route path='/authorization' element={<Authorization />}></Route>
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/catalog/courses' element={<Catalog />}></Route>
					<Route path='/catalog/webinars' element={<WebinarsCatalog />}></Route>
					<Route path='/course/:courseId?' element={<CoursePage />} />
					{/* <Route path='/moderation-users' element={<ModerateUsers />} /> */}
					<Route path='/schedule' element={<SchedulePage />} />

					<Route
						path='/moderation-courses/:type'
						element={<ModerateCourses />}
					/>
					<Route path='/profile' element={<Profile />} />
					<Route path='/checking' element={<TaskChecking />} />
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
