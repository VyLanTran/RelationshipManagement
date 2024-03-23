import React from "react";
import { FaUserLarge } from "react-icons/fa6";
import NavbarButton from "./NavbarButton.tsx";
import { FaGear } from "react-icons/fa6";
import { RiBookletFill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";


const Navbar = () => {
    return (
        <div className="fixed h-[60px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
            {/* Logo */}
            <div>Logo</div>
            {/* Links */}
            <div className="flex flex-row gap-4 items-center">
                <NavbarButton icon={<RiBookletFill size={18} />} name="My space" />
                <NavbarButton icon={<FaBell size={18} />} name="Notifications" />
                <NavbarButton icon={<FaGear size={18} />} name="Settings" />
                <NavbarButton icon={<FaUserLarge size={18} />} name="Profile" />

            </div>
        </div>
    );
}

export default Navbar;