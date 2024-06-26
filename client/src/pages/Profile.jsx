import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import About from '../components/users/About.jsx'
import { useSelector } from 'react-redux'
import { IoIosCamera } from 'react-icons/io'
import UploadImageModal from '../components/users/UploadImageModal.jsx'
import BASE_URL from '@/../../constants.js'
import { FaUserCheck } from 'react-icons/fa6'
import { FaUserPlus } from 'react-icons/fa6'

const Profile = () => {
    // this user is myself, who is authenticated to use this app
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const friendIds = useSelector((state) => state.auth.user.friendIds)

    // this is the user that owns this profile page
    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const [isFriend, setIsFriend] = useState(false)

    const [isProfilePictureOpen, setIsProfilePictureOpen] = useState(false)
    const [isCoverPhotoOpen, setIsCoverPhotoOpen] = useState(false)

    // fetch the data of this profile from the database once when we load this page
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`${BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()

            if (res.ok) {
                setUser(data)
            }
        }

        // only allow currentUser to read this profile if they are authenticated
        if (currentUser) {
            getUser()
            setIsFriend(friendIds.includes(userId))
        }
    }, [user, userId])

    // TODO: degree of connection, can only see those within 3 for privacy
    return (
        <div className="w-full">
            {user ? (
                <div className="flex flex-row w-full">
                    <div className="w-full flex flex-col gap-4">
                        <div className="h-[450px] relative shadow-md bg-[#fffdf0]">
                            <div
                                className="h-[300px] relative"
                                onClick={() => setIsCoverPhotoOpen(true)}
                            >
                                {user.coverPhoto ? (
                                    <img
                                        src={user.coverPhoto.url}
                                        alt="background"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="object-cover w-full h-full bg-[#f0cb87]"></div>
                                )}
                                {currentUser._id === userId && (
                                    <div className="absolute bottom-0 right-0 mr-[1%] mb-[1%] bg-gray-100 hover:bg-gray-200 rounded-md  p-1.5 flex items-center justify-center flex-row gap-2 text-sm cursor-pointer">
                                        <IoIosCamera size={22} />
                                        <span> Add cover photo </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-10 h-[150px] mt-[-75px]">
                                <div
                                    className="w-[150px] ml-[20px] bg-white rounded-full flex items-center justify-center relative cursor-pointer"
                                    onClick={() =>
                                        setIsProfilePictureOpen(true)
                                    }
                                >
                                    <img
                                        src={user.profilePicture?.url}
                                        alt="profilePicture"
                                        className="object-cover  w-[150px]  h-[150px] rounded-full "
                                    />
                                    {currentUser._id === userId && (
                                        <div className="absolute bottom-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 flex items-center justify-center">
                                            <IoIosCamera size={28} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center flex-row justify-center mt-[75px]">
                                    <span className="text-[26px] ">
                                        {user.name}
                                    </span>
                                </div>
                                <div className="mt-[75px] flex items-center ml-auto text-[14px] pr-2 gap-2">
                                    {currentUser._id !== userId && (
                                        <div>
                                            {isFriend ? (
                                                <div className="flex flex-row bg-[#FFB302] py-1 px-3 rounded-md items-center gap-2">
                                                    <FaUserCheck />
                                                    <button>Friends</button>
                                                </div>
                                            ) : (
                                                <div className="bg-[#FFB302] py-1 px-3 rounded-md flex flex-row gap-2 items-center">
                                                    <FaUserPlus />
                                                    <button>Add friend</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {currentUser._id !== userId && isFriend && (
                                        <button className="bg-gray-300  py-1 px-4 rounded-md">
                                            Message
                                        </button>
                                    )}
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
                </div>
            ) : (
                <div>User Not Found</div>
            )}
        </div>
    )
}

export default Profile
