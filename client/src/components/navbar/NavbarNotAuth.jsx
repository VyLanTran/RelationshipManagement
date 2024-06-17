import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { Button } from '../ui/button.jsx'
import logo from './logo.png'

const NavbarNotAuth = () => {
    const navigate = useNavigate()

    return (
        <div className="fixed h-[60px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
            <div
                onClick={() => navigate('/')}
                className="cursor-pointer font-bold"
            >
                <img className="h-[36px]" src={logo} alt="Logo" />
            </div>
            <div className="flex flex-row gap-4 items-center">
                <Button
                    className="font-bold"
                    onClick={() => navigate('/login')}
                >
                    Log In
                </Button>
            </div>
        </div>
    )
}

export default NavbarNotAuth
