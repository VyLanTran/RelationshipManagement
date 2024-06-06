import React from "react";
import { Link } from 'react-router-dom'

// TODO: show name when hovering over icon
interface GroupCardProps {
    group_name: string
    url: string
}

const GroupCard: React.FC<GroupCardProps> = ({ group_name, url }) => {
    return (
        <div className="bg-[#FFF] rounded-[10px] w-[40vh] h-[10vh] p-[2.5vh] m-[2vh] hover:bg-[#ffdc8b] focus:bg-[#FFB302]">
            <div>
                <Link to={url} title={group_name}>
                <p className="text-3xl pb-[2.5vh]"> {group_name} </p>
                </Link>
            </div>
        </div>        
    );
}

export default GroupCard;