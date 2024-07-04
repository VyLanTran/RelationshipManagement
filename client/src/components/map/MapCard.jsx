import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { CircleUserRound } from "lucide-react";
import { FaTrashAlt } from 'react-icons/fa'
import { IoPersonCircleSharp } from 'react-icons/io5'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'

const ConnectionGroup = ({connections, currGroup, setCurrGroup, checkRefresh, setCheckRefresh, mapMarkers, setMapMarkers, setConnections}) => {

    console.log(connections)
    const [groups, setGroups] = useState([])
    const user = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const authHeader = { headers: { Authorization: `Bearer ${token}`} }

    useEffect(() => {
        // fetch groups
        const fetchGroups = async () => {
            const res_groups = await fetch(
                `${BASE_URL}/groups/user/${user._id}`,
                authHeader
            )
            const data_groups = await res_groups.json()
            if (res_groups.ok) {
                setGroups(data_groups)
            }
        }

        if (user) {
            fetchGroups()
        }
    }, [])

    const handleGroupChange = async (currGroup) => {
        await mapMarkers.forEach(marker => {
            marker.map = null;
        });
        await setMapMarkers([])
        await setConnections([])
        await setCurrGroup(currGroup.value)
        await setCheckRefresh(!checkRefresh)
    }

    const options = [{ value: "Everyone", label: "Everyone" }, ...groups.map(group => ({ value: group._id, label: group.name }))];

    return (
        <div className="bg-[#ffffff] rounded-[20px] w-[52vh] h-[87vh] p-[2.5vh] m-[2vh] overflow-x-hidden overflow-y-auto">
            <Select onChange={handleGroupChange} placeholder="Select group:" className="text-left" options={ options } />
            <div className="mt-[2vh]">
                {connections.map((member) => (
                    <div className="flex flex-row justify-between items-center w-[45vh] bg-gray-200 rounded-[20px] mt-[2vh] pr-[1vh]">
                        <IoPersonCircleSharp className="ml-[2vh] text-[10vh]" />
                        <div className="mt-[1vh] w-[43vh] ml-[2vh] leading-7">
                            <h2 className="font-bold text-left text-[3vh]">
                                {member.name}
                            </h2>
                            {member.currentCity ? (
                                <div className="text-left text-[2.3vh] mb-[1vh] leading-6 mt-[6px]">
                                    <p>
                                        <b className="text-gray-900">Location:</b> {member.currentCity}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-left text-[2.3vh] mb-[1vh] leading-6 mt-[6px]">
                                    <p>
                                        <b className="text-gray-900">Location:</b> Unknown
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConnectionGroup;