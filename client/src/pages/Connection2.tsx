import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.tsx";
import ConnectionGroup from "../components/groups/ConnectionGroup.tsx";
import ConnectionCard from "../components/groups/ConnectionCard.tsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import axios from 'axios';

const Connection = () => {

    const [ connections, setConnections ] = useState([]);

    const { user } = useAuthContext();

    useEffect(() => {
        const fetchConnections = async() => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/connections",
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                setConnections(response.data);
            } catch (err) {
                console.error(err)
            }
        };

        if (user) {
            fetchConnections();
        }
    }, [connections, user]);


    
    return (
        <div>
            <Navbar />
            <div className="flex justify-center pt-[10vh]">
                <ConnectionGroup />
                <div className="w-[145vh] rounded-[20px] h-[84vh] p-[1vh] m-[2vh]">
                    <form className="flex justify-between">
                        <div className="flex">
                            <input className="border border-solid border-[rgb(84,84,84)] bg-slate-50 w-[40vh] h-[6vh] outline-none rounded-3xl pl-[2vh]" placeholder="Finding someone?"></input>
                            <button className="font-azeret bg-slate-50 w-[25vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">Search</button>
                        </div>
                        <button className="font-azeret bg-[#8DC363] w-[20vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">Add</button>
                    </form>
                    <section className="h-[75vh] mt-[2vh] rounded-[20px]">
                        <div className="flex justify-between">
                            <ConnectionCard 
                                name={"Jimmy Khang Nguyen"}
                                member_of={[ "Viet Tech", "Team4"].join(", ")}
                                phone={"098403463"}
                                email={"test@gmail.com"}
                                last_contacted={"02/04/2023"}
                            />
                            <ConnectionCard 
                                name={"Jimmy Khang Nguyen"}
                                member_of={[ "Viet Tech", "Team4"].join(", ")}
                                phone={"098403463"}
                                email={"test@gmail.com"}
                                last_contacted={"02/04/2023"}
                            />
                        </div>
                        <div className="flex justify-between mt-[4vh]">
                            <ConnectionCard 
                                name={"Jimmy Khang Nguyen"}
                                member_of={[ "Viet Tech", "Team4"].join(", ")}
                                phone={"098403463"}
                                email={"test@gmail.com"}
                                last_contacted={"02/04/2023"}
                            />
                            <ConnectionCard 
                                name={"Jimmy Khang Nguyen"}
                                member_of={[ "Viet Tech", "Team4"].join(", ")}
                                phone={"098403463"}
                                email={"test@gmail.com"}
                                last_contacted={"02/04/2023"}
                            />
                        </div>

                    </section>
                </div>
            </div>
        </div>
    );
};

export default Connection;