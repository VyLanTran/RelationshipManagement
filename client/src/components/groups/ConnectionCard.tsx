import React from "react";
import { Link } from 'react-router-dom'
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";


const ConnectionCard: React.FC = () => {
    return (
        <div className="h-[21vh] w-[67vh] bg-white rounded-[20px] flex">
            {/* <div className="ml-[2vh] mt-[2.5vh] w-[16vh] h-[16vh] bg-slate-500 rounded-full"></div> */}
            <IoPersonCircleSharp className="ml-[2vh] mt-[2.5vh] w-[16vh] h-[16vh]"/>
            <div className="mt-[1vh] w-[43vh]">
                <h2 className="font-bold text-left text-[3.5vh] ml-[2vh]">Jimmy Khang Nguyen</h2>
                <div className="text-left ml-[2vh] text-[2.2vh]">
                    <p><b>Groups in:</b> Viet Tech, Team4,...</p>
                    <p><b>Phone:</b> 075936835</p>
                    <p><b>Email:</b> test@gmail.com</p>
                    <p><b>Last</b> 03/02/2023</p>
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