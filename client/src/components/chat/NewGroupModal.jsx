import * as React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useSelector } from "react-redux"
import { ScrollArea } from "../ui/scroll-area"
import UserItem from "./UserItem"

export function NewGroupModal({ children }) {

    const token = useSelector((state) => state.auth.token)

    const [chatName, setChatName] = useState("")
    const [members, setMembers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const [position, setPosition] = React.useState("bottom")

    // searchResult = Array.from({ length: 50 }).map(
    //     (_, i, a) => `v1.2.0-beta.${a.length - i}`
    // )

    const handleSearch = async (query) => {


        try {
            setIsLoading(true)
            const res = await fetch(`http://localhost:3001/users/search/?search=${query}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const data = await res.json()
            setSearchResult(data)
            setIsLoading(false)
        } catch (error) {

        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="items-center">
                    <DialogTitle>Create new group chat</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 ">
                    <div className="grid grid-cols-3 items-center ">
                        <Input
                            id="chatName"
                            placeholder="Chat name"
                            className="col-span-3"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center ">
                        <Input
                            id="members"
                            placeholder="Members"
                            className="col-span-3"
                            onChange={(e) => handleSearch(e.target.value)}

                        />
                    </div>
                    <ScrollArea className="h-72 w-full rounded-md border">
                        <div className="p-4">
                            {searchResult.map((user) => (
                                <UserItem
                                    id={user._id}
                                    user={user}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
