import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentChat, setUnreadChats } from '../../store/chatReducer'
import { GoDotFill } from 'react-icons/go'

const ChatItem = ({ chat }) => {
    const dispatch = useDispatch()
    const currentChat = useSelector((state) => state.chat.currentChat)
    const unreadChats = useSelector((state) => state.chat.unreadChats)

    const handleClick = () => {
        dispatch(setCurrentChat(chat))
        if (unreadChats.some((unreadChat) => unreadChat._id === chat._id)) {
            clearNotifications()
        }
    }

    const clearNotifications = () => {
        const updatedUnreadChats = unreadChats.filter(
            (unreadChat) => unreadChat._id !== chat._id
        )
        dispatch(setUnreadChats(updatedUnreadChats))
    }

    return (
        <Card
            className={`flex flex-row px-4 py-3 gap-4 border-none shadow-none cursor-pointer hover:bg-gray-100 rounded-none items-center
            ${currentChat && chat._id === currentChat._id && 'bg-gray-100'}`}
            onClick={handleClick}
        >
            <Avatar>
                <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {unreadChats.some((unreadChat) => unreadChat._id === chat._id) ? (
                <div className="flex flex-col items-start">
                    {/* TODO: trim if name is too long */}
                    <span className="font-extrabold text-[16px]">
                        {chat.chatName}
                    </span>
                    <span className="text-[14px] text-gray-500 font-semibold">
                        message
                    </span>
                </div>
            ) : (
                <div className="flex flex-col items-start">
                    {/* TODO: trim if name is too long */}
                    <span className="font-semibold text-[16px]">
                        {chat.chatName}
                    </span>
                    <span className="text-[14px] text-gray-500">message</span>
                </div>
            )}

            {unreadChats.some((unreadChat) => unreadChat._id === chat._id) && (
                <div className="ml-auto text-[#166df7]">
                    <GoDotFill size={20} />
                </div>
            )}
        </Card>
    )
}

export default ChatItem
