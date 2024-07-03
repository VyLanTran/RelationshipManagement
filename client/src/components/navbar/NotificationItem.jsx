import { Card } from '../ui/card'
import { Checkbox } from '../ui/checkbox'

const NotificationItem = ({ type = 'OTHER', data, isRead, onToggleRead }) => {
    return (
        <>
            {type === 'FRIEND_REQUEST' && (
                <Card
                    className={`w-full flex flex-row py-3 px-2 gap-4 border-none shadow-none cursor-pointer rounded-none
                ${!isRead && 'bg-[#fff6e0]'}`}
                >
                    <div className="w-10 h-10 ">
                        <img
                            className="w-full h-full rounded-full"
                            src={data.sender.profilePicture.url}
                            alt=""
                        />
                    </div>
                    <div className="text-[13px] text-left">
                        <span className="font-extrabold ">
                            {data.sender.name}
                        </span>
                        <span> sent you a friend request</span>
                    </div>
                    <Checkbox checked={isRead} onCheckedChange={onToggleRead} />
                </Card>
            )}
        </>
    )
}

export default NotificationItem
