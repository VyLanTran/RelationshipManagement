import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Navbar from "../components/navbar/Navbar.jsx";
import GroupCard from "../components/groups/GroupCard.tsx";
import GroupCardSmall from "../components/groups/GroupCardSmall.tsx";
import axios from 'axios';
import { useSelector } from 'react-redux'

const Groups = () => {

    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } }

    const [showDetails, setShowDetails] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');
    // const { userId } = useParams();

    const toggleLargeView = () => {
        setShowDetails(true);
    };

    const toggleSmallView = () => {
        setShowDetails(false);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const res = await axios.post("http://localhost:3001/groups/",
                {
                    name: newGroupName,
                    admin: currentUser._id,
                }, authHeader);
            setMessage("New group added successfully");
            setNewGroupName("");
        } catch (error) {
            setMessage(error.response.data["message"]);
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/groups/user/${currentUser._id}`, authHeader);
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
                    <button className="ml-[10vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh]"
                        onClick={toggleModal}>
                        New group
                    </button>
                    <Modal className="flex justify-center items-center"
                        isOpen={isOpen}
                        onRequestClose={toggleModal}
                        shouldCloseOnOverlayClick={true}
                    >
                        <div className="bg-[#fff] border-2 border-[#FFB302] rounded-[20px] w-[100vh] h-[30vh] p-[2.5vh] mt-[30vh] content-center">
                            <p className="text-3xl m-[3vh]">Create new group</p>
                            <input
                                className="content-center text-xl mr-[3vh] w-[60vh] rounded-[10px] px-[3vh] py-[2vh]"
                                placeholder="Name"
                                id="name"
                                name="name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <button className="ml-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                onClick={onSubmit}>
                                Create
                            </button>
                            <p className="text-red-500">{message}</p>
                        </div>
                    </Modal>
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
                                            url={group['_id']}
                                            participants={["something", "something"]} // Placeholder for now
                                        />
                                        :
                                        <GroupCardSmall
                                            key={id}
                                            group_name={group['name']}
                                            url={group['_id']}
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