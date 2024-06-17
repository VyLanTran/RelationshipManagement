import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import axios from "axios";
import BASE_URL from '@/../../constants.js'
import { useSelector } from "react-redux";

export function EditPropertyModal({ children, groupId, checkRefresh, setCheckRefresh }) {

    const token = useSelector((state) => state.auth.token);
    const [label, setLabel] = useState("");
    const [content, setContent] = useState("");
    const authHeader = { headers: { 'Authorization': `Beareer ${token}` }};

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.put(
                `${BASE_URL}/properties/`,
                {
                    admin: groupId,
                    name: label,
                    subject: content
                },
                authHeader
            )
            setCheckRefresh(!checkRefresh);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add/Update something fun about your group!</DialogTitle>
                </DialogHeader>
                <form className="text-left">
                    <div className="mt-[20px]">
                        <p className="font-bold">Label</p>
                        <input
                        onChange={(e) => setLabel(e.target.value)}
                        type="text"
                        name="name"
                        className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                        placeholder="What is it about?"/>
                    </div>
                    <div className="mt-[20px]">
                        <p className="font-bold">Something interesting!</p>
                        <textarea
                        onChange={(e) => setContent(e.target.value)}
                        type="text"
                        name="subejct"
                        className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                        placeholder="Something fun!"/>
                    </div>
                </form>
                <DialogFooter className="">
                    <div>
                        <Button onClick={onSubmit}>Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}