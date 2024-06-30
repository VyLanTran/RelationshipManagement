import * as React from "react"
import dayjs from 'dayjs';
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useDispatch, useSelector } from "react-redux"
import { Calendar } from '../ui/calendar'
import { CalendarIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "../ui/dialog"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { cn } from "../../lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";

import axios from "axios";

export function AddEvent({ children, group }) {

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const oAuthToken = useSelector((state) => state.auth.oAuthToken);
    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

    let currentTime = new Date().toLocaleTimeString();

    const [eventName, setEventName] = useState("Untitled");
    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(dayjs().format("HH:mm"))
    const [endDate, setEndDate] = useState(new Date())
    const [endTime, setEndTime] = useState(dayjs().add(1, 'hour').format("HH:mm"))
    const [content, setContent] = useState("")
    const [currentGroup, setCurrentGroup] = useState({})

    const createEvent = async (event) => {
        event.preventDefault();
        const endSplit = endTime.split(':');
        const startSplit = startTime.split(':');
        try {
            const res = await axios.post(`${BASE_URL}/events`,
                {
                    name: eventName,
                    admin: user._id,
                    content: content,
                    group: !!currentGroup._id ? currentGroup._id : null,
                    startDate: dayjs(startDate).hour(parseInt(startSplit[0])).minute(parseInt(startSplit[1])),
                    endDate: dayjs(endDate).hour(parseInt(endSplit[0])).minute(parseInt(endSplit[1])),
                }, authHeader);  
            const auth = getAuth();
            const u = await auth.currentUser;
            console.log(oAuthToken)
            const res_calendar = await axios.post(`${BASE_URL}/events/google`, 
                {
                    event: {
                        name: eventName,
                        admin: user._id,
                        content: content,
                        group: !!currentGroup._id ? currentGroup._id : null,
                        startDate: dayjs(startDate).hour(parseInt(startSplit[0])).minute(parseInt(startSplit[1])),
                        endDate: dayjs(endDate).hour(parseInt(endSplit[0])).minute(parseInt(endSplit[1])),
                    },
                    token: oAuthToken,
                }, {
                    headers: {
                        'Authorization' : `Bearer ${token}`,
                    }
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className="items-center">
                    <DialogTitle>Create new event</DialogTitle>
                </DialogHeader>
                <div className="grid w-full justify-left gap-1.5">
                    <Label htmlFor="eventName" className="mt-[5px] text-left">Name</Label>
                    <Input
                        id="eventName"
                        placeholder="Event name"
                        className=""
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <Label htmlFor="content" className="mt-[5px] text-left">Description</Label>
                    <Input
                        id="content"
                        placeholder="Description"
                        className=""
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Label htmlFor="group" className="mt-[5px] text-left">Group</Label>
                    <Select onValueChange={setCurrentGroup}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a group, or Personal" />
                        </SelectTrigger>
                        <SelectContent>
                            {group.map((u) => (<SelectItem value={u}>{u.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <Label htmlFor="sdate" className="mt-[5px] text-left">Start time</Label>
                    <div className="flex flex-row justify-between">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[330px] justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Input type="time" id="sdate" value={startTime} className="w-[120px]" onChange={(e) => setStartTime(e.target.value)}/>
                    </div>
                    <Label htmlFor="edate" className="mt-[5px] text-left">End time</Label>
                    <div className="flex flex-row justify-between">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[330px] justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Input type="time" id="edate" value={endTime} className="w-[120px]" onChange={(e) => setEndTime(e.target.value)}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={createEvent}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}