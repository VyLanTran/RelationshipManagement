import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Profile = () => {

    // this user is myself, who is authenticated to use this app
    const currentUser = useAuthContext().user


    // this is the user that owns this profile page
    const [user, setUser] = useState<{ firstName: string } | null>(null);
    const { userId } = useParams();

    // fetch the data of this profile from the database once when we load this page
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
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
    }, [user, currentUser])



    return (
        user ?
            (<div className="flex flex-row w-screen">

                {/* Left sidebar */}
                <div className="w-[20%] bg-yellow-400">
                    left sidebar
                </div>
                {/* Main */}



                <div className="w-[60%] p-4">
                    {/* Profile navbar: background image, avatar, tabs */}
                    <div className="h-[450px] relative shadow-md">
                        <div className="h-[300px]">
                            <img
                                src="https://www.up.edu/admissions/images/banner-aerial-dec-2022.jpg"
                                alt="background"
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="flex gap-10 h-[150px] mt-[-75px]">

                            <div className="w-[150px] ml-[20px] bg-white rounded-full flex items-center justify-center">
                                <img
                                    src="https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg"
                                    alt="avatar"
                                    className="object-cover w-[140px] h-[140px] rounded-full"
                                />
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
                </div>

                {/* Right sidebar */}
                <div className="w-[20%] bg-blue-400">
                    right sidebar
                </div>

            </div>) :
            <div>User Not Found</div>

    );
}

export default Profile;