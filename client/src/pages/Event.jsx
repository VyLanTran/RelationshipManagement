import React, { useEffect, useState } from 'react'
import UpcomingEvent from '../components/event/UpcomingEvent.jsx'
import BASE_URL from '@/../../constants.js'
import { useSelector } from 'react-redux'
import { Button } from '../components/ui/button'
import { Calendar } from '../components/ui/calendar'
import { CalendarIcon } from "@radix-ui/react-icons"
import { MdAdd } from 'react-icons/md'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import DayGridPlugin from '@fullcalendar/daygrid'
import EventDetail from '../components/event/EventDetail.jsx'
import { Tooltip, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { AddEvent } from '../components/event/AddEvent.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { format } from "date-fns"
import { cn } from "../lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import dayjs from 'dayjs'

const Event = () => {
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    const authHeader = { headers: { Authorization: `Bearer ${token}` } }

    const [events, setEvents] = useState([])
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState()
    const [endDate, setEndDate] = useState(new Date())
    const [endTime, setEndTime] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [currentEvent, setCurrentEvent] = useState({})
    const [group, setGroup] = useState([])
    const [currentGroup, setCurrentGroup] = useState({id: null})
    const [checkRefresh, setCheckRefresh] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/events/user/${currentUser._id}`,
                    authHeader
                )
                setEvents(response.data)
                const resgroup = await axios.get(
                    `${BASE_URL}/groups/user/${currentUser._id}`, 
                    authHeader
                )
                const groupdata = resgroup.data
                groupdata.push({name: "Personal"})
                setGroup(groupdata);
            } catch (err) {
                console.error(err)
            }
        }
        fetchEvents()
    }, [checkRefresh])

    const calendarEvent = events.map(({ name, startDate, endDate, _id }) => ({
        title: name,
        start: startDate,
        end: endDate,
        color: '#FFB302',
        id: _id,
    }))

    const deleteEvent = async(event) => {
        event.preventDefault()
        try {
            const res = axios.delete(
                `http://localhost:3001/events/${currentEvent._id}`,
                authHeader
            )
            setCheckRefresh(!checkRefresh)
            setIsOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    const updateEvent = async (event) => {
        event.preventDefault()
        if (currentEvent) {
            const endSplit = endTime.split(':');
            const startSplit = startTime.split(':');
            try {
                const res = axios.put(
                    `${BASE_URL}/events/${currentEvent._id}`,
                    {
                        name: title,
                        content: description,
                        group: !!currentGroup._id ? currentGroup._id : null,
                        startDate: dayjs(startDate).hour(parseInt(startSplit[0])).minute(parseInt(startSplit[1])),
                        endDate: dayjs(endDate).hour(parseInt(endSplit[0])).minute(parseInt(endSplit[1])),
                    },
                    authHeader
                )
                if (res.ok) {
                    setCurrentEvent(res.data)
                }
                setCheckRefresh(!checkRefresh)
                setIsOpen(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const eventClick = (info) => {
        // this look like pain ik, but currentEvent doesn't update immediately
        setIsOpen(true);
        setCurrentEvent(events.find((e) => info.event.id === e._id));
        setTitle(events.find((e) => info.event.id === e._id).name)
        setDescription(events.find((e) => info.event.id === e._id).content)
        setStartDate(events.find((e) => info.event.id === e._id).startDate)
        setStartTime(dayjs(events.find((e) => info.event.id === e._id).startDate).format('HH:MM'))
        setEndDate(events.find((e) => info.event.id === e._id).endDate)
        setEndTime(dayjs(events.find((e) => info.event.id === e._id).endDate).format('HH:MM'))
        setCurrentGroup(group.find((g) => g._id === events.find((e) => info.event.id === e._id).group))
    }

    return (
        <div>
            <div className="flex flex-row">
                <div className="flex flex-col place-items-center w-[20%] hidden lg:block">
                    <TooltipProvider>
                        <Tooltip>
                            <AddEvent group={group} checkRefresh={checkRefresh} setCheckRefresh={setCheckRefresh}>
                                <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="mx-[2vh] mt-[3vh] h-[10vh]"
                                >
                                    <MdAdd className="mr-[1vh]" size={40} />
                                    <p className="text-xl">Add Event</p>
                                </Button>
                                </TooltipTrigger>
                            </AddEvent>
                        </Tooltip>
                    </TooltipProvider>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border mx-[2vh] mt-[1vh] bg-[#FFF]"
                    />
                    <UpcomingEvent events={events} />
                </div>
                <div className="bg-[#FFF] my-[2vh] h-[87vh] w-[78%] rounded-md p-[2vh]">
                    <FullCalendar
                        plugins={[DayGridPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvent}
                        height={580}
                        eventClick={eventClick}
                    />
                </div>
                <div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Event Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid w-full justify-left gap-1.5">
                            <Label htmlFor="name" className="mt-[5px] text-left">Name</Label>
                            <Input id="name" placeholder={currentEvent.name} onChange={(e) => setTitle(e.target.value)}/>
                            <Label htmlFor="content" className="mt-[5px] text-left">Description</Label>
                            <Input id="content" placeholder={currentEvent.content} onChange={(e) => setDescription(e.target.value)}/>
                            <Label htmlFor="group" className="mt-[5px] text-left">Group</Label>
                            <Select onValueChange={setCurrentGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder={currentGroup != null ? currentGroup["name"] : "Personal"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {group.map((u) => (<SelectItem value={u}>{u.name}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <Label htmlFor="sdate" className="mt-[5px] text-left">Start time</Label>
                            <div className="flex flex-row justify-between">
                                {/* <Popover>
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
                                </Popover> */}
                                <Input type="date" className="w-[330px]" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                                <Input type="time" id="sdate" value={startTime} className="w-[120px]" onChange={(e) => setStartTime(e.target.value)}/>
                            </div>
                            <Label htmlFor="edate" className="mt-[5px] text-left">End time</Label>
                            <div className="flex flex-row justify-between">
                                {/* <Popover>
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
                                </Popover> */}
                                <Input type="date" className="w-[330px]" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                                <Input type="time" id="edate" value={endTime} className="w-[120px]" onChange={(e) => setEndTime(e.target.value)}/>
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button onClick={updateEvent}>
                                Save
                            </Button>
                            <Button variant="destructive"
                                onClick={deleteEvent}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default Event
