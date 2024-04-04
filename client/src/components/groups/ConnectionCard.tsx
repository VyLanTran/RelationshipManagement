import React from "react";
import { Link } from 'react-router-dom'

// TODO: show name when hovering over icon
// interface GroupCardProps {
//     group_name: string
//     url: string
//     participants: string[]
// }

const ConnectionCard: React.FC = () => {
    return (
        <div className="h-[19vh] w-[67vh] bg-white rounded-[20px] flex">
            <div className="ml-[2vh] mt-[1.5vh] w-[16vh] h-[16vh] bg-slate-500 rounded-full"></div>
            <div>
                <h2>Jimmy Khang Nguyen</h2>
                <div>
                    <p><b>Groups in:</b> Viet Tech, Team4,...</p>
                </div>
            </div>
        </div>
    );
}

export default ConnectionCard;