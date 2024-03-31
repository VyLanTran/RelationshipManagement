import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import GroupCard from "../components/navbar/GroupCard.tsx";
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext.js";

const Home = () => {

    const [groups, setGroups] = useState([]);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/groups",
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                setGroups(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        // Make sure that the user must be authenticated before they can view their groups
        if (user) {
            fetchGroups();
        }
    }, [groups, user]);

    return (
        <div>
            <Navbar />
            <div className="text-center pt-[90px]">
                <h1 className="text-4xl">Discover your friend groups.</h1>
            </div>
            <div className="flex justify-center flex-row pt-[20px]">
                {
                    groups.slice(0, 3).map((group, id) =>
                        <GroupCard
                            key={id}
                            group_name={group['name']}
                            url={""}
                            participants={[]}
                        />)
                }
            </div>
            {groups?.length > 3 ?
                <div>
                    <input className="bg-[#FFB302] text-xl text-center w-[100vh] text-[large] h-[7vh] mb-[-2vh] mt-[1vh] rounded-[10px] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                        value="See all of your friend groups."
                    />
                </div>
                :
                <div>
                </div>
            }
            <div className="mt-[3vh]">
                <p className="text-l text-gray-700">...or, discover common friends by clicking outside the group</p>
            </div>
        </div>
    );
}

export default Home;