import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserPlus } from 'react-icons/fa'
import { Separator } from '../../components/ui/separator.jsx'
import {
    setProfileViewing,
    setSentRequests,
} from '../../state/friendReducer.js'
import { FaUserMinus } from 'react-icons/fa'
import { MdOutlineRemoveCircle } from 'react-icons/md'
import io from 'socket.io-client'

var socket
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const Suggestions = () => {
    const token = useSelector((state) => state.auth.token)
    const currentUser = useSelector((state) => state.auth.user)

    const [suggestions, setSuggestions] = useState([])
    const [socketConnected, setSocketConnected] = useState(false)
    const dispatch = useDispatch()

    // set up
    useEffect(() => {
        socket = io(BASE_URL)
        socket.emit('setup', currentUser)
        socket.on('connected', () => setSocketConnected(true))
    }, [])

    useEffect(() => {
        // For now, I will just fetch all nonFriends from the system, but should only suggest those within 2 degrees of connection
        // TODO: send request to flaskAPI to get top suggestions
        const fetchSuggestions = async () => {
            const res = await fetch(`${BASE_URL}/requests/allSuggestions`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setSuggestions(data)
            }
        }

        fetchSuggestions()
    }, [suggestions, token])

    return (
        // <div>
        //     <div className=" w-full min-h-screen flex flex-row">
        //         <div className="w-[30%] bg-white border-r border-gray-300">
        //             <div className=" px-4 border-b flex h-[60px] items-center">
        //                 <PageSelection />
        //             </div>
        //             {suggestions.map((user) => (
        //                 <SuggestionItem
        //                     id={user._id}
        //                     user={user}
        //                     token={token}
        //                 />
        //             ))}
        //         </div>

        //         <div className="w-[70%] bg-white">
        //             <ProfileViewing />
        //         </div>
        //     </div>
        // </div>

        <div>
            {suggestions.map((user) => (
                <SuggestionItem key={user._id} user={user} token={token} />
            ))}
        </div>
    )
}

export default Suggestions

const SuggestionItem = ({ user, token }) => {
    const dispatch = useDispatch()
    const profileViewing = useSelector((state) => state.friend.profileViewing)
    const [isRequestSent, setIsRequestSent] = useState(false)
    const sentRequests = useSelector((state) => state.friend.sentRequests)

    const handleClick = () => {
        dispatch(setProfileViewing(user))
    }

    const sendRequest = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/requests/${user._id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            } else {
                setIsRequestSent(!isRequestSent)
                socket.emit('new friend request', json)
                dispatch(setSentRequests([...sentRequests, json]))
            }
        } catch (error) {
            console.log(error)
        }
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
                        onClick={handleClick}
                    />
                    <div className="flex flex-col items-start">
                        <span
                            className="text-[14px]  cursor-pointer"
                            onClick={handleClick}
                        >
                            {user.name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                            4 mutual friends
                        </span>
                    </div>
                </div>
                <div className="text-[11px] flex flex-row gap-4 ml-auto items-center">
                    <div
                        className="text-[#eda705] cursor-pointer"
                        onClick={sendRequest}
                    >
                        <FaUserPlus size={20} />
                    </div>
                </div>
            </div>
            <Separator className="" />
        </div>
    )
}
