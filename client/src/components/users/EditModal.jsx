import React, { useEffect, useState } from "react";
// import { useAuthContext } from "../../hooks/useAuthContext";
import { useSelector } from 'react-redux'

const EditModal = ({ isOpen, onClose, user, userId }) => {
    // const currentUser = useAuthContext().user
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    const [userData, setUserData] = useState(user);

    const handleChange = (e) => {

        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleClose = () => {
        setUserData(user)
        onClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3001/users/${userId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(userData)
                })
            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            }

            handleClose();

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? "" : "hidden"}`}>
            <div className="bg-white p-8 rounded shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 text-[14px] gap-2">
                        <input type="text"
                            name='currentCity'
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Live in"
                            value={userData.currentCity}
                            onChange={handleChange}
                        />
                        <input type="text"
                            name='hometown'
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Came from"
                            value={userData.hometown}
                            onChange={handleChange}
                        />
                        <input type="text"
                            name='company'
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Work at"
                            value={userData.company}
                            onChange={handleChange}
                        />
                        <input type="text"
                            name='school'
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Study at"
                            value={userData.school}
                            onChange={handleChange}
                        />
                        <input type="text"
                            name='phone'
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Phone"
                            value={userData.phone}
                            onChange={handleChange}
                        />
                        <input type="text"
                            name='email'
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-[#FFB302] rounded-md hover:bg-[#ffc744]">
                            Save
                        </button>
                    </div>
                </form>
                {/* <button onClick={onClose} className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button> */}
            </div>
        </div>
    );
};

export default EditModal;
