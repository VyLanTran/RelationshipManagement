import React, { useEffect, useState } from 'react'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { IoSettings } from "react-icons/io5";
import Modal from 'react-modal'
import Navbar from '../components/navbar/Navbar.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import ConnectionCard from '../components/connection/ConnectionCard.jsx'
import Select from 'react-select'
import axios from 'axios'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'

// TODO: edit username, password here
const GroupProfile = () => {
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const authHeader = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    }
    const [group, setGroup] = useState(null)
    const { groupId } = useParams()
    const navigate = useNavigate()
    const [view, setView] = useState('diary')
    const [editGroup, setEditGroup] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [message, setMessage] = useState('')
    const [members, setMembers] = useState([])
    const [users, setUsers] = useState([])

    const toggleEdit = () => {
        setEditGroup(!editGroup)
    }

    const toggleDiaryView = () => {
        setView('diary')
    }

    const toggleMapView = () => {
        setView('map')
    }

    const toggleEventView = () => {
        setView('event')
    }

    const deleteGroup = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.delete(
                `${BASE_URL}/groups/${groupId}`,
                authHeader
            )
            navigate('/groups')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getGroup = async () => {
            const res = await fetch(`${BASE_URL}/groups/${groupId}`, authHeader)
            const data = await res.json()
            if (res.ok) {
                setGroup(data)
                setNewGroupName(data.name)
            }
            const res_2 = await fetch(
                `${BASE_URL}/groups/${groupId}/members`,
                authHeader
            )
            const data_2 = await res_2.json()
            if (res_2.ok) {
                setMembers(data_2)
            }
            const res_3 = await fetch(`${BASE_URL}/users`, authHeader)
            const data_3 = await res_3.json()
            if (res_3.ok) {
                setUsers(data_3)
            }
        }
        if (currentUser) {
            getGroup()
        }
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault()
        setMessage('')
        console.log(members)
        try {
            const res = await axios.put(
                `${BASE_URL}/groups/${groupId}`,
                {
                    name: newGroupName,
                    members: members,
                },
                authHeader
            )
            setMessage('Group edited sucessfully!')
        } catch (error) {
            setMessage(error.response.data['message'])
        }
    }

    const addMember = async (event) => {
        event.preventDefault()
        setMembers([...members, { name: ' ', _id: null }])
    }

    const option = users.map(({ name, _id }) => ({
        value: _id,
        label: name,
    }))

    return (
        <div className="">
            <Navbar />
            {group ? (
                <div className="pt-[60px] flex flex-row h-screen p-[3vh]">
                    <div className="w-[25%] my-[3vh] mr-[1.5vh]">
                        <div className="h-[86vh] bg-[#FFF] rounded-[20px] mb-[1.5vh] p-[2vh]">
                            <div className="flex flex-row items-center justify-center">
                                <p className="text-3xl m-[2vh]">{newGroupName}</p>
                                <button
                                    onClick={toggleEdit}
                                    className="flex items-center justify-center w-[4.5vh] text-[4vh] font-bold h-[4.5vh] rounded-[1vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                >
                                    <IoSettings />
                                </button>
                                <Modal
                                className="flex justify-center items-center"
                                isOpen={editGroup}
                                onRequestClose={toggleEdit}
                                shouldCloseOnOverlayClick={true}
                                >
                                <div className="bg-[#fff] border-2 border-[#FFB302] rounded-[20px] w-[100vh] h-[100%] p-[2.5vh] mt-[10vh] content-center">
                                    <p className="text-3xl m-[3vh]">
                                        Edit Group
                                    </p>
                                    <div className="m-[3vh] grid grid-cols-5 gap-[5vh] items-center">
                                        <p className="text-xl m-[3vh]">Name:</p>
                                        <input
                                            className="rounded-[10px] px-[3vh] py-[2vh] col-span-4"
                                            placeholder={group['name']}
                                            id="name"
                                            name="name"
                                            value={newGroupName}
                                            onChange={(e) =>
                                                setNewGroupName(e.target.value)
                                            }
                                        />
                                        <p className="text-xl m-[3vh]">
                                            Members:
                                        </p>
                                        <ul className="col-span-4">
                                            {members.map((member, index) => (
                                                <li className="flex justify-between px-[3vh] py-[1vh]">
                                                    <Select
                                                        placeholder={
                                                            member['name']
                                                        }
                                                        className="text-left w-[45vh]"
                                                        options={option}
                                                        onChange={(
                                                            newValue
                                                        ) => {
                                                            members[index] =
                                                                users.find(
                                                                    (user) =>
                                                                        user[
                                                                            '_id'
                                                                        ] ===
                                                                        newValue.value
                                                                )
                                                            setMembers(members)
                                                        }}
                                                    />
                                                    <button
                                                        className="rounded-[10px] bg-[#FFB302] px-[3vh] py-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                                        onClick={() => {
                                                            setMembers(
                                                                members.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index
                                                                )
                                                            )
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            className="rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] col-span-5 hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                            onClick={addMember}
                                        >
                                            Add new members
                                        </button>
                                    </div>

                                    <button
                                        className="ml-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                        onClick={onSubmit}
                                    >
                                        Submit
                                    </button>
                                    <p className="text-red-500 mt-[2vh]">
                                        {message}
                                    </p>
                                </div>
                            </Modal>
                            </div>
                            <div>
                                {members.map((member) => (
                                    <div className='w-[100%] rounded-[10px] h-[13vh] border-[5px] border-black bg-[#EEEEEE] mt-[1vh] pt-[0.6vh]'>
                                        <div className='flex flex-col items-center justify-center'>
                                            <IoPersonCircleSharp className="w-[7vh] h-[7vh]" />
                                            <p className="text-xl">{member['name']}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-[75%] ml-[1.5vh] rounded-[20px]">
                        <div className="m-[2vh] h-[6vh]">
                            <button
                                className="font-bold w-[18vh] mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-xl h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleDiaryView}
                            >
                                Diary
                            </button>
                            <button
                                className="font-bold w-[18vh] mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-xl h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleEventView}
                            >
                                Event
                            </button>
                            <button
                                className="font-bold w-[18vh] mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-xl h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleMapView}
                            >
                                Location
                            </button>
                        </div>
                        <div className='bg-[#FFF] h-[79vh] rounded-[20px]'>
                            <p>{view}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-[60px]">Group not found</div>
            )}
        </div>
    )
}

export default GroupProfile
