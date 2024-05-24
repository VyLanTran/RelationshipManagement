import { useEffect, useState } from 'react'
import BASE_URL from '@/../../constants.js'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserPlus } from 'react-icons/fa'
import { Separator } from '../components/ui/separator.jsx'
import { setProfileViewing } from '../store/friendReducer'

const FriendSuggestions = () => {
    const token = useSelector((state) => state.auth.token)

    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        // For now, I will just fetch all users in the system, but should only suggest those within 2 degrees of connection
        const fetchSuggestions = async () => {
            const res = await fetch(`${BASE_URL}/users`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setSuggestions(data)
            }
        }

        fetchSuggestions()
        // console.log(suggestions)
    }, [suggestions, token])

    return (
        <div>
            <div className=" w-full h-full flex flex-row">
                <div className="w-[40%] bg-white border-r border-gray-300">
                    <div className=" px-4 border-b flex h-[60px] items-center">
                        <span className="text-[16px] font-semibold mr-auto">
                            People You May Know
                        </span>
                    </div>
                    {suggestions.map((user) => (
                        <SuggestionItem id={user._id} user={user} />
                    ))}
                </div>

                <div className="w-[60%] bg-white">
                    <ProfileViewing />
                </div>
            </div>
        </div>
    )
}

const SuggestionItem = ({ user }) => {
    const dispatch = useDispatch()
    const profileViewing = useSelector((state) => state.friend.profileViewing)

    const handleClick = () => {
        dispatch(setProfileViewing(user))
    }

    return (
        <div
            className={`px-4  ${profileViewing && user._id === profileViewing._id && 'bg-gray-100'}`}
            onClick={handleClick}
        >
            <div className="flex flex-row h-[80px] items-center">
                <div className="flex flex-row gap-6 items-center cursor-pointer">
                    <img
                        src={user.profilePicture?.url}
                        alt=""
                        className="object-cover w-[50px] h-[50px] rounded-full"
                    />
                    <div className="flex flex-col items-start">
                        <span className="text-[16px]">{user.name}</span>
                        <span className="text-[11px] text-gray-400">
                            4 mutual friends
                        </span>
                    </div>
                </div>
                <div className="text-[11px] flex flex-row gap-1 ml-auto">
                    <div className="bg-[#FFB302] py-1 px-2 flex flex-row gap-2 items-center">
                        <FaUserPlus />
                        <button>Add friend</button>
                    </div>
                    <button className="bg-gray-200 text-gray-600 border border-gray-300 py-1 px-2">
                        Remove
                    </button>
                </div>
            </div>
            <Separator className="" />
        </div>
    )
}

const ProfileViewing = () => {
    const user = useSelector((state) => state.friend.profileViewing)

    return user ? (
        <div>
            <span>{user.name}</span>
        </div>
    ) : (
        <div>Choose a profile to view</div>
    )
}

export default FriendSuggestions
