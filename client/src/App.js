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
import Event from './pages/Event.jsx'
import FriendSuggestions from './pages/FriendSuggestions.jsx'

// TODO: responsive to screen size
//te
function App() {
	return (
		<div className="app">
			<Router>
				<Routes>
					<Route
						exact
						path="/login"
						element={
							<ProtectedRoute isAuthPage={true}>
								<Login />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/signup"
						element={
							<ProtectedRoute isAuthPage={true}>
								<SignUp />
							</ProtectedRoute>
						}
					/>

					<Route
						exact
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>

					<Route
						exact
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/connection/:userId"
						element={
							<ProtectedRoute>
								<Connection />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/notification"
						element={
							<ProtectedRoute>
								<Notification />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/:userId"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/map"
						element={
							<ProtectedRoute>
								<Map />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/groups"
						element={
							<ProtectedRoute>
								<Groups />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/groups/:groupId"
						element={
							<ProtectedRoute>
								<GroupProfile />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/chats"
						element={
							<ProtectedRoute>
								<Chat />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/diary"
						element={
							<ProtectedRoute>
								<Diary />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/events"
						element={
							<ProtectedRoute>
								<Event />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/friendSuggestions"
						element={
							<ProtectedRoute>
								<FriendSuggestions />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	)
}

export default App
