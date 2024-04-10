import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Navbar from '../components/navbar/Navbar.jsx'
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// TODO: edit username, password here
const GroupProfile = () => {

    const currentUser = useAuthContext().user
    const authHeader = { 
        method: "GET",
        headers: { 'Authorization': `Bearer ${currentUser.token}` } }
    const [group, setGroup] = useState<{ name: string } | null>(null);
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [view, setView] = useState("");
    const [editGroup, setEditGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [message, setMessage] = useState('');

    const toggleEdit = () => {
        setEditGroup(!editGroup);
    };

    const toggleDiaryView = () => {
        setView("diary");
    }

    const toggleMapView = () => {
        setView("map");
    }

    const toggleEventView = () => {
        setView("event");
    }

    const deleteGroup = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.delete(`http://localhost:3001/groups/${groupId}`, authHeader);
            navigate('/groups');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getGroup = async () => {
            const res = await fetch(`http://localhost:3001/groups/${groupId}`, authHeader);
            const data = await res.json();
            if (res.ok) {
                setGroup(data);
            }
        }
        if (currentUser) {
            getGroup();
        }
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const res = await axios.put(`http://localhost:3001/groups/${groupId}`,
                {
                    name: newGroupName,
                }, authHeader);
            setMessage("Group edited sucessfully!");
        } catch (error) {
            setMessage(error.response.data["message"]);
        }
    };

    return (
        <div className="">
            <Navbar />
            {
                group ?
                <div className="pt-[60px] flex flex-row h-screen p-[3vh]">
                    <div className="w-[25%]  my-[3vh] mr-[1.5vh]">
                        <div className="h-[90%] bg-[#FFB302] rounded-[20px] mb-[1.5vh] p-[2vh]">
                            <p className="text-3xl m-[2vh]">{group["name"]}</p>
                            <div className="text-left pl-[3vh]">
                                <p className="text-xl">Placeholder</p>
                                <p className="text-xl">Placeholder</p>
                            </div>
                        </div>
                        <div className="h-[10%] flex flex-row mt-[1.5vh] justify-center">
                            <button className="mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleEdit}>
                                Edit
                            </button>
                            <Modal className="flex justify-center items-center"
                                isOpen={editGroup}
                                onRequestClose={toggleEdit}
                                shouldCloseOnOverlayClick={true}
                            >
                                <div className="bg-[#fff] border-2 border-[#FFB302] rounded-[20px] w-[100vh] h-[100%] p-[2.5vh] mt-[10vh] content-center">
                                    <p className="text-3xl m-[3vh]">Edit Group</p>
                                    <div className="m-[3vh] grid grid-cols-5 gap-[5vh] items-center">
                                        <p className="text-xl m-[3vh]">Name:</p>
                                        <input
                                            className="rounded-[10px] px-[3vh] py-[2vh] col-span-4"
                                            placeholder={group["name"]}
                                            id="name"
                                            name="name"
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                        />
                                        <p className="text-xl m-[3vh]">Members:</p>
                                        <ul className="col-span-4">
                                            <li className="flex justify-between px-[3vh] py-[1vh]">
                                                <p className="">Member 1</p>
                                                <button className="rounded-[10px] bg-[#FFB302] px-[3vh] py-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">Remove</button>
                                            </li>
                                            <li className="flex justify-between px-[3vh] py-[1vh]">
                                                <p className="">Member 2</p>
                                                <button className="rounded-[10px] bg-[#FFB302] px-[3vh] py-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">Remove</button>
                                            </li>
                                        </ul>
                                        
                                        <button className="rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] col-span-5 hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
                                            Add new members
                                        </button>
                                    </div>
                                    
                                    <button className="ml-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                        onClick={onSubmit}>
                                        Submit
                                    </button>
                                    <p className="text-red-500 mt-[2vh]">{message}</p>
                                </div>
                            </Modal>
                            <button className="mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={deleteGroup}>
                                Delete
                            </button>
                        </div>
                    </div>
                    
                    <div className="w-[75%] bg-[#FFF] my-[3vh] ml-[1.5vh] rounded-[20px]">
                        <div className="m-[2vh]">
                            <button className="mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleDiaryView}>
                                Diary
                            </button>
                            <button className="mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleEventView}>
                                Event
                            </button>
                            <button className="mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleMapView}>
                                Location
                            </button>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
                :
                <div className="pt-[60px]">Group not found</div>
            }
        </div>
    );
}

export default GroupProfile;