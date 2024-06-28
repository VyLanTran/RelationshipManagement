import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Separator } from '../../components/ui/separator.jsx'
import { FcEmptyTrash } from 'react-icons/fc'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const SentRequests = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        const fetchSentRequests = async () => {
            const res = await fetch(`${BASE_URL}/requests/sent`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        }

        fetchSentRequests()
    }, [requests])

    const handleRemoveRequest = (id) => {
        setRequests((prevRequests) =>
            prevRequests.filter((req) => req._id !== id)
        )
    }

    return (
        <div>
            {requests.map((request) => (
                <Item
                    key={request._id}
                    user={request.receiver}
                    token={token}
                    onUnsend={() => {
                        handleRemoveRequest(request._id)
                    }}
                />
            ))}
        </div>
    )
}

export default SentRequests

const Item = ({ user, token, onUnsend }) => {
    const dispatch = useDispatch()
    const profileViewing = useSelector((state) => state.friend.profileViewing)
    const [isRequestSent, setIsRequestSent] = useState(false)
    const sentRequests = useSelector((state) => state.friend.sentRequests)

    const unsendRequest = async () => {
        try {
            const res = await fetch(`${BASE_URL}/requests/unsend/${user._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnsend = () => {
        setTimeout(() => onUnsend(user), 500)
    }

    return (
        <div
            className={`px-4  ${profileViewing && user._id === profileViewing._id && 'bg-gray-100'}`}
        >
            <div className="flex flex-row h-[80px] items-center">
                <div className="flex flex-row gap-4 items-center">
                    <img
                        src={user.profilePicture?.url}
                        alt=""
                        className="object-cover w-[50px] h-[50px] rounded-full  cursor-pointer"
                        // onClick={handleClick}
                    />
                    <div className="flex flex-col items-start">
                        <span
                            className="text-[14px]  cursor-pointer"
                            // onClick={handleClick}
                        >
                            {user.name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                            {/* TODO: replace with real data */}4 mutual friends
                        </span>
                    </div>
                </div>
                <div className="text-[11px] flex flex-row gap-4 ml-auto items-center">
                    <div
                        className="text-[#eda705] cursor-pointer"
                        onClick={() => {
                            handleUnsend()
                            unsendRequest()
                        }}
                    >
                        <FcEmptyTrash size={24} />
                    </div>
                </div>
            </div>
            <Separator className="" />
        </div>
    )
}
