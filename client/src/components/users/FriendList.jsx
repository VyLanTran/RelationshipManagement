import { useNavigate } from 'react-router-dom'

const FriendList = ({ friends }) => {
    return (
        <div className="w-full ">
            <div>Important Events</div>
            <div className="border-t border-gray-300 my-4 "></div>
            <div className="bg-[#faf9f2]">
                {friends.map(({ _id, name, profilePicture }) => {
                    return (
                        <FriendCard
                            key={_id}
                            friendId={_id}
                            name={name}
                            profilePictureUrl={
                                profilePicture ? profilePicture.url : null
                            }
                        />
                    )
                })}
            </div>
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
                    className="object-cover w-[28px] h-[28px] rounded-full bg-gray-300 "
                    src={'../../../assets/default-user.png'}
                    alt="profilePicture"
                />
            )}

            <span>{name}</span>
        </div>
    )
}
