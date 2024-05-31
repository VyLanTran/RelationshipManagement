import * as React from 'react'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollArea } from '../ui/scroll-area'
import UserItem from './UserItem'
import { useToast } from '../ui/use-toast'
import { ToastAction } from '../ui/toast'
import { HiddenInput } from '../ui/hidden-input'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'
import { setAllChats, setCurrentChat } from '../../state/chatReducer.js'
import BASE_URL from '@/../../constants.js'

export function NewGroupModal({ children }) {
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()

    const [chatName, setChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [open, setOpen] = useState(false)

    const { toast } = useToast()

    const handleSearch = async (query) => {
        try {
            const res = await fetch(
                `${BASE_URL}/users/search/?search=${query}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            let data = await res.json()
            data = data.filter(
                (user) =>
                    !selectedUsers.some(
                        (selectedUser) => user._id === selectedUser._id
                    )
            )
            setSearchResult(data)
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: error.message,
                action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                ),
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const selectedUserIds = selectedUsers.map((user) => user._id)
            const res = await fetch(`${BASE_URL}/chats/group`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatName,
                    memberIds: JSON.stringify(selectedUserIds),
                }),
            })
            const json = await res.json()
            if (res.ok) {
                dispatch(setAllChats(json))
                dispatch(setCurrentChat(json))
                handleClose()
            } else {
                toast({
                    variant: 'destructive',
                    title: json.error,
                })
            }
        } catch (error) {
            // toast({
            //   variant: 'destructive',
            //   title: error,
            // })
            console.log(error)
        }
    }

    const addMember = (newMember) => {
        setSelectedUsers([...selectedUsers, newMember])
        setSearchResult(
            searchResult.filter((user) => user._id !== newMember._id)
        )
    }

    const deleteMember = (deletedMember) => {
        setSelectedUsers(
            selectedUsers.filter((user) => user._id !== deletedMember._id)
        )
        setSearchResult([...searchResult, deletedMember])
    }

    // TODO: call handleClose when closing modal
    const handleClose = () => {
        setChatName('')
        setSelectedUsers([])
        setSearchResult([])
        setOpen(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>

                <DialogContent
                    className="sm:max-w-[425px]"
                    handleClose={handleClose}
                >
                    <DialogHeader className="items-center">
                        <DialogTitle>Create new group chat</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="  ">
                            <Input
                                id="chatName"
                                placeholder="Chat name"
                                className=""
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                            />
                        </div>
                        <div className="rounded-md border border-input flex flex-wrap p-2 gap-2">
                            {selectedUsers.map((selectedUser) => (
                                <Badge
                                    key={selectedUser._id}
                                    id={selectedUser._id}
                                    variant="secondary"
                                    className="bg-[#fde09c] p-2 gap-2 hover:bg-[#fde09c] inline-flex mr-1"
                                >
                                    <span className="whitespace-no-wrap">
                                        {selectedUser.name}
                                    </span>
                                    <div
                                        className="rounded-full hover:bg-[#FFB302] p-0.5"
                                        onClick={() =>
                                            deleteMember(selectedUser)
                                        }
                                    >
                                        <X size={10} strokeWidth={1.25} />
                                    </div>
                                </Badge>
                            ))}
                            <HiddenInput
                                id="members"
                                placeholder="Members"
                                className="border-none shadow-none focus:border-none focus:outline-none focus:none"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-72 w-full rounded-md border">
                            <div className="p-2">
                                {searchResult.map((user) => (
                                    <UserItem
                                        id={user._id}
                                        user={user}
                                        addMember={() => addMember(user)}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <DialogFooter>
                        <Button className="bg-[#FFB302]" onClick={handleSubmit}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    )
}
