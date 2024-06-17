import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Connection from './pages/Connection.jsx'
import Profile from './pages/Profile.jsx'
import Groups from './pages/Groups.jsx'
import Map from './pages/Map.jsx'
import Posts from './pages/Post.jsx'
import Graph from './pages/Graph.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute.js'
import Settings from './pages/Settings.jsx'
import GroupProfile from './pages/GroupProfile.jsx'
import Chat from './pages/Chat.jsx'
import Diary from './pages/Diary.jsx'
import Event from './pages/Event.jsx'
import FriendSuggestions from './pages/FriendSuggestions.jsx'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import DashboardLayout from './components/dashboard/DashboardLayout.jsx'
import FriendData from './pages/dashboard/FriendData.jsx'
import FriendGeography from './pages/dashboard/FriendGeography.jsx'
import ProfileLayout from './components/profile/ProfileLayout.jsx'
import VerificationGuide from './pages/verification/VerificationGuide.jsx'
import VerificationResult from './pages/verification/VerificationResult.jsx'
import FriendGrowth from './pages/dashboard/FriendGrowth.jsx'
import InteractionReport from './pages/dashboard/InteractionReport.jsx'
import NetworkGraph from './pages/NetworkGraph.jsx'

// TODO: responsive to screen size

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
                        path="/verificationGuide"
                        element={
                            <ProtectedRoute isAuthPage={true}>
                                <VerificationGuide />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        exact
                        path="/auth/:id/verify/:token"
                        element={
                            <ProtectedRoute isAuthPage={true}>
                                <VerificationResult />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route exact path="/" element={<NetworkGraph />} />
                        <Route exact path="/settings" element={<Settings />} />
                        <Route exact path="/graph" element={<Graph />} />
                        <Route
                            exact
                            path="/connection/:userId"
                            element={<Connection />}
                        />
                        <Route element={<ProfileLayout />}>
                            <Route
                                exact
                                path="users/:userId"
                                element={<Profile />}
                            />
                        </Route>
                        <Route exact path="/map" element={<Map />} />
                        <Route exact path="/groups" element={<Groups />} />
                        <Route
                            exact
                            path="/groups/:groupId"
                            element={<GroupProfile />}
                        />
                        <Route exact path="/chats" element={<Chat />} />
                        <Route exact path="/diary" element={<Diary />} />
                        <Route exact path="/events" element={<Event />} />
                        <Route
                            exact
                            path="/friendSuggestions"
                            element={<FriendSuggestions />}
                        />
                        <Route exact path="/posts" element={<Posts />} />
                        <Route element={<DashboardLayout />}>
                            <Route
                                exact
                                path="/dashboard/friendInfo"
                                element={<FriendData />}
                            />
                            <Route
                                exact
                                path="/dashboard/friendGeography"
                                element={<FriendGeography />}
                            />
                            <Route
                                exact
                                path="/dashboard/interactionReport"
                                element={<InteractionReport />}
                            />
                            <Route
                                exact
                                path="/dashboard/friendGrowth"
                                element={<FriendGrowth />}
                            />
                            <Route
                                exact
                                path="/dashboard"
                                element={<Dashboard />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App
