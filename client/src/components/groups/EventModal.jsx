import React, { useEffect, useState } from 'react'
import UpcomingEvent from '../event/UpcomingEvent.jsx'
import BASE_URL from '@/../../constants.js'
import { useSelector } from 'react-redux'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { CalendarIcon } from "@radix-ui/react-icons"
import { MdAdd } from 'react-icons/md'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import DayGridPlugin from '@fullcalendar/daygrid'
import EventDetail from '../event/EventDetail.jsx'
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AddEvent } from '../event/AddEvent.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { cn } from '../../lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import dayjs from 'dayjs'

export function EventModal({ group }) {
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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/events/user/${currentUser._id}`,
                    authHeader
                )
                setEvents(response.data.filter((event) => event['group'] == group._id))
            } catch (err) {
                console.error(err)
            }
        }
        fetchEvents()
    }, [])

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
                        group: !!group._id ? group._id : null,
                        startDate: dayjs(startDate).hour(parseInt(startSplit[0])).minute(parseInt(startSplit[1])),
                        endDate: dayjs(endDate).hour(parseInt(endSplit[0])).minute(parseInt(endSplit[1])),
                    },
                    authHeader
                )
                if (res.ok) {
                    setCurrentEvent(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const eventClick = (info) => {
        setIsOpen(true);
        setCurrentEvent(events.find((e) => info.event.id === e._id));
        setTitle(events.find((e) => info.event.id === e._id).name)
        setDescription(events.find((e) => info.event.id === e._id).content)
        setStartDate(events.find((e) => info.event.id === e._id).startDate)
        setStartTime(dayjs(events.find((e) => info.event.id === e._id).startDate).format('HH:MM'))
        setEndDate(events.find((e) => info.event.id === e._id).endDate)
        setEndTime(dayjs(events.find((e) => info.event.id === e._id).endDate).format('HH:MM'))
    }

    return (
        <div className="p-[15px]">
            <FullCalendar
                plugins={[DayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvent}
                height={530}
                eventClick={eventClick}
            />
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
                            <Select disabled>
                                <SelectTrigger>
                                    <SelectValue placeholder={group.name} />
                                </SelectTrigger>
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
    )
}
