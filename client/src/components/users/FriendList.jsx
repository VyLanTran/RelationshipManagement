const FriendList = ({ friends }) => {
    return (
        <div
            className="w-full ">
            <div>
                Important Events
            </div>
            <div className="border-t border-gray-300 my-4 "></div>
            <div className="bg-[#faf9f2]">
                {
                    friends.map(
                        ({ _id, firstName, lastName, profilePicture }) => {
                            return (
                                <FriendCard
                                    name={firstName + " " + lastName}
                                    profilePictureUrl={profilePicture ? profilePicture.url : null}
                                />
                            )
                        })
                }

            </div>
        </div>
    );
}

export default FriendList;
// TODO: avoid relative path like ../../, instead @components/
export const FriendCard = ({ name, profilePictureUrl }) => {
    return (
        <div className="flex flex-row text-[14px] cursor-pointer items-center gap-3 p-3 rounded-sm hover:bg-[#eaead4] hover:bg-opacity-50" >
            < div className="w-[28px] h-[28px] rounded-full flex items-center justify-centers" >
                {
                    profilePictureUrl ?
                        <img
                            src={profilePictureUrl}
                            alt="profilePicture"
                            className="object-cover w-[28px] h-[28px] rounded-full"
                        /> :
                        <img
                            className="object-cover w-[28px] h-[28px] rounded-full bg-gray-300 "
                            src={'../../../assets/default-user.png'}
                            alt="profilePicture"
                        />
                }
            </ div>

            <span>{name}</span>
        </div >
    )
}