import { useEffect, useState } from "react";
import ChatList from "../components/chat/ChatList.jsx";
import SearchLoading from "../components/chat/SearchLoading.jsx";
import Navbar from "../components/navbar/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setAllChats } from "../store/chatReducer.js";

const Chat = () => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        const getAllMyChats = async () => {
            const res = await fetch(`http://localhost:3001/chats/`, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` }
            })

            const json = await res.json()

            if (!res.ok) {
                throw Error(json.error)
            }
            else {
                dispatch(
                    setAllChats(json)
                )
            }
        }

        if (currentUser) {
            getAllMyChats()
        }
    }, [])

    return (
        <div>
            <Navbar />
            <div className="flex flex-row w-screen pt-[60px] ">

                <div className="w-[30%] bg-white border-r p-4">
                    <ChatList
                    />
                </div>
                <div className="w-[70%] bg-[#d5edff]">
                    {/* <SearchLoading /> */}
                </div>
            </div>
        </div>
    );
}

export default Chat;