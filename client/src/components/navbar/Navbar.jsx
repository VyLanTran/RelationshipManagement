import React from 'react'
import NavbarButton from './NavbarButton.jsx'
import { HiUserGroup } from 'react-icons/hi'
import { RiBookletFill } from 'react-icons/ri'
import { FaCalendarAlt } from 'react-icons/fa'
import { useLogout } from '../../hooks/useLogout.js'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { IoIosContacts } from 'react-icons/io'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { FaMap } from 'react-icons/fa'
import { useSelector } from 'react-redux'
// import NotificationBadge from 'react-notification-badge'
import { CgMenuGridO } from 'react-icons/cg'
import { FiUserPlus } from 'react-icons/fi'
import { RiUserReceived2Line } from 'react-icons/ri'
import { GoGraph } from 'react-icons/go'
import logo from './logo.png'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
// import { Effect } from 'react-notification-badge'

import { LogOut, Settings, User } from 'lucide-react'
import Notification from './Notification.jsx'

const Navbar = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const unreadChats = useSelector((state) => state.chat.unreadChats) || []
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="fixed h-[60px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
            <div
                onClick={() => navigate('/')}
                className="cursor-pointer font-bold  flex flex-row gap-4 items-center"
            >
                <img className="h-[36px]" src={logo} alt="Logo" />
                <div className="text-[26px] app-name font-light">Bondscape</div>
            </div>
            <div className="flex flex-row gap-4 items-center mb-[-1vh]">
                {/* TODO: use tooltips for these buttons */}

                <NavbarButton
                    icon={<HiUserGroup size={22} />}
                    name="Groups"
                    url="/groups"
                />

                <NavLink
                    to="/chats"
                    title="Chats"
                    className="relative inline-block cursor-pointer group h-[4vh] w-[4vh] flex flex-col items-center justify-center"
                >
                    <div>
                        <IoChatbubbleEllipses size={24} />
                        {/* <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5">
                            <NotificationBadge
                                count={unreadChats.length}
                                effect={Effect.SCALE}
                            />
                        </div> */}
                    </div>
                    <span className="mt-[3px] left-0 w-0 transition-all duration-150 h-[3px] bg-indigo-600 group-hover:w-full"></span>
                </NavLink>

                <NavbarButton
                    icon={<FaMap size={22} />}
                    name="Map"
                    url="/map"
                />

                <NavbarButton
                    icon={<RiBookletFill size={22} />}
                    name="Diary"
                    url="/diary"
                />

                <NavbarButton
                    icon={<FaCalendarAlt size={22} />}
                    name="Event"
                    url="/events"
                />

                <Notification />
                <Menu user={user} />
                <DropdownSetting user={user} handleLogout={handleLogout} />
            </div>
        </div>
    )
}

function DropdownSetting({ user, handleLogout }) {
    return (
        <div className="cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className=" w-[32px] h-[32px] rounded-full">
                        <img
                            src={user.profilePicture?.url}
                            alt="profilePicture"
                            className="object-cover w-[30px] h-[30px] rounded-full shadow-3xl"
                        />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link to={`users/${user._id}`}>
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

function Menu({ user }) {
    return (
        <div className="cursor-pointer group h-[4vh] w-[4vh] flex flex-col items-center justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                        <CgMenuGridO size={26} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="p-2">
                        <span className="text-[20px] font-bold">Menu</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <div className="flex p-2">
                            <span className="mr-auto text-[16px] font-semibold">
                                Friends
                            </span>
                        </div>
                        {/* <Link to="/requests">
                            <DropdownMenuItem>
                                <RiUserReceived2Line className="mr-2 h-4 w-4" />
                                <span>Requests</span>
                            </DropdownMenuItem>
                        </Link> */}

                        <Link to="/friends">
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#fff6e0]">
                                <FiUserPlus className="mr-2 h-4 w-4" />
                                <span>Friends</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <div className="flex p-2">
                            <span className="mr-auto text-[16px] font-semibold">
                                Off-Bond Connections
                            </span>
                        </div>
                        <Link to={`/connection/${user._id}`}>
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#fff6e0]">
                                <IoIosContacts className="mr-1 h-5 w-5" />
                                <span>Connections</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <div className="flex p-2">
                            <span className="mr-auto text-[16px] font-semibold">
                                Data
                            </span>
                        </div>
                        <Link to="/dashboard/friendInfo">
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#fff6e0]">
                                <GoGraph className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>
            <span className="mt-[3px] left-0 w-0 transition-all duration-150 h-0.5 bg-indigo-600 group-hover:w-full"></span>
        </div>
    )
}

export default Navbar
