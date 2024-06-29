import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { setReceivedRequests } from '../../state/friendReducer.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import NotificationItem from './NotificationItem'
import { Separator } from '../ui/separator'

var socket
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
const EXPIRATION_PERIOD = 15

const Notification = () => {
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token)
    const [notifications, setNotifications] = useState([])
    const unreadChats = useSelector((state) => state.chat.unreadChats) || []
    const currentUser = useSelector((state) => state.auth.user)
    const [socketConnected, setSocketConnected] = useState(false)
    const receivedRequests =
        useSelector((state) => state.friend.receivedRequests) || []

    // Load notifications from local storage on mount
    //  Sort date in descending order
    // Remove notifications after EXPIRATION_PERIOD days
    useEffect(() => {
        const storedNotifications =
            JSON.parse(localStorage.getItem('notifications')) || []
        const updatedNotifications = storedNotifications.filter(
            (notification) => {
                const now = new Date()
                const createdAt = new Date(notification.createdAt)
                const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24)
                return diffInDays <= EXPIRATION_PERIOD
            }
        )
        localStorage.setItem(
            'notifications',
            JSON.stringify(updatedNotifications)
        )
        setNotifications(updatedNotifications)
    }, [])

    // set up socket
    useEffect(() => {
        socket = io(BASE_URL)
        socket.emit('setup', currentUser)
        socket.on('connected', () => setSocketConnected(true))
    }, [])

    useEffect(() => {
        if (!socket) return

        const handleFriendRequestReceived = (friendRequest) => {
            const updatedRequests = [...receivedRequests, friendRequest]
            dispatch(setReceivedRequests(updatedRequests))

            const newNotification = {
                id: `friend_request_${friendRequest._id}`,
                type: 'FRIEND_REQUEST',
                data: friendRequest,
                isRead: true,
                createdAt: new Date().toISOString(),
            }
            const updatedNotifications = [newNotification, ...notifications]
            setNotifications(updatedNotifications)
            localStorage.setItem(
                'notifications',
                JSON.stringify(updatedNotifications)
            )
        }

        socket.on('friend request received', handleFriendRequestReceived)

        return () => {
            socket.off('friend request received', handleFriendRequestReceived)
        }
    }, [socket, receivedRequests, dispatch])

    // TODO: NOTIFICATION TOAST

    const handleToggleRead = (id) => {
        const updatedNotifications = notifications.map((notification) => {
            if (notification.id === id) {
                return { ...notification, isRead: !notification.isRead }
            }
            return notification
        })
        setNotifications(updatedNotifications)
        localStorage.setItem(
            'notifications',
            JSON.stringify(updatedNotifications)
        )
    }

    const handlePreventDefault = (e) => {
        e.preventDefault()
    }

    return (
        <div className="cursor-pointer group h-[4vh] w-[4vh] flex flex-col items-center justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                        <FaBell size={21} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[380px]">
                    <DropdownMenuLabel className="mb-2">
                        Notifications
                    </DropdownMenuLabel>
                    <div className="text-[11px] text-gray-600">
                        *Notifications will be removed after 15 days
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className="divide-y divide-solid">
                        {/* {unreadChats &&
                            unreadChats.map((chat) => {
                                return (
                                    <Link to="">
                                        <DropdownMenuItem>
                                            <span>{unreadChats.length}</span>
                                        </DropdownMenuItem>
                                    </Link>
                                )
                            })} */}

                        {notifications
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                            )
                            .map((notification) => (
                                // <Link to="" key={notification.id}>
                                <DropdownMenuItem
                                    className="flex p-0 rounded-none"
                                    key={notification.id}
                                    onSelect={handlePreventDefault}
                                >
                                    <NotificationItem
                                        type={notification.type}
                                        data={notification.data}
                                        isRead={notification.isRead}
                                        onToggleRead={() =>
                                            handleToggleRead(notification.id)
                                        }
                                    />
                                </DropdownMenuItem>
                                // </Link>
                            ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <span className="mt-[3px] left-0 w-0 transition-all duration-150 h-[3px] bg-indigo-600 group-hover:w-full"></span>
        </div>
    )
}

export default Notification
