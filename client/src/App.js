import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Notification from './pages/Notification.jsx'
import Connection from './pages/Connection.jsx'
import Profile from './pages/Profile.jsx'
import Groups from './pages/Groups.jsx'
import Map from './pages/Map.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute.js'
import Settings from './pages/Settings.jsx'
import GroupProfile from './pages/GroupProfile.jsx'
import Chat from './pages/Chat.jsx'
import Diary from './pages/Diary.jsx'
import ConnectionDetail from './components/connection/ConnectionDetailCard.jsx'

// TODO: responsive to screen size

function App() {
	return (
		<div className="app">
			<Router>
				<Routes>
					<Route
						path="/login"
						element={
							<ProtectedRoute isAuthPage={true}>
								<Login />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/signup"
						element={
							<ProtectedRoute isAuthPage={true}>
								<SignUp />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/connection"
						element={
							<ProtectedRoute>
								<Connection />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/notification"
						element={
							<ProtectedRoute>
								<Notification />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/:userId"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/map"
						element={
							<ProtectedRoute>
								<Map />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/groups"
						element={
							<ProtectedRoute>
								<Groups />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/groups/:groupId"
						element={
							<ProtectedRoute>
								<GroupProfile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/chats"
						element={
							<ProtectedRoute>
								<Chat />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/diary"
						element={
							<ProtectedRoute>
								<Diary />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	)
}

export default App
