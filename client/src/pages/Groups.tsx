import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import GroupCard from "../components/navbar/GroupCard.tsx";
import GroupCardSmall from "../components/navbar/GroupCardSmall.tsx";
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext.js";

const Groups = () => {

    const [showDetails, setShowDetails] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [groups, setGroups] = useState([]);

    const toggleLargeView = () => {
        setShowDetails(true);
    };

    const toggleSmallView = () => {
        setShowDetails(false);
    };
    // const {user} = useAuthContext();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:3001/groups");
                setGroups(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGroups();
    }, [groups]);

    const sortGroup = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const filteredData = groups.filter(group => String(group['name']).toLowerCase().match(searchInput.toLowerCase()))

    return (
        <div>
            <Navbar />
            <div>
                <div className="flex justify-center flex-row pt-[90px] items-center px-[5vh]">
                    <input className="text-xl mr-[3vh] w-[100vh] rounded-[10px] px-[3vh] py-[2vh]" 
                        placeholder="Search groups"
                        onChange={sortGroup}
                        value={searchInput}
                    />
                    <button className="mx-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh]" 
                        onClick={toggleLargeView}>
                        Large
                    </button>
                    <button className="ml-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh]" 
                        onClick={toggleSmallView}>
                        Small
                    </button>
                </div>
                <div className="flex flex-wrap justify-center flex-row pt-[20px]">
                    {
                        filteredData.map((group, id) =>
                            <div>
                            {
                                showDetails ? 
                                    <GroupCard
                                        key={id}
                                        group_name={group['name']}
                                        url={""}
                                        participants={["something", "something"]} // Placeholder for now
                                    />
                                : 
                                    <GroupCardSmall 
                                        key={id}
                                        group_name={group['name']}
                                        url={""}
                                    />
                            }
                            </div>
                        )
                    }
                </div>
            </div>
            
        </div>
    );
}

export default Groups;