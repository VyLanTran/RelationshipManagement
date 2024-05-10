import React from 'react'
import NavbarButton from './NavbarButton.tsx'
import logo from './logo.png'
import { RiBookletFill } from 'react-icons/ri'
import { FaBell } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { useLogout } from '../../hooks/useLogout.js'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosContacts } from 'react-icons/io'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { FaMap } from 'react-icons/fa'
import { useSelector } from 'react-redux'

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
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        // TODO: use shadcn menu
        <div className="fixed h-[56px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
            <div
                onClick={() => navigate('/')}
                className="cursor-pointer font-bold"
            >
                <img className="ml-[10vh] h-[5vh]" src={logo}/>
            </div>
            <div className="flex flex-row gap-4 items-center">
                {/* TODO: use tooltips for these buttons */}
                <NavbarButton
                    icon={<RiBookletFill size={23} />}
                    name="My space"
                    url="/diary"
                    className="no-underline hover:underline"
                />
                <NavbarButton
                    icon={<FaBell size={23} />}
                    name="Notifications"
                    url="/notification"
                    className="no-underline hover:underline"
                />
                <NavbarButton
                    icon={<FaMap size={23} />}
                    name="Map"
                    url="/map"
                    className="no-underline hover:underline"
                />
                <NavbarButton
                    icon={<FaCalendarAlt size={23} />}
                    name="Event"
                    url="/events"
                />
                <NavbarButton
                    icon={<IoIosContacts size={28} />}
                    name="Connection"
                    url={`/connection/${user._id}`}
                    className="no-underline hover:underline"
                />
                <NavbarButton
                    icon={<IoChatbubbleEllipses size={23} />}
                    name="Chats"
                    url="/chats"
                    className="no-underline hover:underline"
                />

                <DropdownMenuDemo user={user} handleLogout={handleLogout} />
            </div>
        </div>
    )
}

function DropdownMenuDemo({ user, handleLogout }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className=" w-[24px] h-[24px] rounded-full">
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

                <div onClick={handleLogout}>
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Navbar
