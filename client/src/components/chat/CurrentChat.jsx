import { useSelector } from 'react-redux'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'
import { ToastAction } from '../ui/toast'
import { useToast } from '../ui/use-toast'
import { Toaster } from '../ui/toaster'

import { useEffect, useState } from 'react'
import MessageItem from './MessageItem'

const CurrentChat = () => {
    const currentChat = useSelector((state) => state.chat.currentChat)
    const token = useSelector((state) => state.auth.token)

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { toast } = useToast()

    useEffect(() => {
        const getAllMessages = async () => {
            if (!currentChat) return

            setIsLoading(true)
            const res = await fetch(
                `http://localhost:3001/messages/${currentChat._id}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            const json = await res.json()

            if (res.ok) {
                setMessages(json)
                // console.log(messages[0])
            } else {
                toast({
                    variant: 'destructive',
                    title: json.error,
                })
            }
            setIsLoading(false)
        }

        if (token) {
            getAllMessages()
        }
    }, [currentChat])

    const sendMessage = async (e) => {
        try {
            if (!input.trim()) {
                return
            }

            const res = await fetch(
                `http://localhost:3001/messages/${currentChat._id}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: input,
                    }),
                }
            )
            const json = await res.json()
            if (res.ok) {
                setMessages([...messages, json])
                setInput('')
            } else {
                toast({
                    variant: 'destructive',
                    title: json.error,
                })
            }
        } catch (error) {
            // console.log(error)
            toast({
                variant: 'destructive',
                title: error,
                // title: 'not ok 2',
            })
        }
    }

    return (
        <div className="w-full flex flex-col h-full">
            {currentChat ? (
                <div>
                    <div className="h-[60px] w-full flex flex-row justify-between items-center p-4 border-b fixed  bg-white">
                        <span>{currentChat.chatName}</span>
                    </div>

                    <div className="flex flex-col overflow-y-auto h-full bg-white mt-[60px] py-4">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <div>
                                {messages.map((message, index) => (
                                    <div id={message._id} className="w-full">
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
                    </div>

                    <div className="h-[60px] w-[70%] flex items-center fixed bottom-0 bg-white z-10 p-4">
                        <Textarea
                            placeholder="Type a message..."
                            className="h-[40px] focus:outline-none bg-gray-100"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
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

                    <Toaster />
                </div>
            ) : (
                <div>Select a chat</div>
            )}
        </div>
    )
}

export default CurrentChat
