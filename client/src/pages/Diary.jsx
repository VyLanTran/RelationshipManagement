import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import Modal from "react-modal";
import axios from "axios";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Diary = () => {

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } }

    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState("");
    const [diaries, setDiaries] = useState([]);
    const [newDiaryName, setNewDiaryName] = useState("Untitled");
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getFetch = async () => {
            const response = await fetch(`http://localhost:3001/groups/user/${user._id}`, authHeader);
            const data = await response.json();
            if (response.ok){
                setGroups(data);
            }
            const res_diary = await fetch(`http://localhost:3001/diary/user/${user._id}`, authHeader);
            const data_diary = await res_diary.json();
            if (res_diary.ok){
                setDiaries(data_diary);
            }

            // const quill = new Quill('#editor', {
            //     theme: 'snow'
            // });
        }
        if (user){
            getFetch();
        }
    }, []);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const createDiary = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const res = await axios.post("http://localhost:3001/diary/",
                {
                    name: newDiaryName,
                    admin: user._id,
                }, authHeader);
            setMessage("New entry added successfully");
            setNewDiaryName("Untitled");
            toggleModal();
        } catch (error) {
            setMessage(error.response.data["message"]);
        }
    };

    return (
        <div className="h-screen">
            <Navbar />
            <div className="pt-[70px] h-[90%]">
                <div class="overflow-x-auto h-[8vh] block">
                    <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">Personal</button>
                    {
                        groups.map((group) => 
                        <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                            >
                            {group["name"]}
                        </button>
                        )
                    }
                </div>
                <div className="flex flex-row py-[1vh] px-[3vh] h-[100%]">
                    <div className="w-[30%] h-[100%] mr-[1.5vh] bg-[#FFF] rounded-[20px] p-[2vh]">
                        <div className="flex flex-row justify-center items-center">
                            <p className="text-3xl font-bold hidden lg:block mr-[5vh]">Apr 2024</p>
                            <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] py-[1vh] px-[3vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={toggleModal}>
                                New Entry
                            </button>
                            <Modal className="flex justify-center items-center"
                                isOpen={isOpen}
                                onRequestClose={toggleModal}
                                shouldCloseOnOverlayClick={true}
                            >
                                <div className="bg-[#fff] border-2 border-[#FFB302] rounded-[20px] w-[100vh] h-[30vh] p-[2.5vh] mt-[30vh] content-center">
                                    <p className="text-3xl m-[3vh]">Create new entry</p>
                                    <input
                                        className="content-center text-xl mr-[3vh] w-[60vh] rounded-[10px] px-[3vh] py-[2vh]"
                                        placeholder="Untitled"
                                        id="name"
                                        name="name"
                                        value={newDiaryName}
                                        onChange={(e) => setNewDiaryName(e.target.value)}
                                    />
                                    <button className="ml-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                        onClick={createDiary}>
                                        Create
                                    </button>
                                    <p className="text-red-500">{message}</p>
                                </div>
                            </Modal>
                        </div>
                        <div className="py-[3vh]">
                            {
                                diaries.map((diary) => 
                                    <button className="w-[100%] h-[70px] bg-[#FFB302] mb-[1vh] rounded-[20px] flex flex-row items-center">
                                        <div className="w-[60px] h-[60px] bg-[#eee] rounded-[15px] m-[5px] justify-center hidden lg:block sm:justify-items-center">
                                            <p className="text-2xl">{dayjs(diary["createdAt"]).toString().substring(0,3)}</p>
                                            <p>{dayjs(diary["createdAt"]).format('MM/DD')}</p>
                                        </div>
                                        <p className="text-xl ml-[2vh]">{diary["name"]}</p>
                                    </button>
                                )
                            }
                        </div>
                    </div>
                    <div className="w-[75%] h-[100%] bg-[#FFF] ml-[1.5vh] rounded-[20px] p-[2vh]">
                        <ReactQuill
                            className="w-[100%] h-[80%] rounded-[15px] mb-[7vh]"
                            value={"hello"}
                            theme="snow"
                        />
                        <div className="flex flex-row justify-around">
                            <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
                                Delete Entry
                            </button>
                            <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
                                Save Entry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Diary;