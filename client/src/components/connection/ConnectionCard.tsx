import React from "react";
import { Link } from 'react-router-dom'
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";

interface ConnectionCardProps {
    _id: object;
    name: string;
    member_of: string;
    phone: string;
    email: string;
    last_contacted: string;
}



const ConnectionCard: React.FC<ConnectionCardProps> = ({ _id, name, member_of, phone, email, last_contacted }) => {

    const handleClick = async (e) => {
        e.preventDefault()

        const res = await fetch("http://localhost:3001/connections/" + _id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
    }

    return (
        <div className="h-[21vh] w-[67vh] bg-white rounded-[20px] flex mb-[4vh]">
            <IoPersonCircleSharp className="ml-[2vh] mt-[2.5vh] w-[16vh] h-[16vh]" />
            <div className="mt-[1vh] w-[43vh]">
                <h2 className="font-bold text-left text-[3.5vh] ml-[2vh]">{name}</h2>
                <div className="text-left ml-[2vh] text-[2.2vh]">
                    <p><b>Groups in:</b> {member_of}</p>
                    <p><b>Phone:</b> {phone}</p>
                    <p><b>Email:</b> {email}</p>
                    <p><b>Last contacted:</b> {last_contacted}</p>
                </div>
            </div>
            <div className="w-[8vh] h-[21vh] rounded-[20px] flex  flex-col items-center justify-around pt-[2vh] pb-[2vh] mr-[0.5vh]">
                <button className="flex items-center justify-center font-azeret bg-[#FFB302] w-[6vh] text-[4vh] font-bold border h-[6vh] rounded-2xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><MdEdit /></button>
                <button onClick={handleClick} className="flex items-center justify-center font-azeret bg-[#F85555] w-[6vh] text-[4vh] font-bold border h-[6vh] rounded-2xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><FaTrashAlt /></button>
            </div>
        </div>
    );
}

export default ConnectionCard;