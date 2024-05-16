import React from "react";

const EventDetail = ({ event }) => {
    return (
        <div className="bg-[#FFB302] rounded-[10px] w-[30vh] p-[0.5vh] mx-[1vh] my-[0.5vh]">
            <p>{event.name}</p>
            <p>{event.content}</p>
            <p>{event.startDate} - {event.endDate}</p>
            <p>{event.admin}</p>
        </div>
    );
}

export default EventDetail;