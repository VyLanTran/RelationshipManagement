import React from "react";
import { Link } from 'react-router-dom'

// TODO: show name when hovering over icon
interface GroupCardProps {
    group_name: string
    url: string
    participants: string[]
}

const GroupMap: React.FC<GroupCardProps> = ({ group_name, participants, url }) => {
    return (
        <div className="bg-[#FFB302] rounded-[20px] w-[50vh] h-[84vh] p-[2.5vh] m-[2vh]">
            <div>
                <p className="text-3xl pb-[2.5vh]"> {group_name} </p>
            </div>
            <div className="text-left pl-[3vh]">
                {participants.map(participant => <p className="text-xl">{participant}</p>)}
            </div>
        </div>
    );
}

export default GroupMap;