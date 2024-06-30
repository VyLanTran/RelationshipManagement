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
import { Label } from "../ui/label"
import { Input } from "../ui/input"

export function EditPropertyModal({ children, groupId, checkRefresh, setCheckRefresh, init_label, description }) {

    const token = useSelector((state) => state.auth.token);
    const [labelDes, setLabelDes] = useState(init_label);
    const [content, setContent] = useState(description);
    const authHeader = { headers: { 'Authorization': `Bearer ${token}` }};

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.put(
                `${BASE_URL}/properties/`,
                {
                    admin: groupId,
                    name: labelDes,
                    subject: content
                },
                authHeader
            )
            setCheckRefresh(!checkRefresh);
            setLabelDes(init_label);
            setContent(description);
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
                <DialogHeader className="item-center">
                    <DialogTitle>Add/Update something fun about your group!</DialogTitle>
                </DialogHeader>
                <form className="grid w-full justify-left gap-1.5">
                    <Label htmlFor="name" className="mt-[5px] text-left">Label</Label>
                    <Input
                        id="name"
                        placeholder="What is it about?"
                        className=""
                        onChange={(e) => setLabelDes(e.target.value)}
                    />
                    <Label htmlFor="subject" className="mt-[5px] text-left">Something interesting!</Label>
                    <Input
                        id="subject"
                        placeholder="Something fun!"
                        className=""
                        onChange={(e) => setContent(e.target.value)}
                    />
                </form>
                <DialogFooter>
                    <Button onClick={onSubmit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}