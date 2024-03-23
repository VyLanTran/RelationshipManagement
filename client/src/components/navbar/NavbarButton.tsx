import React from "react";
import { ReactElement } from "react";
import { IconType } from "react-icons";
import { Link } from 'react-router-dom'

// TODO: show name when hovering over icon
interface NavbarButtonProps {
    icon: ReactElement<IconType>
    name: string
    // url
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ icon, name }) => {
    return (
        <Link to='/' title={name}>
            <div>
                {icon}
            </div>

        </Link>
    );
}

export default NavbarButton;