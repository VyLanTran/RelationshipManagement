import { Outlet } from 'react-router-dom'
import FriendList from '../users/FriendList'

const ProfileLayout = () => {
    return (
        <div className="flex flex-row w-screen">
            <div className="w-[25%]">
                <div>Important Events</div>
                <div className="border-t border-gray-300 my-4 "></div>
            </div>

            {/* <div className="w-[60%] px-4 flex flex-col gap-4"> */}
            <div className="flex-grow px-4 flex flex-col gap-4">
                <Outlet />
            </div>

            <div className="w-[20%] p-4">
                <FriendList />
            </div>
        </div>
    )
}

export default ProfileLayout
