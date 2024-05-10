import React from 'react'
import NavbarButton from './NavbarButton.tsx'
import { RiBookletFill } from 'react-icons/ri'
import { FaBell } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { useLogout } from '../../hooks/useLogout.js'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { IoIosContacts } from 'react-icons/io'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { FaMap } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'

import { LogOut, Settings, User } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const Navbar = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const unreadChats = useSelector((state) => state.chat.unreadChats)
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="fixed h-[60px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
            <div
                onClick={() => navigate('/')}
                className="cursor-pointer font-bold"
            >
                Logo
            </div>
            <div className="flex flex-row gap-4 items-center">
                {/* TODO: use tooltips for these buttons */}
                <NavbarButton
                    icon={<RiBookletFill size={21} />}
                    name="My space"
                    url="/diary"
                />

                <NavbarButton
                    icon={<FaMap size={21} />}
                    name="Map"
                    url="/map"
                />
                <NavbarButton
                    icon={<FaCalendarAlt size={21} />}
                    name="Event"
                    url="/events"
                />
                <NavbarButton
                    icon={<IoIosContacts size={26} />}
                    name="Connection"
                    url={`/connection/${user._id}`}
                />

                <NavLink
                    to="/chats"
                    title="Chats"
                    className="relative inline-block"
                >
                    <div>
                        <IoChatbubbleEllipses size={24} />
                        <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5">
                            <NotificationBadge
                                count={unreadChats.length}
                                effect={Effect.SCALE}
                            />
                        </div>
                    </div>
                </NavLink>

                {/* <NavbarButton
                    icon={<FaBell size={21} />}
                    name="Notifications"
                    url="/notification"
                /> */}
                <Notification />
                <DropdownMenuDemo user={user} handleLogout={handleLogout} />
            </div>
        </div>
    )
}

function DropdownMenuDemo({ user, handleLogout }) {
    return (
        <div className="cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className=" w-[26px] h-[26px] rounded-full">
                        <img
                            src={user.profilePicture?.url}
                            alt="profilePicture"
                            className="object-cover w-[24px] h-[24px] rounded-full"
                        />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link to={`/${user._id}`}>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </Link>

                        <Link to="/settings">
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <Link to="/requests">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Requests</span>
                            </DropdownMenuItem>
                        </Link>

                        <Link to="/friendSuggestions">
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Suggestions</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <div onClick={handleLogout}>
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

function Notification() {
    const unreadChats = useSelector((state) => state.chat.unreadChats)

    return (
        <div className="cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                        <FaBell size={21} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[320px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {unreadChats.map((chat) => {
                            return (
                                <Link to="">
                                    <DropdownMenuItem>
                                        <span>{unreadChats.length}</span>
                                    </DropdownMenuItem>
                                </Link>
                            )
                        })}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Navbar
