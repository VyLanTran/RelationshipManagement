import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import SearchLoading from "./SearchLoading";
import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { RiCloseCircleFill } from "react-icons/ri";
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { NewGroupModal } from "./NewGroupModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ChatList = () => {

    const token = useSelector((state) => state.auth.token)
    const chats = useSelector((state) => state.chat.allChats)
    const currentChat = useSelector((state) => state.chat.currentChat)

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                setSearchResult(data)
                setIsLoading(false)
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
    }, [searchResult, chats])


    return (
        <div className="w-full">
            <div className="flex flex-row justify-between items-center mb-6">
                <span className="font-bold text-[20px]">My Chats</span>
                <TooltipProvider>
                    <Tooltip>
                        <NewGroupModal>
                            <TooltipTrigger asChild>
                                <Button
                                    className="rounded-full border-none shadow-none p-1"
                                    variant="outline" size="icon">
                                    <CirclePlus size={36} strokeWidth={1.5} absoluteStrokeWidth />
                                </Button>
                            </TooltipTrigger>
                        </NewGroupModal>
                        <TooltipContent className="bg-gray-100">
                            <p>New group chat</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
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