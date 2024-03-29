import React from "react";
import { FaUserLarge } from "react-icons/fa6";
import NavbarButton from "./NavbarButton.tsx";
import { FaGear } from "react-icons/fa6";
import { RiBookletFill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { MdLogout } from "react-icons/md";

const Navbar = () => {

    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="fixed h-[60px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
            <div>Logo</div>
            <div className="flex flex-row gap-4 items-center">
                <NavbarButton icon={<RiBookletFill size={18} />} name="My space" url="/home" />
                <NavbarButton icon={<FaBell size={18} />} name="Notifications" url="/notification" />
                <NavbarButton icon={<FaGear size={18} />} name="Settings" url="/setting" />

                {
                    user ?
                        <div className="flex flex-row items-center gap-4">
                            <span>{user.user.username}</span>
                            {/* Log out */}
                            <button
                                onClick={handleLogout}
                            >
                                <MdLogout size={20} />
                            </button>

                        </div> :
                        <div className="flex flex-row items-center gap-4">
                            <Link to='/'>Log in</Link>
                            <Link to='/signup'>Sign up</Link>
                        </div>
                }

            </div>
        </div>
    );
}

export default Navbar;