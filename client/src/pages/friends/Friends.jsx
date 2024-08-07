import { useDispatch, useSelector } from 'react-redux'
import { PageSelection } from '../../components/friends/PageSelection.jsx'
import Suggestions from './Suggestions.jsx'
import { useEffect, useRef, useState } from 'react'
import ReceivedRequests from './ReceivedRequests.jsx'
import SentRequests from './SentRequests.jsx'
import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../components/ui/tooltip.jsx'
import { Tooltip } from '@radix-ui/react-tooltip'
import ProfileViewing from './ProfileViewing.jsx'
import { setProfileViewing } from '../../state/friendReducer.js'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const Friends = () => {
    const leftSidebarRef = useRef(null)
    const rightSidebarRef = useRef(null)
    const [selectedPage, setSelectedPage] = useState('suggestions')

    const renderContent = () => {
        switch (selectedPage) {
            case 'received':
                return <ReceivedRequests />
            case 'sent':
                return <SentRequests />
            default:
                return <Suggestions />
        }
    }

    return (
        <div>
            <div className=" w-full min-h-screen flex flex-row">
                <div
                    ref={leftSidebarRef}
                    className="w-[25%] bg-white border-r border-gray-300"
                >
                    <div className=" px-4 border-b flex h-[60px] items-center">
                        <PageSelection setSelectedPage={setSelectedPage} />
                    </div>
                    {renderContent()}
                </div>

                <div className="w-[50%] bg-gray-50">
                    <ProfileViewing />
                </div>
                <div
                    ref={rightSidebarRef}
                    className="w-[25%] bg-white  border-l border-gray-300"
                >
                    <BondList />
                </div>
            </div>
        </div>
    )
}

export default Friends

const BondList = () => {
    const dispatch = useDispatch()

    const token = useSelector((state) => state.auth.token)
    const currentUser = useSelector((state) => state.auth.user)

    const [friends, setFriends] = useState([])

    const handleClick = (user) => {
        dispatch(setProfileViewing(user))
    }

    useEffect(() => {
        const getFriends = async () => {
            const res = await fetch(
                `${BASE_URL}/users/${currentUser._id}/friends`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            const data = await res.json()

            if (res.ok) {
                setFriends(data)
            }
        }

        getFriends()
    }, [friends])

    return (
        <div>
            <div>My "Bonds"</div>
            <div id="friend-list" className="flex flex-wrap p-2">
                {friends.map((friend) => (
                    <div key={friend._id} className="w-[25%] p-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <img
                                        src={friend.profilePicture?.url}
                                        alt={friend.name}
                                        className="w-[50px] h-auto rounded-full cursor-pointer"
                                        onClick={() => handleClick(friend)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-200 text-black">
                                    <p>{friend.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ))}
            </div>
        </div>
    )
}
