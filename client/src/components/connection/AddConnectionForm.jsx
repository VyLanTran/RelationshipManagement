import React, { useState } from "react";
import { useSelector } from "react-redux";

const AddConnectionForm = ({ isOpen, onClose, userId }) => {
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		username: "",
		birthday: "",
		avatar: "",
		fun_facts: [],
		others: [],
	});

	const token = useSelector((state) => state.auth.token);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleClose = () => {
		onClose();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.author = userId;
		try {
			const res = await fetch(`http://localhost:3001/connections/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			console.log(formData);
			if (!res.ok) {
				throw new Error("Network response was not ok");
			}
			handleClose();
		} catch (error) {
			console.error("Error:", error);
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
							value={formData.name}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="phone"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Phone number"
							value={formData.phone}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="email"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Email"
							value={formData.email}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="birthday"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Birthday"
							value={formData.birthday}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="fun_facts"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Some fun facts"
							value={formData.fun_facts}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="others"
							className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
							placeholder="Other"
							value={formData.others}
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
							Add
						</button>
					</div>
				</form>
			</div>
		</div>
	);
	// return (
	// 	<form
	// 		onSubmit={handleSubmit}
	// 		className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="name"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Name:
	// 			</label>
	// 			<input
	// 				type="text"
	// 				id="name"
	// 				name="name"
	// 				value={formData.name}
	// 				onChange={handleChange}
	// 				required
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="phone"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Phone:
	// 			</label>
	// 			<input
	// 				type="tel"
	// 				id="phone"
	// 				name="phone"
	// 				value={formData.phone}
	// 				onChange={handleChange}
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="email"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Email:
	// 			</label>
	// 			<input
	// 				type="email"
	// 				id="email"
	// 				name="email"
	// 				value={formData.email}
	// 				onChange={handleChange}
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="username"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Username:
	// 			</label>
	// 			<input
	// 				type="text"
	// 				id="username"
	// 				name="username"
	// 				value={formData.username}
	// 				onChange={handleChange}
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="birthday"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Birthday:
	// 			</label>
	// 			<input
	// 				type="date"
	// 				id="birthday"
	// 				name="birthday"
	// 				value={formData.birthday}
	// 				onChange={handleChange}
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="avatar"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Avatar URL:
	// 			</label>
	// 			<input
	// 				type="url"
	// 				id="avatar"
	// 				name="avatar"
	// 				value={formData.avatar}
	// 				onChange={handleChange}
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="funFacts"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Fun Facts:
	// 			</label>
	// 			<input
	// 				type="text"
	// 				id="funFacts"
	// 				name="funFacts"
	// 				value={formData.fun_facts}
	// 				onChange={handleChange}
	// 				placeholder="Comma-separated values"
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>
	// 		<div className="mb-4">
	// 			<label
	// 				htmlFor="others"
	// 				className="block text-gray-700 text-sm font-bold mb-2">
	// 				Other Details:
	// 			</label>
	// 			<input
	// 				type="text"
	// 				id="others"
	// 				name="others"
	// 				value={formData.others}
	// 				onChange={handleChange}
	// 				placeholder="Comma-separated values"
	// 				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	// 			/>
	// 		</div>

	// 		<div className="flex items-center justify-between">
	// 			<button
	// 				type="submit"
	// 				onClick={onSubmit}
	// 				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
	// 				Submit
	// 			</button>
	// 			<button
	// 				type="button"
	// 				onClick={onCancel}
	// 				className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
	// 				Cancel
	// 			</button>
	// 		</div>
	// 	</form>
	// );
};

export default AddConnectionForm;
