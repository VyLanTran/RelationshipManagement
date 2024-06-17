import { Outlet } from 'react-router-dom'
import NavbarNotAuth from '../navbar/NavbarNotAuth'

const LayoutNotAuth = () => {
    return (
        <div>
            <NavbarNotAuth />
            <div className="pt-[60px]">
                <Outlet />
            </div>
        </div>
    )
}

export default LayoutNotAuth
