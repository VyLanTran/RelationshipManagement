import React from "react";

const EventCard = ({ event }) => {
    return (
        <div className="bg-[#FFB302] rounded-[10px] h-[15vh] w-[30vh] p-[2.5vh] mx-[1vh] my-[0.5vh]">
            <p className="text-xl">{event.name}</p>
            <p>{event.content}</p>
        </div>
    );
}

export default EventCard;