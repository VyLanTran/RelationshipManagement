import ChatList from '../components/chat/ChatList.jsx'

import CurrentChat from '../components/chat/CurrentChat.jsx'

const Chat = () => {
    return (
        <div>
            <div className="flex flex-row w-full h-screen">
                <div className="w-[30%] bg-white border-r overflow-y-auto">
                    <ChatList />
                </div>
                <div className="w-[70%]  bg-white border-l overflow-y-auto">
                    <CurrentChat />
                </div>
            </div>
        </div>
    )
}

export default Chat
