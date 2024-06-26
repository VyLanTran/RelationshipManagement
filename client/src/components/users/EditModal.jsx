import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../state/authReducer'
import BASE_URL from '@/../../constants.js'

const EditModal = ({ isOpen, onClose, user, userId }) => {
    // TODO: close button on top right corner, and go out by either clicking on that button, or anywhere outside of the modal
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()

    const autoCompleteCurrentCityRef = useRef(null)
    const inputCurrentCityRef = useRef(null)

    const autoCompleteHometownRef = useRef(null)
    const inputHometownRef = useRef(null)

    const [userData, setUserData] = useState(user)

    useEffect(() => {
        autoCompleteCurrentCityRef.current = new window.google.maps.places.Autocomplete(inputCurrentCityRef.current)
        autoCompleteCurrentCityRef.current.addListener('place_changed', handleCurrentCityChange)

        autoCompleteHometownRef.current = new window.google.maps.places.Autocomplete(inputHometownRef.current)
        autoCompleteHometownRef.current.addListener('place_changed', handleHometownChange)
    }, [userData])

    const handleCurrentCityChange = async () => {
        const place = await autoCompleteCurrentCityRef.current.getPlace()
        setUserData({ ...userData, currentCity: place.formatted_address })
    }

    const handleHometownChange = async () => {
        const place = await autoCompleteHometownRef.current.getPlace()
        setUserData({ ...userData, hometown: place.formatted_address })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value,
        })
    }

    const handleClose = () => {
        setUserData(user)
        onClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/users/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            } else {
                //  store info of updated user into redux store
                dispatch(
                    updateUser({
                        user: json,
                    })
                )
                handleClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}
        >
            <div className="bg-white p-8 rounded shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 text-[14px] gap-2">
                        <input
                            type="text"
                            name="currentCity"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Live in"
                            ref={inputCurrentCityRef}
                        />
                        <input
                            type="text"
                            name="hometown"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Came from"
                            ref={inputHometownRef}
                        />
                        <input
                            type="text"
                            name="company"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Work at"
                            value={userData.company}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="school"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Study at"
                            value={userData.school}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                            placeholder="Phone"
                            value={userData.phone}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="email"
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
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-[#FFB302] rounded-md hover:bg-[#ffc744]"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditModal
