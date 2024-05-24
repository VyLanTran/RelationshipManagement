import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'

const Layout = () => {
    return (
        <div>
            <Navbar />
            <div className="pt-[60px]">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
