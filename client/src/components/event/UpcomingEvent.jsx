import React from "react";

const UpcomingEvent = ({ events }) => {
    return (
        <div className="bg-[#FFB302] rounded-[10px] w-[35vh] h-[30vh] p-[2.5vh] mx-[2vh] mt-[1vh] ">
            <div>
                <p className="text-3xl">Upcoming</p>
            </div>
            <div className="text-left m-[3vh] text-center">
                {events.map(event => <p className="text-xl">{event.name}</p>)}
            </div>
        </div>
    );
}

export default UpcomingEvent;