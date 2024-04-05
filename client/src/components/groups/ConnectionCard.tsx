import React from "react";
import { Link } from 'react-router-dom'
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";

interface ConnectionCardProps {
    name: string;
    member_of: string;
    phone: string;
    email: string;
    last_contacted: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ name, member_of, phone, email, last_contacted }) => {
    return (
        <div className="h-[21vh] w-[67vh] bg-white rounded-[20px] flex">
            {/* <div className="ml-[2vh] mt-[2.5vh] w-[16vh] h-[16vh] bg-slate-500 rounded-full"></div> */}
            <IoPersonCircleSharp className="ml-[2vh] mt-[2.5vh] w-[16vh] h-[16vh]"/>
            <div className="mt-[1vh] w-[43vh]">
                <h2 className="font-bold text-left text-[3.5vh] ml-[2vh]">{name}</h2>
                <div className="text-left ml-[2vh] text-[2.2vh]">
                    <p><b>Groups in:</b> {member_of}</p>
                    <p><b>Phone:</b> {phone}</p>
                    <p><b>Email:</b> {email}</p>
                    <p><b>Last</b> {last_contacted}</p>
                </div>
            </div>
            <div className="w-[8vh] h-[21vh] rounded-[20px] flex  flex-col items-center justify-around pt-[2vh] pb-[2vh] mr-[0.5vh]">
                <button className="flex items-center justify-center font-azeret bg-[#FFB302] w-[6vh] text-[4vh] font-bold border h-[6vh] rounded-2xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><MdEdit /></button>
                <button className="flex items-center justify-center font-azeret bg-[#F85555] w-[6vh] text-[4vh] font-bold border h-[6vh] rounded-2xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><FaTrashAlt /></button>
            </div>
        </div>
    );
    }

export default ConnectionCard;