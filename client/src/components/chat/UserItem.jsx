import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const UserItem = ({ user, addMember }) => {
    return (
        <Card
            className={`flex flex-row p-2 py-3 gap-4 border-none shadow-none cursor-pointer hover:bg-gray-100 rounded-md 
           
            `}
            onClick={addMember}
        >
            <Avatar>
                <AvatarImage src={user.profilePicture.url} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
                {/* TODO: trim if name is too long */}
                <span className="font-semibold text-[14px]">{user.name}</span>
                <span className="text-[12px] text-gray-500">
                    {user.username}
                </span>
            </div>
        </Card>
    )
}

export default UserItem
