import { Card } from '../ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentChat, setUnreadChats } from '../../state/chatReducer'
import { GoDotFill } from 'react-icons/go'

const ChatItem = ({ chat }) => {
    const dispatch = useDispatch()
    const currentChat = useSelector((state) => state.chat.currentChat)
    const unreadChats = useSelector((state) => state.chat.unreadChats)
    const currentUser = useSelector((state) => state.auth.user)

    let chatName
    let groupImageUrl = 'https://github.com/shadcn.png'

    if (chat.isGroupChat) {
        chatName = chat.chatName
    } else {
        const members = chat.members
        const friend =
            members[0]._id !== currentUser._id ? members[0] : members[1]
        chatName = friend.name
        groupImageUrl = friend.profilePicture.url
    }

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
            <div className="w-10 h-10 ">
                {!chat.isGroupChat ? (
                    <img
                        className="w-full h-full rounded-full"
                        src={groupImageUrl}
                        alt=""
                    />
                ) : (
                    <div className="relative inline-block w-10 h-10">
                        <img
                            className="rounded-full absolute bottom-0 left-0 w-4/6  h-4/6 border-2 border-white"
                            src={chat.members[0].profilePicture.url}
                            alt=""
                        />
                        <img
                            className="rounded-full absolute top-0 right-0 w-4/6  h-4/6 border-2 border-white"
                            src={chat.members[1].profilePicture.url}
                            alt=""
                        />
                    </div>
                )}
            </div>

            {unreadChats.some((unreadChat) => unreadChat._id === chat._id) ? (
                <div className="flex flex-col items-start">
                    {/* TODO: trim if name is too long */}
                    <span className="font-extrabold text-[15px]">
                        {chatName}
                    </span>
                    <span className="text-[13px] text-gray-500 font-semibold">
                        message
                    </span>
                </div>
            ) : (
                <div className="flex flex-col items-start">
                    {/* TODO: trim if name is too long */}
                    <span className="font-semibold text-[15px]">
                        {chatName}
                    </span>
                    <span className="text-[13px] text-gray-500">message</span>
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
