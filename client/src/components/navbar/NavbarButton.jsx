import React from "react";
import { ReactElement } from "react";
import { IconType } from "react-icons";
import { NavLink } from 'react-router-dom'

const NavbarButton = ({ icon, name, url }) => {
    return (
        <NavLink to={url} title={name}>
            <div className="group h-[4vh] w-[4vh] flex flex-col items-center justify-center">
                <span>{icon}</span>
                <span className="mt-[3px] left-0 w-0 transition-all duration-150 h-[3px] bg-indigo-600 group-hover:w-full"></span>
            </div>
        </NavLink>
    );
}

export default NavbarButton;