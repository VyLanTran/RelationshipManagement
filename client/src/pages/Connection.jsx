import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import ConnectionGroup from "../components/groups/ConnectionGroup.tsx";
import ConnectionCard from "../components/groups/ConnectionCard.jsx";
import AddConnectionForm from "../components/connection/AddConnectionForm.jsx";
import axios from "axios";
import { useSelector } from "react-redux";

const Connection = () => {
	const [connections, setConnections] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [showAddForm, setShowAddForm] = useState(false);
	const user = useSelector((state) => state.auth.user);
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const response = await axios.get("http://localhost:3001/connections", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConnections(response.data.connections);
			} catch (err) {
				console.error(err);
			}
		};
		if (user) {
			fetchConnections();
		}
	}, [connections, user]);

	const searchConnection = (e) => {
		e.preventDefault();
		setSearchInput(e.target.value);
	};

	const handleCloseForm = () => {
		setShowAddForm(false);
	};

	const filteredData = connections.filter((connection) =>
		String(connection["name"]).toLowerCase().match(searchInput.toLowerCase())
	);

	return (
		<div>
			<Navbar />
			{connections?.length == 0 ? (
				<div className="flex justify-center pt-[10vh]">
					<ConnectionGroup />
					<div className="w-[145vh] rounded-[20px] h-[84vh] p-[1vh] m-[2vh]"></div>
				</div>
			) : (
				<div className="flex justify-center pt-[10vh]">
					<ConnectionGroup />
					<div className="w-[145vh] rounded-[20px] h-[84vh] p-[1vh] m-[2vh]">
						<form className="flex justify-between">
							<div className="flex">
								<input
									value={searchInput}
									onChange={searchConnection}
									className="border border-solid border-[rgb(84,84,84)] bg-slate-50 w-[40vh] h-[6vh] outline-none rounded-3xl pl-[2vh]"
									placeholder="Finding someone?"></input>
								<button className="font-azeret bg-slate-50 w-[25vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
									Search
								</button>
							</div>
							<button
								className="font-azeret bg-[#8DC363] w-[20vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
								onClick={(e) => {
									e.preventDefault();
									setShowAddForm(true);
								}}>
								Add
							</button>
						</form>
						<AddConnectionForm
							isOpen={showAddForm}
							onClose={handleCloseForm}
							userId={user._id}
						/>
						<section className="h-[75vh] mt-[2vh] rounded-[20px]">
							<div className="flex justify-between flex-wrap overflow-auto max-h-[100%] overflow-x-hidden">
								{filteredData.slice().map((connection, id) => (
									<ConnectionCard
										key={id}
										_id={connection["_id"]}
										name={connection["name"]}
										member_of={["Viet Tech", "Team4"].join(", ")}
										phone={connection["phone"]}
										email={connection["email"]}
										last_contacted={"02/04/2023"}
									/>
								))}
							</div>
						</section>
					</div>
				</div>
			)}
		</div>
	);
};

export default Connection;
