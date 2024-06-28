import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/use-toast'
import Lottie from 'react-lottie'
import animationData from '../../animations/typing.json'

import MessageItem from './MessageItem'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Card } from '../ui/card'
import { setUnreadChats } from '../../state/chatReducer.js'
import { ReactComponent as NoDataSvg } from '../dashboard/no_data.svg'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
const ENDPOINT = `${BASE_URL}`
var socket, currentChatCompare

const CurrentChat = () => {
    const dispatch = useDispatch()

    const currentChat = useSelector((state) => state.chat.currentChat)
    const unreadChats = useSelector((state) => state.chat.unreadChats)
    const token = useSelector((state) => state.auth.token)
    const currentUser = useSelector((state) => state.auth.user)

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const { toast } = useToast()

    let chatName

    if (currentChat) {
        if (currentChat.isGroupChat) {
            chatName = currentChat.chatName
        } else {
            const members = currentChat.members
            const friend =
                members[0]._id !== currentUser._id ? members[0] : members[1]
            chatName = friend.name
        }
    }

    // set up
    useEffect(() => {
        socket = io(ENDPOINT)
        // emit user information to the socket named 'setup' in backend
        socket.emit('setup', currentUser)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    // join chat room
    useEffect(() => {
        const getAllMessages = async () => {
            if (!currentChat) return

            setIsLoading(true)
            const res = await fetch(`${BASE_URL}/messages/${currentChat._id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })

            const json = await res.json()

            if (res.ok) {
                setMessages(json)
            } else {
                toast({
                    variant: 'destructive',
                    title: json.error,
                })
            }
            setIsLoading(false)
            socket.emit('join chat', currentChat._id)
        }

        if (token) {
            getAllMessages()

            // currentChatCompare is used to decide if we have to emit a messag (sender)
            //  or receive a notification (receiver)
            currentChatCompare = currentChat
        }
    }, [currentChat])

    // TODO: WAITING MESSAGE IS HAVING A PROBLEM, ONLY SHOW WAITING STATE IN THE CORRECT CHAT
    // received message
    useEffect(() => {
        socket.on('message received', (messageReceived) => {
            // We will only see the new message if that message belongs to the current chat room
            // Else, it should just go into the notification

            if (
                !currentChatCompare ||
                currentChatCompare._id !== messageReceived.chat._id
            ) {
                // only add the chats to the unread notification once (even if multiple messages from that chat are unread)
                if (
                    unreadChats &&
                    !unreadChats.some(
                        (chat) => chat._id === messageReceived.chat._id
                    )
                ) {
                    const updatedUnreadChats = [
                        ...unreadChats,
                        messageReceived.chat,
                    ]
                    dispatch(setUnreadChats(updatedUnreadChats))

                    // TODO: fetch again to update latest message, which is displayed in the chat list
                    // TODO: we should only receive notification if we are not opening that chat
                }
            } else {
                setMessages([...messages, messageReceived])
            }
        })
    }, [messages])

    // new message
    const sendMessage = async (e) => {
        try {
            socket.emit('stop typing', currentChat._id)

            if (!input.trim()) {
                return
            }

            const res = await fetch(`${BASE_URL}/messages/${currentChat._id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: input,
                }),
            })
            const json = await res.json()
            if (res.ok) {
                socket.emit('new message', json)
                setMessages([...messages, json])
                setInput('')
            } else {
                toast({
                    variant: 'destructive',
                    title: json.error,
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: error,
            })
        }
    }

    const handleOnChange = (e) => {
        setInput(e.target.value)

        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit('typing', currentChat._id)
        }
        let lastTypingTime = new Date().getTime()
        // If user stops typing for more than 3 seconds, then typing becomes false
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                // Emit the 'stop typing' event
                socket.emit('stop typing', currentChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    return (
        <div className="w-full flex flex-col h-full">
            {currentChat ? (
                <div>
                    <div className="h-[60px] w-full flex flex-row justify-between items-center p-4 border-b fixed  bg-white">
                        <span>{chatName}</span>
                    </div>

                    <div className="flex flex-col overflow-y-auto h-full bg-white mt-[60px] py-4">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <div>
                                {messages.map((message, index) => (
                                    <div key={message._id} className="w-full">
                                        <MessageItem
                                            index={index}
                                            user={message.sender}
                                            message={message}
                                            messages={messages}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {isTyping && (
                            <Card
                                className={`w-[60px] inline-block rounded-3xl shadow-none ml-12
                `}
                            >
                                <Lottie
                                    options={defaultOptions}
                                    className="w-full"
                                />
                            </Card>
                        )}
                    </div>

                    <div className="h-[60px] w-[70%] flex items-center fixed bottom-0 bg-white z-10 p-4">
                        <Textarea
                            placeholder="Type a message..."
                            className="h-[40px] focus:outline-none bg-gray-100"
                            value={input}
                            onChange={handleOnChange}
                            onKeyDown={(e) => {
                                // Send message when hit enter
                                // Hit Shift + Enter to go to a new line
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full h-full justify-center items-center pb-[20%]">
                    <NoDataSvg />
                    <div className="text-gray-400 text-[18px] font-semibold mb-2">
                        No messages to display
                    </div>
                    <span className="text-gray-400 text-[14px]">
                        Select a chat on the left to view your conversation
                    </span>
                </div>
            )}
        </div>
    )
}

export default CurrentChat
