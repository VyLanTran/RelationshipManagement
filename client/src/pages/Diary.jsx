import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { current } from "@reduxjs/toolkit";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import { CirclePlus } from "lucide-react";
import { NewDiaryModal } from "../components/diary/NewDiaryModal.jsx";
import { setAllDiaries, setGroupDiaries, setCurrentDiary } from "../store/diaryReducer.js";

const Diary = () => {

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const allDiaries = useSelector((state) => state.diary.allDiaries);
    const groupDiaries = useSelector((state) => state.diary.groupDiaries);
    const currentDiary = useSelector((state) => state.diary.currentDiary);

    const dispatch = useDispatch();

    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } }

    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState({});

    const formats = ["header", "bold", "italic", "underline", "strike","blockquote",
        "list", "bullet", "link", "color", "image", "background", "align", "size", "font"];

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ size: [] }],
            [{ font: [] }],
            [{ align: ["right", "center", "justify"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ color: ["red", "#785412"] }],
            [{ background: ["red", "#785412"] }]
        ]
    };

    const handleProcedureContentChange = (content, delta, source, editor) => {
        dispatch(setCurrentDiary({...currentDiary, entry: content}));
    };

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
                dispatch(setAllDiaries(data_diary));
                dispatch(setGroupDiaries(allDiaries.filter((diary) => diary.group === undefined)));
                dispatch(setCurrentDiary(groupDiaries[0]));
                console.log(currentDiary);
            }
        }
        if (user){
            getFetch();
        }
    }, []);

    const deleteDiary = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.delete(`http://localhost:3001/diary/${currentDiary._id}`, authHeader);
            dispatch(setAllDiaries(allDiaries.filter((diary) => diary._id !== currentDiary._id)));
            dispatch(setGroupDiaries(allDiaries.filter((diary) => diary.group === currentGroup._id)));
            dispatch(setCurrentDiary(groupDiaries[0]));
        } catch (error) {
            console.log(error);
        }
    };

    const updateDiary = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.put(`http://localhost:3001/diary/${currentDiary._id}`, currentDiary, authHeader);
            const data = await res.data;
            dispatch(setCurrentDiary(data));
            console.log(currentDiary);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="h-screen">
            <Navbar />
            <div className="pt-[70px] h-[90%]">
                <div class="overflow-x-auto h-[8vh] block">
                    <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                        onClick={() => {
                            setCurrentGroup({});
                            dispatch(setGroupDiaries(allDiaries.filter((diary) => diary.group == null)));
                            console.log(groupDiaries);
                        }}>
                        Personal
                    </button>
                    {
                        groups.map((group) => 
                        <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                            onClick={() => {
                                setCurrentGroup(group);
                                dispatch(setGroupDiaries(allDiaries.filter((diary) => diary.group == group._id)));
                                console.log(groupDiaries);
                            }}>
                            {group["name"]}
                        </button>
                        )
                    }
                </div>
                <div className="flex flex-row py-[1vh] px-[3vh] h-[100%]">
                    <div className="w-[30%] h-[100%] mr-[1.5vh] bg-[#FFF] rounded-[20px] p-[2vh]">
                        <div className="flex flex-row justify-center items-center">
                            <p className="text-3xl font-bold hidden lg:block mr-[5vh]">Apr 2024</p>
                            <TooltipProvider>``
                                <Tooltip>
                                    <NewDiaryModal currentGroup={currentGroup}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="rounded-full border-none shadow-none p-1"
                                                variant="outline" size="icon">
                                                <CirclePlus size={36} strokeWidth={1.5} absoluteStrokeWidth />
                                            </Button>
                                        </TooltipTrigger>
                                    </NewDiaryModal>
                                    <TooltipContent className="bg-gray-100">
                                        <p>New Entry</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="py-[3vh]">
                            {
                                groupDiaries.map((diary) => 
                                    <button className="w-[100%] h-[70px] bg-[#FFB302] mb-[1vh] rounded-[20px] flex flex-row items-center"
                                        onClick={() => {dispatch(setCurrentDiary(diary)); console.log(currentDiary);}}>
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
                        <input
                            className="justify-center text-xl w-[100%] rounded-[10px] px-[3vh] py-[1.5vh] mb-[1.5vh]"
                            id="name"
                            name="name"
                            value={currentDiary ? currentDiary["name"] : ""}
                            onChange={(e) => {dispatch(setCurrentDiary({
                                ...currentDiary,
                                name: e.target.value
                            }))}}
                        />
                        <ReactQuill
                            className="w-[100%] h-[70%] rounded-[15px] mb-[7vh]"
                            value={currentDiary ? currentDiary["entry"] : ""}
                            onChange={(content, delta, source, editor) => handleProcedureContentChange(content, delta, source, editor)}
                            formats={formats}
                            modules={modules}
                            theme="snow"
                        />
                        <div className="flex flex-row justify-around">
                            <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={deleteDiary}>
                                Delete Entry
                            </button>
                            <button className="text-xl bg-[#FFB302] rounded-[10px] h-[6vh] p-[1vh] m-[1vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={updateDiary}>
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