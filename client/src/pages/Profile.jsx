import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.jsx";
import About from "../components/users/About.jsx";
import { useSelector } from "react-redux";
import { IoIosCamera } from "react-icons/io";
import UploadImageModal from "../components/users/UploadImageModal.jsx";


const Profile = () => {

    // this user is myself, who is authenticated to use this app
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    // this is the user that owns this profile page
    const [user, setUser] = useState(null)
    const { userId } = useParams();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

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

        // only allow currentUser to read this profile if they are authenticated
        if (currentUser) {
            getUser()
        }
    }, [user])

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
                        <div className="w-[60%] p-4 flex flex-col gap-4">
                            <div className="h-[450px] relative shadow-md bg-[#f5f2d9]">
                                <div className="h-[300px]">
                                    <img
                                        src="https://www.up.edu/admissions/images/banner-aerial-dec-2022.jpg"
                                        alt="background"
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                <div className="flex gap-10 h-[150px] mt-[-75px]">

                                    <div
                                        className="w-[150px] ml-[20px] bg-white rounded-full flex items-center justify-center relative"
                                        onClick={() => setIsUploadModalOpen(true)}>
                                        <img
                                            // src="https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg"
                                            src={user.profilePicture.url}
                                            alt="profilePicture"
                                            className="object-cover w-[140px] h-[140px] rounded-full"
                                        />
                                        {currentUser._id === userId &&
                                            <div
                                                className="absolute bottom-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-gray-300 rounded-full p-1.5 flex items-center justify-center"

                                            >
                                                <IoIosCamera size={28} />
                                            </div>
                                        }


                                    </div>


                                    <div className="flex items-center">
                                        <span className="text-[26px] font-bold mt-auto pb-[10%]">
                                            {user?.firstName}
                                        </span>
                                    </div>

                                </div>

                                <div className="flex flex-row gap-8 mt-6 pl-10 py-4">
                                    <div>Posts</div>
                                    <div>About</div>
                                    <div>Photos</div>
                                </div>
                            </div>

                            <div className="shadow-md bg-[#f5f2d9]">
                                <About userId={userId} />
                            </div>

                            <UploadImageModal
                                user={user}
                                userId={userId}
                                isOpen={isUploadModalOpen}
                                onClose={() => setIsUploadModalOpen(false)}
                            />
                        </div>

                        {/* Right sidebar */}
                        <div className="w-[20%] bg-blue-400">
                            right sidebar
                        </div>

                    </div> :
                    <div className="pt-[60px]">User Not Found</div>
            }
        </div>

    );
}

export default Profile;