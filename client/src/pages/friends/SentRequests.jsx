import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Separator } from '../../components/ui/separator.jsx'

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

    return (
        <div>
            {requests.map((request) => (
                <Item key={request._id} user={request.receiver} token={token} />
            ))}
        </div>
    )
}

export default SentRequests

const Item = ({ user, token }) => {
    const dispatch = useDispatch()
    const profileViewing = useSelector((state) => state.friend.profileViewing)
    const [isRequestSent, setIsRequestSent] = useState(false)
    const sentRequests = useSelector((state) => state.friend.sentRequests)

    // const handleClick = () => {
    //     dispatch(setProfileViewing(user))
    // }

    // const sendRequest = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const res = await fetch(`${BASE_URL}/requests/${user._id}`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         const json = await res.json()

    //         if (!res.ok) {
    //             throw new Error(json.error)
    //         } else {
    //             setIsRequestSent(!isRequestSent)
    //             socket.emit('new friend request', json)
    //             dispatch(setSentRequests([...sentRequests, json]))
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const cancelRequest = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const res = await fetch(`${BASE_URL}/requests/${user._id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         const json = await res.json()

    //         if (!res.ok) {
    //             throw new Error(json.error)
    //         } else {
    //             setIsRequestSent(!isRequestSent)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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
                {/* <div className="text-[11px] flex flex-row gap-4 ml-auto items-center">
                    {!isRequestSent ? (
                        <div
                            className="text-[#eda705] cursor-pointer"
                            onClick={sendRequest}
                        >
                            <FaUserPlus size={20} />
                        </div>
                    ) : (
                        <div
                            className="bg-[#fae1a7] py-1 px-2 flex flex-row gap-2 items-center w-[110px]"
                            onClick={cancelRequest}
                        >
                            <FaUserMinus />
                            <button>Cancel request</button>
                        </div>
                    )}

                    <div className=" cursor-pointer">
                        <MdOutlineRemoveCircle size={20} color="#eb4034" />
                    </div>
                </div> */}
            </div>
            <Separator className="" />
        </div>
    )
}
