import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import SearchLoading from "./SearchLoading";
import { useSelector } from "react-redux";

const ChatList = () => {
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [chats, setChats] = useState([])

    useEffect(() => {
        const getAllMyChats = async () => {
            const res = await fetch(`http://localhost:3001/chats/`, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` }
            })

            const data = await res.json()

            if (res.ok) {
                setChats(data)
            }
        }

        if (currentUser) {
            getAllMyChats()
        }
    }, [])

    return (
        <div className="w-full">
            <div className="w-full pb-4">
                <Input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

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
                                <span>{chatName}</span>
                            )
                        }
                    )
                }
            </div>
        </div>
    );
}

export default ChatList;