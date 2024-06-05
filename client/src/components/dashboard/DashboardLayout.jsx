import React, { useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { MdOutlineDashboard } from 'react-icons/md'
import { AiOutlineUser } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { BsGlobeAmericas } from 'react-icons/bs'

const Dashboard = () => {
    const menus = [
        {
            name: 'Dashboard',
            link: '/dashboard',
            icon: <MdOutlineDashboard size={20} />,
        },
        {
            name: 'Friends Information',
            link: '/dashboard/friendInfo',
            icon: <AiOutlineUser size={20} />,
        },
        {
            name: 'Friends Location',
            link: '/dashboard/friendGeography',
            icon: <BsGlobeAmericas size={20} />,
        },
    ]
    const [open, setOpen] = useState(true)

    return (
        <section className="flex">
            <div
                className={`bg-white min-h-screen ${
                    open ? 'w-[220px]' : 'w-16'
                } duration-500`}
            >
                <div
                    className={`py-3 px-4 flex mt-2 ${open ? 'justify-end' : 'justify-center'}`}
                >
                    <HiMenu
                        size={20}
                        className="cursor-pointer"
                        onClick={() => setOpen(!open)}
                    />
                </div>
                <div className="mt-4 flex flex-col relative">
                    {menus?.map((menu, i) => (
                        <NavLink
                            end
                            to={menu?.link}
                            key={i}
                            className={({ isActive }) =>
                                `group flex items-center text-sm font-medium p-2 hover:bg-gray-100 px-6 ${
                                    menu.margin && 'mt-5'
                                } ${!open ? 'justify-center' : ''} ${
                                    isActive ? 'bg-gray-200' : ''
                                }`
                            }
                        >
                            <div>
                                <div className="relative flex items-center gap-4">
                                    <div>{menu.icon}</div>
                                    <h2
                                        className={`whitespace-pre  ${
                                            !open
                                                ? 'absolute opacity-0'
                                                : 'relative'
                                        }`}
                                    >
                                        {menu?.name}
                                    </h2>
                                </div>
                                <h2
                                    className={`${
                                        open && 'hidden'
                                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                                >
                                    {menu?.name}
                                </h2>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className="flex-grow  min-h-screen bg-[#ececef] ">
                <Outlet />
            </div>
        </section>
    )
}

export default Dashboard
