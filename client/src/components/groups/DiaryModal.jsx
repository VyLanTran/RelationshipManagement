import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import BASE_URL from '@/../../constants.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { CirclePlus, Trash2, Save} from "lucide-react";
import { NewDiaryModal } from "../diary/NewDiaryModal.jsx";
import { Input } from "../ui/input"

export function DiaryModal({ group }) {
    const user = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    const authHeader = { headers: { Authorization: `Bearer ${token}` } }

    const [currentGroup, setCurrentGroup] = useState(group)
    const [currentDiary, setCurrentDiary] = useState({})
    const [diaries, setDiaries] = useState([])
    const [groupDiaries, setGroupDiaries] = useState([])
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentEntry, setCurrentEntry] = useState("")

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
            [{ color: ["red", "blue", "yellow", "green", "#34568B", "#FF6F61", "#6B5B95", "#F7CAC9", "#92A8D1", "#785412"] }],
            [{ background: ["red", "blue", "yellow", "green", "#34568B", "#FF6F61", "#6B5B95", "#F7CAC9", "#92A8D1", "#785412"] }]
        ]
    };

    const handleProcedureContentChange = (content) => {
        setCurrentEntry(content)
    };

    const handleNameChange = (e) => {
        setCurrentTitle(e.target.value)
    };

    useEffect(() => {
        setCurrentGroup(group);
        const getFetch = async () => {
            const res_diary = await fetch(
                `${BASE_URL}/diary/user/${user._id}`,
                authHeader
            )
            const data_diary = await res_diary.json()
            if (res_diary.ok) {
                setDiaries(data_diary)
                setGroupDiaries(data_diary.filter((diary) => diary['group'] == group._id))
            }
        }
        if (user) {
            getFetch()
        }
    }, [group])

    const deleteDiary = async (event, diary) => {
        event.preventDefault();
        try {
            const res = await axios.delete(`http://localhost:3001/diary/${diary._id}`, authHeader);
            setDiaries(diaries.filter((d) => d._id !== diary._id));
            setGroupDiaries(groupDiaries.filter((d) => d._id !== diary._id))
            setCurrentDiary(diaries[0]);
            setCurrentEntry(diaries[0]['entry']);
            setCurrentTitle(diaries[0]['name']);
        } catch (error) {
            console.log(error);
        }
    };

    const saveDiary = async (event) => {
        event.preventDefault()
        if (currentDiary){
            try {
                const res = await axios.put(
                    `${BASE_URL}/diary/${currentDiary._id}`, {
                        name: currentTitle,
                        entry: currentEntry
                    }, authHeader
                )
                if (res.ok){
                    setCurrentDiary(res.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        
    }

    return (
        <div className="h-[70vh]">
            <div className="flex flex-row h-[70vh]">
                <div className="w-1/4 mx-[5px] hidden lg:block">
                    <div className="h-[65vh] bg-[#FFF] rounded-[10px] p-[15px] my-[5px]">
                        <div className="flex flex-row justify-between items-center px-[10px]">
                            <p className="text-3xl font-bold hidden lg:block">
                                {dayjs().format('MMMM YYYY').toString()}
                            </p>
                            <TooltipProvider>
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
                        <div className="mt-[10px] h-[70vh] overflow-x-auto">
                            {groupDiaries.map((diary) => (
                                <button className="group/item w-full h-[70px] bg-[#EEE] mb-[5px] rounded-[10px] flex flex-row items-center justify-between hover:bg-[#ffdc8b] focus:bg-[#FFB302]"
                                    onClick={() => {
                                        setCurrentDiary(diary);
                                        setCurrentEntry(diary['entry']);
                                        setCurrentTitle(diary['name']);
                                    }}>
                                    <div className="w-[60px] h-[60px] bg-[#FFF] rounded-[5px] m-[5px] p-[3px] leading-4 justify-center hidden lg:block sm:justify-items-center">
                                        <p className="text-2xl">
                                            {dayjs(diary['createdAt'])
                                                .toString()
                                                .substring(0, 3)}
                                        </p>
                                        <p>
                                            {dayjs(diary['createdAt']).format(
                                                'MM/DD'
                                            )}
                                        </p>
                                    </div>
                                    <p className="text-xl mx-[10px] w-[200px] text-left truncate">
                                        {diary['name']}
                                    </p>
                                    <div className="text-white group/edit invisible hover:text-red-500 group-hover/item:visible">
                                        <button className="group-hover/edit:text-gray mr-[10px] pt-[5px]"
                                            onClick={(event) => deleteDiary(event, diary)}>
                                            <Trash2 size={24} strokeWidth={1.5} absoluteStrokeWidth/>
                                        </button>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-3/4 mx-[5px] h-[70vh]">
                    {
                        currentDiary ?
                            <div className="bg-[#FFF] rounded-[10px] p-[10px] h-[79.6vh]">
                                <div className="flex flex-row items-center">
                                    <Input 
                                        id="chatName"
                                        placeholder="How do you feel today?"
                                        className="mb-[5px] mr-[10px] h-[55px] text-xl"
                                        onChange={(e) => handleNameChange(e)}
                                        value={currentDiary ? currentTitle : ""}/>
                                    <button className="text-slate-400 hover:text-black mb-[5px]"
                                        onClick={(event) => saveDiary(event)}>
                                        <Save size={36} strokeWidth={1.5} absoluteStrokeWidth/>
                                    </button>
                                </div>
                                <ReactQuill
                                    className="h-[60vh]"
                                    value={currentDiary ? currentEntry : ""}
                                    onChange={(content) => handleProcedureContentChange(content)}
                                    formats={formats}
                                    modules={modules}
                                    theme="snow"
                                />
                            </div>
                        :
                            <p>Something!</p>
                    }
                </div>
            </div>
        </div>
    )
}
