import { useEffect, useState } from 'react'
import ChatList from '../components/chat/ChatList.jsx'
import SearchLoading from '../components/chat/SearchLoading.jsx'
import Navbar from '../components/navbar/Navbar.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setAllChats } from '../store/chatReducer.js'
import CurrentChat from '../components/chat/CurrentChat.jsx'

import BASE_URL from '../constants.js'

const Chat = () => {
	const dispatch = useDispatch()

	const currentUser = useSelector((state) => state.auth.user)
	const token = useSelector((state) => state.auth.token)

	useEffect(() => {
		const getAllMyChats = async () => {
			const res = await fetch(`${BASE_URL}/`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			})

			const json = await res.json()

			if (!res.ok) {
				throw Error(json.error)
			} else {
				dispatch(setAllChats(json))
			}
		}

		if (currentUser) {
			getAllMyChats()
		}
	}, [])

	return (
		<div>
			<Navbar />
			<div className="flex flex-row w-full pt-[60px] h-screen">
				<div className="w-[30%] bg-white border-r overflow-y-auto">
					<ChatList />
				</div>
				<div className="w-[70%]  bg-white border-l overflow-y-auto">
					<CurrentChat />
				</div>
			</div>
		</div>
	)
}

export default Chat
