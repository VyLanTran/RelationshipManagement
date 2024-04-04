import React from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import ConnectionCard from "../components/groups/ConnectionCard.tsx";

const Connection = () => {
    
    return (
        <div>
            <Navbar />
            <div className="flex justify-center flex-row pt-[10vh]">
                <ConnectionCard
                    group_name={"Test"}
                    url={""}
                    participants={["something", "something"]} // Placeholder for now
                />
        </div>
        </div>
    );
};

export default Connection;