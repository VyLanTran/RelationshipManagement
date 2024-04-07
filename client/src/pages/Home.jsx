import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/groups/GroupCard.tsx";
import axios from 'axios';
import Navbar from "../components/navbar/Navbar.jsx";
import { useSelector } from "react-redux";

const Home = () => {

    const [groups, setGroups] = useState([]);

    const navigate = useNavigate()

    const routeChange = () => {
        navigate('/groups');
    }

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/groups",
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
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
            <div className="pt-[90px]">
                {groups?.length == 0 ?
                    <div className="text-center space-y-3">
                        <h1 className="text-6xl">Oh no!</h1>
                        <h3 className="text-xl">You haven't created any friend group yet.</h3>
                        <button className="bg-[#FFB302] text-xl text-center w-[100vh] text-[large] h-[7vh] mb-[-2vh] mt-[1vh] rounded-[10px] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
                            Create a new friend group
                        </button>
                    </div>
                    :
                    <div>
                        <div className="text-center">
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
                                <button className="bg-[#FFB302] text-xl text-center w-[100vh] text-[large] h-[7vh] mb-[-2vh] mt-[1vh] rounded-[10px] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                    onClick={routeChange}
                                >
                                    See all of your friend groups
                                </button>
                            </div>
                            :
                            <div>
                            </div>
                        }
                        <div className="mt-[3vh]">
                            <p className="text-l text-gray-700">...or, discover common friends by clicking outside the group</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;