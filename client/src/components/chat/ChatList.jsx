import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import SearchLoading from "./SearchLoading";
import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { RiCloseCircleFill } from "react-icons/ri";

const ChatList = () => {

    const chats = useSelector((state) => state.chat.allChats)

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);



    const handleClearInput = () => {
        setSearch("")
    }

    return (
        <div className="w-full">
            {/* Search bar */}
            <div className="w-full pb-6 relative flex items-center ">
                <Input
                    className="h-[50px] pr-10"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button
                        className="absolute right-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={handleClearInput}
                    >
                        <RiCloseCircleFill size={20} />
                    </button>
                )}
            </div>
            {/* List of chats */}
            <div className="w-full flex flex-col">
                {/* {
                    isLoading ?
                        <SearchLoading /> :
                        <span>results</span>
                } */}

                {
                    chats.map(
                        ({ _id, chatName }) => {
                            return (
                                <ChatItem
                                    id={_id}
                                    chatName={chatName}
                                // isSelected={_id === selectedChatId}
                                />
                            )
                        }
                    )
                }
            </div>
        </div>
    );
}

export default ChatList;