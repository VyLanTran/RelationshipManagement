import ChatList from "../components/chat/ChatList.jsx";
import SearchLoading from "../components/chat/SearchLoading.jsx";
import Navbar from "../components/navbar/Navbar.jsx";

const Chat = () => {
    return (
        <div>
            <Navbar />
            <div className="flex flex-row w-screen pt-[60px] ">

                <div className="w-[25%] bg-white border-r p-4">
                    <ChatList />
                </div>
                <div className="w-[75%] bg-[#B6D0E2]">
                    {/* <SearchLoading /> */}
                </div>
            </div>
        </div>
    );
}

export default Chat;