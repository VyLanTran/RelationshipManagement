import { useState } from "react";
import React from "react";
import { useSelector } from "react-redux";

const EditModal = ({ isOpen, onClose, connection, connectionId }) => {
	const token = useSelector((state) => state.auth.token);
	const [connectionData, setConnectionData] = useState(connection);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setConnectionData({
			...connectionData,
			[name]: value,
		});
	};

	const handleClose = () => {
		setConnectionData(connection);
		onClose();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(
				`http://localhost:3001/connections/${connectionId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(connectionData),
				}
			);

			if (!res.ok) {
				throw new Error("Network response was not ok");
			}
			handleClose();
		} catch (error) {
			console.log("Error: " + error);
		}
	};
	return (
		<div
			className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
				isOpen ? "" : "hidden"
			}`}>
			<div className="bg-white p-8 rounded shadow-md">
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 text-[14px] gap-2">
						<input
							type="text"
							name="name"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Name"
							value={connectionData.name}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="phone"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Phone number"
							value={connectionData.phone}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="email"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Email"
							value={connectionData.email}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="birthday"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Birthday"
							value={connectionData.birthday}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="fun_facts"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Some fun facts"
							value={connectionData.fun_facts}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="others"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Other"
							value={connectionData.others}
							onChange={handleChange}
						/>
					</div>

					<div className="flex justify-end mt-6">
						<button
							type="button"
							onClick={handleClose}
							className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium bg-[#FFB302] rounded-md hover:bg-[#ffc744]">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditModal;
