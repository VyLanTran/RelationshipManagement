import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar/Navbar.jsx'
import UpcomingEvent from '../components/event/UpcomingEvent.jsx'
import BASE_URL from '../constants.js'
import { useSelector } from 'react-redux'
import { Button } from '../components/ui/button'
import { Calendar } from '../components/ui/calendar'
import { MdAdd } from 'react-icons/md'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import DayGridPlugin from '@fullcalendar/daygrid'
import EventDetail from '../components/event/EventDetail.jsx'

const Event = () => {
	const currentUser = useSelector((state) => state.auth.user)
	const token = useSelector((state) => state.auth.token)

	const authHeader = { headers: { Authorization: `Bearer ${token}` } }

	const [events, setEvents] = useState([])

	const [date, setDate] = useState(new Date())

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get(
					`${BASE_URL}/events/user/${currentUser._id}`,
					authHeader
				)
				setEvents(response.data)
			} catch (err) {
				console.error(err)
			}
		}
		fetchEvents()
	}, [])

	const calendarEvent = events.map(({ name, startDate, endDate }) => ({
		title: name,
		start: startDate,
		end: endDate,
		color: '#FFB302',
	}))

	const eventClick = (info) => {
		alert(info.event.title)
		;<EventDetail event={info.event} />
	}

	return (
		<div>
			<Navbar />
			<div className="pt-[60px] flex flex-row">
				<div className="flex flex-col place-items-center w-[20%] hidden lg:block">
					<Button
						variant="outline"
						className="mx-[2vh] mt-[3vh] h-[10vh]">
						<MdAdd
							className="mr-[1vh]"
							size={40}
						/>
						<p className="text-xl">Add Event</p>
					</Button>
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
			</div>
		</div>
	)
}

export default Event
