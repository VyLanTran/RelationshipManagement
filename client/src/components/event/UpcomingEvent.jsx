import dayjs from "dayjs";
import React from "react";

const UpcomingEvent = ({ events }) => {

    const upcoming = events.filter(event => dayjs().isBefore(dayjs(event.startDate)));

    return (
        <div className="bg-[#FFB302] rounded-[5px] w-[90.5%] h-[34vh] p-[2.5vh] mx-[2vh] mt-[1vh] ">
            <div>
                <p className="text-3xl">Upcoming</p>
            </div>
            <div className="text-left m-[1vh] text-center">
                {upcoming.slice(0, 5).map(event => <p className="text-xl">{event.name}</p>)}
            </div>
        </div>
    );
}

export default UpcomingEvent;