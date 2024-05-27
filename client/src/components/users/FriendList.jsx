import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const FriendList = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const friendIds = useSelector((state) => state.auth.user.friendIds)
    const [friends, setFriends] = useState([])

    useEffect(() => {
        const getFriends = async () => {
            const res = await fetch(
                `${BASE_URL}/users/${currentUser._id}/friends`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            const data = await res.json()

            if (res.ok) {
                setFriends(data)
            }
        }

        getFriends()
    }, [])

    return (
        <div className="w-full bg-white">
            {friends.map(({ _id, name, profilePicture }) => {
                return (
                    <FriendCard
                        key={_id}
                        friendId={_id}
                        name={name}
                        profilePictureUrl={profilePicture?.url}
                    />
                )
            })}
        </div>
    )
}

export default FriendList
// TODO: avoid relative path like ../../, instead @components/
// TODO: a green dot for active users
export const FriendCard = ({ friendId, name, profilePictureUrl }) => {
    const navigate = useNavigate()

    return (
        <div
            className="flex flex-row text-[13px] cursor-pointer items-center gap-3 p-3 rounded-sm hover:bg-[#eaead4] hover:bg-opacity-50"
            onClick={() => navigate(`/${friendId}`)}
        >
            {profilePictureUrl ? (
                <img
                    src={profilePictureUrl}
                    alt="profilePicture"
                    className="object-cover w-[28px] h-[28px] rounded-full"
                />
            ) : (
                <img
                    className="object-cover w-[28px] h-[28px] rounded-full"
                    src="https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                    alt="profilePicture"
                />
            )}

            <span>{name}</span>
        </div>
    )
}
