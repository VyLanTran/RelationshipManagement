import { useSelector } from 'react-redux'
import { PageSelection } from '../../components/friends/PageSelection.jsx'
import Suggestions from './Suggestions.jsx'
import { useState } from 'react'
import ReceivedRequests from './ReceivedRequests.jsx'
import SentRequests from './SentRequests.jsx'

const Friends = () => {
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
                <div className="w-[30%] bg-white border-r border-gray-300">
                    <div className=" px-4 border-b flex h-[60px] items-center">
                        <PageSelection setSelectedPage={setSelectedPage} />
                    </div>
                    {renderContent()}
                </div>

                <div className="w-[70%] bg-white">
                    <ProfileViewing />
                </div>
            </div>
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

export default Friends
