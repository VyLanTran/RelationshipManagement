import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import SearchLoading from './SearchLoading'
import { useDispatch, useSelector } from 'react-redux'
import ChatItem from './ChatItem'
import { RiCloseCircleFill } from 'react-icons/ri'
import { useToast } from '../ui/use-toast'
import { ToastAction } from '../ui/toast'
import { Button } from '../ui/button'
import { CirclePlus } from 'lucide-react'
import { NewGroupModal } from './NewGroupModal'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'
import { ScrollArea } from '../ui/scroll-area'

import NewPrivateChatItem from './NewPrivateChatItem'

const ChatList = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)
    const chats = useSelector((state) => state.chat.allChats)

    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [matchingUsers, setMatchingUsers] = useState([])

    const { toast } = useToast()

    const handleClearInput = () => {
        setSearch('')
    }

    useEffect(() => {
        const handleSearch = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/chats/search/?search=${search}`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                const data = await res.json()

                if (res.ok) {
                    setSearchResult(data['chats'])
                    setMatchingUsers(data['users'])
                }
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: error.message,
                    action: (
                        <ToastAction altText="Try again">Try again</ToastAction>
                    ),
                })
            }
        }

        handleSearch()
    }, [search, chats])

    return (
        <div className="w-full flex flex-col h-full">
            <div className="h-[120px] w-[30%] flex flex-col p-4 border-b shadow-md fixed bg-white">
                <div className="flex flex-row justify-between items-center mb-2">
                    <span className="font-bold text-[18px]">My Chats</span>

                    <TooltipProvider>
                        <Tooltip>
                            <NewGroupModal>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="rounded-full border-none shadow-none p-0"
                                        variant="outline"
                                        size="icon"
                                    >
                                        <CirclePlus
                                            size={24}
                                            strokeWidth={1.5}
                                            absoluteStrokeWidth
                                        />
                                    </Button>
                                </TooltipTrigger>
                            </NewGroupModal>
                            <TooltipContent className="bg-gray-100">
                                <p>New group chat</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="w-full pb-2 relative flex items-center ">
                    <Input
                        className="h-[40px]"
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
            </div>

            <div className="flex flex-col overflow-y-auto h-full bg-white mt-[120px]">
                <ScrollArea className="w-full flex flex-col h-screen ">
                    {searchResult &&
                    matchingUsers &&
                    (searchResult.length > 0 || matchingUsers.length > 0) ? (
                        <div>
                            {searchResult.map((chat) => {
                                return <ChatItem key={chat._id} chat={chat} />
                            })}
                            {matchingUsers.map((user) => (
                                <NewPrivateChatItem
                                    key={user._id}
                                    user={user}
                                />
                            ))}
                        </div>
                    ) : (
                        <span className="text-[13px] text-gray-400">
                            No results found
                        </span>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

export default ChatList
