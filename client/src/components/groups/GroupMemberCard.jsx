import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdEdit } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'
import { IoPersonCircleSharp } from 'react-icons/io5'
import EditModal from '../connection/EditModal.jsx'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'

const GroupMemberCard = ({
    _id,
    name,
    userId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const token = useSelector((state) => state.auth.token)
    const [connection, setConnection] = useState('')

    const currentConnection = useSelector((state) => state.auth.user)

    const handleClick = async (e) => {
        e.preventDefault()

        const res = await fetch(`${BASE_URL}/connections/` + _id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        const updateConnectionIds = async () => {
            const res = await fetch(`${BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) {
                throw new Error('Network response was not ok')
            }
            const updateUser = await fetch(`${BASE_URL}/users/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    $pull: { connectionIds: _id },
                }),
            })
            if (!updateUser.ok) {
                throw new Error('Network response was not ok')
            }
        }
        updateConnectionIds()
        if (!res.ok) {
            throw new Error('Network response was not ok')
        }
    }

    useEffect(() => {
        const getConnection = async () => {
            const res = await fetch(
                `${BASE_URL}/connections/connection/${_id}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            const data = await res.json()

            if (res.ok) {
                setConnection(data)
            }
        }
        getConnection()
    }, [connection])

    const handleEditClick = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="h-[21vh] w-[67vh] bg-white rounded-[20px] flex mb-[4vh]">
            <IoPersonCircleSharp className="ml-[2vh] mt-[2.5vh] w-[16vh] h-[16vh]" />
            <div className="mt-[1vh] w-[43vh]">
                <h2 className="font-bold text-left text-[3.5vh] ml-[2vh]">
                    {name}
                </h2>
            </div>
            <div className="w-[8vh] h-[21vh] rounded-[20px] flex  flex-col items-center justify-around pt-[2vh] pb-[2vh] mr-[0.5vh]">
                <button
                    className="flex items-center justify-center font-azeret bg-[#FFB302] w-[6vh] text-[4vh] font-bold border h-[6vh] rounded-2xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                    onClick={handleEditClick}
                >
                    <MdEdit />
                </button>
                <EditModal
                    connection={connection}
                    connectionId={_id}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
                <button
                    onClick={handleClick}
                    className="flex items-center justify-center font-azeret bg-[#F85555] w-[6vh] text-[4vh] font-bold border h-[6vh] rounded-2xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                >
                    <FaTrashAlt />
                </button>
            </div>
        </div>
    )
}

export default GroupMemberCard
