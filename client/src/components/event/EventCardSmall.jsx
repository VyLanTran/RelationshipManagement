import React from "react";

const EventCard = ({ event }) => {
    return (
        <div className="bg-[#FFB302] rounded-[10px] w-[30vh] p-[0.5vh] mx-[1vh] my-[0.5vh]">
            <p>{event.name}</p>
        </div>
    );
}

export default EventCard;