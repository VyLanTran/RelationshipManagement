import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import SearchLoading from "./SearchLoading";
import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { RiCloseCircleFill } from "react-icons/ri";
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast";

const ChatList = () => {

    const token = useSelector((state) => state.auth.token)
    const chats = useSelector((state) => state.chat.allChats)
    const currentChat = useSelector((state) => state.chat.currentChat)

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { toast } = useToast()

    const handleClearInput = () => {
        setSearch("")
    }

    useEffect(() => {
        const handleSearch = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(`http://localhost:3001/chats/search/?search=${search}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                })
                const data = await res.json()
                setIsLoading(false)
                setSearchResult(data)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: error.message,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
            }
        }

        handleSearch()
    }, [search])


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
                {
                    searchResult.length > 0 ?
                        searchResult.map(
                            (chat) => {
                                return (
                                    <ChatItem
                                        id={chat._id}
                                        chat={chat}
                                    />
                                )
                            }
                        ) :
                        <span
                            className="text-[13px] text-gray-400"
                        >
                            No results found
                        </span>
                }
            </div>
        </div>
    );
}

export default ChatList;