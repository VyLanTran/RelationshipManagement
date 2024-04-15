import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.jsx";
import About from "../components/users/About.jsx";
import { useSelector } from "react-redux";
import { IoIosCamera } from "react-icons/io";
import UploadImageModal from "../components/users/UploadImageModal.jsx";
import FriendList from "../components/users/FriendList.jsx";


const Profile = () => {

    // this user is myself, who is authenticated to use this app
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const friendIds = useSelector((state) => state.auth.user.friendIds)

    // this is the user that owns this profile page
    const [user, setUser] = useState(null)
    const { userId } = useParams();
    const [friends, setFriends] = useState([])
    const isFriend = friendIds.includes(userId)

    const [isProfilePictureOpen, setIsProfilePictureOpen] = useState(false)
    const [isCoverPhotoOpen, setIsCoverPhotoOpen] = useState(false)

    // fetch the data of this profile from the database once when we load this page
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const data = await res.json()

            if (res.ok) {
                setUser(data)
            }
        }

        const getFriends = async () => {
            const res = await fetch(`http://localhost:3001/users/${currentUser._id}/friends`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()

            if (res.ok) {
                setFriends(data)
            }
        }

        // only allow currentUser to read this profile if they are authenticated
        if (currentUser) {
            getUser()
            getFriends()
        }
    }, [user, userId])
    // TODO: degree of connection, can only see those within 3 for privacy
    return (
        <div>
            <Navbar />
            {
                user ?
                    <div className="flex flex-row w-screen pt-[60px] ">

                        {/* Left sidebar */}
                        <div className="w-[20%] bg-yellow-400">
                            left sidebar
                        </div>
                        {/* Main */}
                        <div className="w-[60%] px-4 flex flex-col gap-4">
                            <div className="h-[450px] relative shadow-md bg-[#fffdf0]">
                                <div
                                    className="h-[300px] relative"
                                    onClick={() => setIsCoverPhotoOpen(true)}
                                >
                                    {
                                        user.coverPhoto ?
                                            <img
                                                src={user.coverPhoto.url}
                                                alt="background"
                                                className="object-cover w-full h-full"
                                            /> :
                                            <div
                                                className="object-cover w-full h-full bg-[#f0cb87]"
                                            ></div>
                                    }
                                    {currentUser._id === userId &&
                                        <div
                                            className="absolute bottom-0 right-0 mr-[1%] mb-[1%] bg-gray-100 hover:bg-gray-200 rounded-md  p-1.5 flex items-center justify-center flex-row gap-2 text-sm cursor-pointer"
                                        >
                                            <IoIosCamera size={22} />
                                            <span> Add cover photo </span>
                                        </div>
                                    }
                                </div>

                                <div className="flex gap-10 h-[150px] mt-[-75px]">

                                    <div
                                        className="w-[150px] ml-[20px] bg-gray-100 rounded-full flex items-center justify-center relative cursor-pointer"
                                        onClick={() => setIsProfilePictureOpen(true)}>
                                        {
                                            user.profilePicture ?
                                                <img
                                                    src={
                                                        user.profilePicture.url
                                                    }
                                                    alt="profilePicture"
                                                    className="object-cover w-[140px] h-[140px] rounded-full"
                                                /> :
                                                <img
                                                    src="../../../assets/default-user.png"
                                                    alt="profilePicture"
                                                    className="object-cover w-[100px] h-[100px] rounded-full"
                                                />
                                        }
                                        {currentUser._id === userId &&
                                            <div
                                                className="absolute bottom-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 flex items-center justify-center"

                                            >
                                                <IoIosCamera size={28} />
                                            </div>
                                        }


                                    </div>


                                    <div className="flex items-center flex-row justify-center mt-[75px]">
                                        <span className="text-[26px] ">
                                            {user.firstName} {" "} {user.lastName}
                                        </span>

                                    </div>
                                    <div className="mt-[75px] flex items-center ml-auto text-[14px] pr-2 gap-2">
                                        {
                                            currentUser._id !== userId && isFriend &&
                                            <button
                                                className=" bg-[#FFB302]  py-1 px-4 rounded-md"
                                            >
                                                Message
                                            </button>
                                        }
                                        {/* TODO: pending friend request */}
                                        {
                                            currentUser._id !== userId &&
                                            <div >
                                                {
                                                    isFriend ?
                                                        <button
                                                            className=" bg-gray-300 py-1 px-4 rounded-md"
                                                        >
                                                            Friends
                                                        </button> :
                                                        <button
                                                            className=" bg-gray-300 py-1 px-4 rounded-md"
                                                        >
                                                            Add friend
                                                        </button>
                                                }
                                            </div>
                                        }
                                    </div>

                                </div>
                                <div className="border-t border-gray-300 mt-4 mb-2"></div>
                                <div className="flex flex-row gap-8 pl-10 py-2 text-[14px]">
                                    <div>Posts</div>
                                    <div>About</div>
                                    <div>Photos</div>
                                </div>
                            </div>

                            <div className="shadow-md bg-[#fffdf0]">
                                <About userId={userId} />
                            </div>

                            <UploadImageModal
                                user={user}
                                userId={userId}
                                isOpen={isProfilePictureOpen}
                                onClose={() => setIsProfilePictureOpen(false)}
                                isProfilePicture={true}
                            />
                            <UploadImageModal
                                user={user}
                                userId={userId}
                                isOpen={isCoverPhotoOpen}
                                onClose={() => setIsCoverPhotoOpen(false)}
                                isProfilePicture={false}
                            />
                        </div>

                        {/* Right sidebar */}
                        <div className="w-[20%] p-4">
                            <FriendList
                                friends={friends} />
                        </div>

                    </div> :
                    <div className="pt-[60px]">User Not Found</div>
            }
        </div >

    );
}

export default Profile;