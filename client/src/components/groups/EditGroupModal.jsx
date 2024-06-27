import React, { useEffect, useState } from 'react'
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useSelector } from "react-redux"
import BASE_URL from '@/../../constants.js'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from "lucide-react";

import axios from "axios";

export function EditGroupModal({ children, currentGroup, members }) {

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const [groupName, setGroupName] = useState(currentGroup['name'])
    const [users, setUsers] = useState([])
    const [newMembers, setNewMembers] = useState(members)

    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`${BASE_URL}/users`, authHeader)
            const data = await res.json()
            if (res.ok) {
                setUsers(data)
            }
        }
        if (user) {
            getUser()
        }
        setNewMembers(members);
    }, [members])

    const deleteGroup = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.delete(
                `${BASE_URL}/groups/${currentGroup['_id']}`,
                authHeader
            )
            navigate('/groups')
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setMessage('')
        try {
            const res = await axios.put(
                `${BASE_URL}/groups/${currentGroup['_id']}`,
                {
                    name: groupName,
                    members: newMembers,
                    admin: newMembers,
                },
                authHeader
            )
            setMessage('Group edited sucessfully!')
        } catch (error) {
            setMessage(error.response.data['message'])
        }
    };

    const addMember = async (event) => {
        event.preventDefault()
        setNewMembers([...newMembers, { name: ' ', _id: null }])
        console.log(newMembers)
    };

    const deleteMember = async (event, member) => {
        event.preventDefault();
        setNewMembers(newMembers.filter((m) => m._id !== member._id));
        console.log(newMembers)
    };

    const handleMemberChange = async (newUser, index) => {
        const updatedMembers = [...newMembers];
        updatedMembers[index] = { ...newUser };
        setNewMembers(updatedMembers);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]" >
                <DialogHeader className="items-center">
                    <DialogTitle>Edit Group</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 ">
                    <div className="grid grid-cols-3 items-center ">
                        <Input
                            value={groupName}
                            className="col-span-3"
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <div>
                        {newMembers.map((member, index) => (
                            <div className="flex flex-row mb-[5px]" key={index}>
                                <Select onValueChange={(newUser) => {handleMemberChange(newUser, index); console.log(newMembers)}}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={member._id != null ? member["name"] : "Choose an user"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (<SelectItem value={u}>{u.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <button className="text-slate-500 pt-[5px] ml-[15px] hover:text-red-500"
                                    onClick={(event) => deleteMember(event, member)}>
                                    <Trash2 size={24} strokeWidth={1.5} absoluteStrokeWidth/>
                                </button>
                            </div>
                        ))}
                        <Button onClick={addMember} className="mt-[10px]">
                            Add new members
                        </Button>
                    </div>
                </div>
                <DialogFooter className="items-center">
                    <p className="text-red-400">{message}</p>
                    <div>
                        <Button onClick={deleteGroup}>Delete</Button>
                        <Button onClick={onSubmit} className="ml-[5px]">Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}