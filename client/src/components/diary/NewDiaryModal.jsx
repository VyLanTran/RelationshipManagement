import * as React from "react"
import { useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import BASE_URL from '@/../../constants.js'

import axios from "axios";

export function NewDiaryModal({ children, currentGroup }) {

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    // const allDiaries = useSelector((state) => state.diary.allDiaries);

    // const dispatch = useDispatch();

    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };

    const [entryName, setEntryName] = useState("Untitled");

    const createDiary = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/diary`,
                {
                    name: entryName,
                    admin: (!!currentGroup.members) ? currentGroup.members : [user._id],
                    group: (currentGroup) ? currentGroup._id : null,
                    entry: ""
                }, authHeader);
            setEntryName("Untitled");   
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader className="items-center">
                    <DialogTitle>Create new entry</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 ">
                    <div className="grid grid-cols-3 items-center ">
                        <Input
                            id="chatName"
                            placeholder="How do you feel today?"
                            className="col-span-3"
                            onChange={(e) => setEntryName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={createDiary}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}