import React from "react";
import { Link } from 'react-router-dom'

// TODO: show name when hovering over icon
interface GroupCardProps {
    group_name: string
    url: string
    participants: string[]
}

const GroupCard: React.FC<GroupCardProps> = ({ group_name, participants, url }) => {
    return (
        <div className="bg-[#FFF] rounded-[10px] w-[40vh] h-[40vh] p-[2.5vh] m-[2vh] hover:bg-[#ffdc8b] focus:bg-[#FFB302]">
            <div>
                <Link to={url} title={group_name}>
                    <p className="text-3xl pb-[2.5vh]"> {group_name} </p>
                </Link>
            </div>
            <div className="text-left pl-[3vh]">
                {participants.map(participant => <p className="text-xl">{participant}</p>)}
            </div>
        </div>
    );
}

export default GroupCard;