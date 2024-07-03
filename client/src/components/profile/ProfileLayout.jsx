import { Outlet } from 'react-router-dom'
import FriendList from '../users/FriendList'

const ProfileLayout = () => {
    return (
        <div className="flex flex-row w-screen">
            {/* <div className="w-[60%] px-4 flex flex-col gap-4"> */}
            <div className="flex-grow px-4 flex flex-col gap-3 mt-4">
                <Outlet />
            </div>

            <div className="w-[20%] pt-4 px-4 h-full">
                <FriendList />
            </div>
        </div>
    )
}

export default ProfileLayout
