import { Card } from '../ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { setAllChats, setCurrentChat } from '../../state/chatReducer.js'

const NewPrivateChatItem = ({ user, onCreateChat = null }) => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()

    const createNewChat = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`${BASE_URL}/chats`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friendId: user._id,
                }),
            })
            const json = await res.json()

            if (res.ok) {
                dispatch(setAllChats(json['allChats']))
                dispatch(setCurrentChat(json['currentChat']))
            }
        } catch (error) {
            // TODO: add toast
            console.log(error)
        }
    }

    return (
        <Card
            className="flex flex-row px-4 py-3 gap-4 border-none shadow-none cursor-pointer hover:bg-gray-100 rounded-none items-center"
            onClick={createNewChat}
        >
            <div className="w-10 h-10 ">
                <img
                    className="w-full h-full rounded-full"
                    src={user.profilePicture.url}
                    alt=""
                />
            </div>

            <div className="flex flex-col items-start">
                <span className="font-semibold text-[15px]">{user.name}</span>
            </div>
        </Card>
    )
}

export default NewPrivateChatItem
