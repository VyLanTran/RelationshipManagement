import { Card } from "../ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar"

// TODO: change the background of the selected card
const ChatItem = ({ chatName, profilePictureUrl, isSelected = false }) => {
    return (
        <Card
            className={`flex flex-row p-2 py-3 gap-4 border-none shadow-none cursor-pointer hover:bg-gray-100 rounded-md ${isSelected && "bg-gray-100"}`}
        >
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                {/* TODO: trim if name is too long */}
                <span className="font-semibold text-[16px]">
                    {chatName}
                </span>
                <span className="text-[14px] text-gray-500">
                    message
                </span>
            </div>
        </Card >
    );
}

export default ChatItem;