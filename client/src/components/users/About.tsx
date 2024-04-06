import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { MdOutlineEdit } from "react-icons/md";
import EditModal from "./EditModal.tsx";

const About = ({ userId }) => {
    // this user is myself, who is authenticated to use this app
    const currentUser = useAuthContext().user

    // this is the user that owns this profile page
    const [user, setUser] = useState<{
        currentCity: string,
        hometown: string,
        company: string,
        school: string,
        phone: string,
        email: string
    } | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

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
    }, [user])

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {
                !user ? <div>No User</div> :

                    <div className="grid grid-cols-1 md:grid-cols-2 text-[14px] relative">
                        {/* TODO: Set secret information */}
                        <div className="p-4 justify-start flex border">
                            Live in
                            <span className="font-bold ml-1">
                                {user.currentCity ? user.currentCity : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Came from
                            <span className="font-bold ml-1">
                                {user.hometown ? user.hometown : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Work at
                            <span className="font-bold ml-1">
                                {user.company ? user.company : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Study at
                            <span className="font-bold ml-1">
                                {user.school ? user.school : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Phone
                            <span className="font-bold ml-1">
                                {user.phone ? user.phone : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Email
                            <span className="font-bold ml-1">
                                {user.email ? user.email : ""}
                            </span>
                        </div>

                        {/* You are only allowed to edit if this is your profile page */}
                        {currentUser._id === userId &&
                            <div
                                onClick={handleEditClick}
                                className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#FFB302] w-8 h-8 rounded-full flex items-center justify-center">
                                <MdOutlineEdit size={20} />
                            </div>}

                        <EditModal
                            user={user}
                            userId={userId}
                            isOpen={isModalOpen}
                            onClose={handleCloseModal} />
                    </div>
            }
        </div>
    );
}

export default About;