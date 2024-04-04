import React from "react";
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { RiBookletFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";


// TODO: show name when hovering over icon
interface GroupCardProps {
    group_name: string
    url: string
    participants: string[]
}

const options: { value: string, label: string }[] = [
    { value: "Viet Tech", label: "Viet Tech" },
    { value: "Team 4", label: "Team 4" },
    { value: "12CA1", label: "12CA1" },
    { value: "Everyone", label: "Everyone" }
];

const ConnectionGroup: React.FC<GroupCardProps> = ({ group_name, participants, url }) => {
   
    return (
        <div className="bg-[#FFB302] rounded-[20px] w-[50vh] h-[84vh] p-[2.5vh] m-[2vh]">
            <Select placeholder="Select group:" className="text-left" options={ options } />
            <div>
                <div className="text-left ml-[6vh] mt-[10vh] text-[2.5vh]">
                    <div className="flex flex-row">
                        <RiBookletFill className="text-[6vh] mt-[0.5vh] mr-[1vh]"/>
                        <p><b>Total contacts:</b><br/><span className="text-white font-bold">150</span> contacts</p>
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