import React, { useEffect, useState } from 'react'
import { Settings, CircleUserRound } from "lucide-react";
import Navbar from '../components/navbar/Navbar.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { EditGroupModal } from '../components/groups/EditGroupModal.jsx';
import { DiaryModal } from '../components/groups/DiaryModal.jsx';

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
    const [view, setView] = useState('diary')
    const [newGroupName, setNewGroupName] = useState('')
    const [members, setMembers] = useState([])

    const toggleDiaryView = () => {
        setView('diary')
    }

    const toggleMapView = () => {
        setView('map')
    }

    const toggleEventView = () => {
        setView('event')
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
        }
        if (currentUser) {
            getGroup()
        }
    }, [])

    return (
        <div className="">
            <Navbar />
            {group ? (
                <div className="pt-[60px] flex flex-row h-screen p-[1vh]">
                    <div className="w-[25%] my-[1.5vh] mr-[1.5vh]">
                        <div className="h-[87.5vh] bg-[#FFF] rounded-[10px] mb-[1.5vh] p-[2vh]">
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-3xl ml-[1.5vh] mb-[1vh] font-bold">{newGroupName}</p>
                                <TooltipProvider>
                                    <Tooltip>
                                        <EditGroupModal currentGroup={group} members={members}>
                                            <TooltipTrigger asChild>
                                            <button
                                                className="text-slate-400 hover:text-black mb-[5px] mr-[1.5vh] mb-[1vh]"
                                                variant="outline" size="icon">
                                                <Settings size={36} strokeWidth={1.5} absoluteStrokeWidth />
                                            </button>
                                            </TooltipTrigger>
                                        </EditGroupModal>
                                        <TooltipContent className="bg-gray-100">
                                            <p>Edit Group</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className='mt-[2vh]'>
                                {members.map((member) => (
                                    <div className='w-[100%] rounded-[5px] mt-[1vh] ml-[2vh]'>
                                        <div className='flex flex-row items-center justify-left'>
                                            <CircleUserRound strokeWidth={1.5} className="w-[30px] h-[30px] mx-[2vh]" />
                                            <p className="text-xl">{member['name']}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-[75%] rounded-[10px]">
                        <div className="m-[1.5vh] h-[6vh]">
                            <button
                                className="w-[18vh] mx-[0.5vh] bg-[#FFF] rounded-[5px] bg-[#FFB302] px-[3vh] text-xl h-[6vh] hover:bg-[#ffdc8b] focus:bg-[#FFB302]"
                                onClick={toggleDiaryView}
                            >
                                Diary
                            </button>
                            <button
                                className="w-[18vh] mx-[0.5vh] bg-[#FFF] rounded-[5px] bg-[#FFB302] px-[3vh] text-xl h-[6vh] hover:bg-[#ffdc8b] focus:bg-[#FFB302]"
                                onClick={toggleEventView}
                            >
                                Event
                            </button>
                            <button
                                className="w-[18vh] mx-[0.5vh] bg-[#FFF] rounded-[5px] px-[3vh] text-xl h-[6vh] hover:bg-[#ffdc8b] focus:bg-[#FFB302]"
                                onClick={toggleMapView}
                            >
                                Location
                            </button>
                        </div>
                        <div className='bg-[#FFF] h-[80vh] rounded-[10px]'>
                            {
                                view == "diary" ?
                                    <DiaryModal group={group}/>
                                : 
                                    <p>{view}</p>
                            }
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
