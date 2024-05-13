import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'
import { RiBookletFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

const ConnectionGroup = ({total}) => {

    const [ groups, setGroups ] = useState([])
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

    const options = [{ value: "Everyone", label: "Everyone" }, ...groups.map(group => ({ value: group.name, label: group.name }))];

    console.log(groups)

    return (
        <div className="bg-[#FCAF58] rounded-[20px] w-[50vh] h-[84vh] p-[2.5vh] m-[2vh]">
            <Select placeholder="Select group:" className="text-left" options={ options } />
            <div>
                <div className="text-left ml-[6vh] mt-[10vh] text-[2.5vh]">
                    <div className="flex flex-row">
                        <RiBookletFill className="text-[6vh] mt-[0.5vh] mr-[1vh]"/>
                        <p><b>Total contacts:</b><br/><span className="text-white font-bold">{total}</span> contacts</p>
                    </div>
                    <div className="mt-[2vh] flex flex-row">
                        <IoPersonSharp className="text-[6vh] mt-[0.5vh] mr-[1vh]"/>
                        <p><b>Frst person here:</b><br/><span className="text-white font-bold">Jimmy Khang Nguyen</span></p>
                    </div>
                    <div className="mt-[2vh] flex flex-row">
                        <IoChatboxEllipses className="text-[6vh] mt-[0.5vh] mr-[1vh]"/>
                        <p><b>Most engaged with:</b><br/><span className="text-white font-bold">ttlraimu</span></p>
                    </div>
                    <div className="mt-[2vh] flex flex-row">
                        <IoDocumentText className="text-[6vh] mt-[0.5vh] mr-[1vh]"/>
                        <p><b>Total diary entries</b><br/><span className="text-white font-bold">74</span> entries</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConnectionGroup;