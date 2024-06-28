import { useSelector } from 'react-redux'
import { Card } from '../ui/card'
import { Tooltip } from '../ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const MessageItem = ({ index, user, message, messages }) => {
    // console.log()
    const currentUser = useSelector((state) => state.auth.user)

    const isMyMessage = (user) => {
        return user._id === currentUser._id
    }

    const isSameSender = (index, message, messages) => {
        return (
            index === 0 ||
            (index > 0 && messages[index - 1].sender._id === message.sender._id)
        )
    }

    const isFirstMessageInSeries = (index, message, messages) => {
        return (
            index === 0 || messages[index - 1].sender._id !== message.sender._id
        )
    }

    const isLastMessageInSeries = (index, message, messages) => {
        return (
            isSameSender(index, message, messages) &&
            (index === messages.length - 1 ||
                messages[index + 1].sender._id !== message.sender._id)
        )
    }

    return messages && message ? (
        <div
            className={`flex justify-start items-center
        ${isSameSender(index, message, messages) ? 'mt-0.5' : 'mt-8'}
        `}
        >
            <div className="flex flex-row w-full gap-2">
                <div
                    className={`ml-4 mt-auto
                ${!isLastMessageInSeries(index, message, messages) && ' opacity-0'}`}
                >
                    {!isMyMessage(user) && (
                        <img
                            src={user.profilePicture?.url}
                            alt="profilePicture"
                            className="object-cover w-[30px] h-[30px] rounded-full"
                        />
                    )}
                </div>

                <div
                    className={`max-w-[50%] flex justify-start flex-col
                ${isMyMessage(user) ? ' ml-auto mr-4' : ''}
                `}
                >
                    {!isMyMessage(user) &&
                        isFirstMessageInSeries(index, message, messages) && (
                            <span className="text-[11px] text-gray-500 mr-auto px-4">
                                {message.sender.name}
                            </span>
                        )}
                    <Card
                        className={` w-full inline-block py-1 px-4 rounded-3xl shadow-none text-[15px] text-left
                ${isMyMessage(user) ? 'bg-[#1494f7] text-white' : 'bg-gray-200'}
                `}
                    >
                        {message.content.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    ) : (
        <div></div>
    )
}

export default MessageItem
