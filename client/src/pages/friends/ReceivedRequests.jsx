import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Separator } from '../../components/ui/separator.jsx'
import { FaCircleCheck } from 'react-icons/fa6'
import { motion, useAnimation } from 'framer-motion'
import { TiDelete } from 'react-icons/ti'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const ReceivedRequests = () => {
    const token = useSelector((state) => state.auth.token)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        const fetchReceivedRequests = async () => {
            const res = await fetch(`${BASE_URL}/requests/received`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        }

        fetchReceivedRequests()
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
                    user={request.sender}
                    token={token}
                    onAccept={() => {
                        handleRemoveRequest(request._id)
                    }}
                    onDecline={() => {
                        handleRemoveRequest(request._id)
                    }}
                />
            ))}
        </div>
    )
}

export default ReceivedRequests

const Item = ({ user, token, onAccept, onDecline }) => {
    const dispatch = useDispatch()
    const profileViewing = useSelector((state) => state.friend.profileViewing)
    const [isRequestSent, setIsRequestSent] = useState(false)
    const sentRequests = useSelector((state) => state.friend.sentRequests)
    const controls = useAnimation()

    const acceptRequest = async () => {
        try {
            const res = await fetch(`${BASE_URL}/requests/accept/${user._id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            console.log(error)
        }
    }

    const declineRequest = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/requests/decline/${user._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAccept = () => {
        const startElement = document.getElementById(`request-${user._id}`)
        const endElement = document.getElementById('friend-list')

        const startRect = startElement.getBoundingClientRect()
        const endRect = endElement.getBoundingClientRect()

        controls.start({
            x: [startRect.x, endRect.x],
            y: [startRect.y, endRect.y],
            opacity: [1, 0],
            transition: { duration: 1.5, ease: 'easeInOut' },
        })

        setTimeout(() => onAccept(user), 1500)
    }

    const handleDecline = () => {
        setTimeout(() => onDecline(user), 500)
    }

    return (
        <div
            className={`px-4 ${profileViewing && user._id === profileViewing._id && 'bg-gray-100'}`}
        >
            <div className="flex flex-row h-[80px] items-center">
                <div
                    id={`request-${user._id}`}
                    className="flex flex-row gap-4 items-center"
                >
                    <motion.div animate={controls}>
                        <img
                            src={user.profilePicture?.url}
                            alt=""
                            className="object-cover w-[50px] h-[50px] rounded-full  cursor-pointer"
                        />
                    </motion.div>
                    <div className="flex flex-col items-start">
                        <span className="text-[14px]  cursor-pointer">
                            {user.name}
                        </span>
                    </div>
                </div>
                <div className="text-[11px] flex gap-2 ml-auto items-center p-0">
                    <div
                        className=" cursor-pointer"
                        onClick={() => {
                            handleAccept()
                            acceptRequest()
                        }}
                    >
                        <FaCircleCheck size={20} color="#0cba06" />
                    </div>
                    <div
                        className=" cursor-pointer"
                        onClick={() => {
                            handleDecline()
                            declineRequest()
                        }}
                    >
                        <TiDelete size={30} color="#eb4034" />
                    </div>
                </div>
            </div>
            <Separator className="" />
        </div>
    )
}
