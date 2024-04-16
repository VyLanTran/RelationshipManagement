import { Card } from "../ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar"
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "../../store/chatReducer";

const UserItem = ({ user }) => {

    // const dispatch = useDispatch()
    // const currentChat = useSelector((state) => state.chat.currentChat)

    // const handleClick = () => {
    //     dispatch(
    //         setCurrentChat(chat)
    //     )
    // }

    return (
        <Card
            className={`flex flex-row p-2 py-3 gap-4 border-none shadow-none cursor-pointer hover:bg-gray-100 rounded-md 
           
            `}
        // onClick={handleClick}
        >
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
                {/* TODO: trim if name is too long */}
                <span className="font-semibold text-[14px]">
                    {user.firstName} {" "} {user.lastName}
                </span>
                <span className="text-[12px] text-gray-500">
                    {user.username}
                </span>
            </div>
        </Card >
    );
}

export default UserItem;