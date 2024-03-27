import React from "react";
import { ReactElement } from "react";
import { IconType } from "react-icons";
import { NavLink } from 'react-router-dom'

// TODO: show name when hovering over icon
interface NavbarButtonProps {
    icon: ReactElement<IconType>
    name: string
    url: string
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ icon, name, url }) => {
    return (
        <NavLink to={url} title={name}>
            <div>
                {icon}
            </div>
        </NavLink>
    );
}

export default NavbarButton;