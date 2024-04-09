import React, { useState } from "react";

const AddConnectionForm = ({ onSubmit, onCancel }) => {
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
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const processedData = {
			...formData,
			funFacts: formData.funFacts
				.split(",")
				.map((fun_facts) => fun_facts.trim()),
			others: formData.others.split(",").map((other) => other.trim()),
		};
		onSubmit(processedData);
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div className="mb-4">
				<label
					htmlFor="name"
					className="block text-gray-700 text-sm font-bold mb-2">
					Name:
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="phone"
					className="block text-gray-700 text-sm font-bold mb-2">
					Phone:
				</label>
				<input
					type="tel"
					id="phone"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="email"
					className="block text-gray-700 text-sm font-bold mb-2">
					Email:
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="username"
					className="block text-gray-700 text-sm font-bold mb-2">
					Username:
				</label>
				<input
					type="text"
					id="username"
					name="username"
					value={formData.username}
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="birthday"
					className="block text-gray-700 text-sm font-bold mb-2">
					Birthday:
				</label>
				<input
					type="date"
					id="birthday"
					name="birthday"
					value={formData.birthday}
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="avatar"
					className="block text-gray-700 text-sm font-bold mb-2">
					Avatar URL:
				</label>
				<input
					type="url"
					id="avatar"
					name="avatar"
					value={formData.avatar}
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="funFacts"
					className="block text-gray-700 text-sm font-bold mb-2">
					Fun Facts:
				</label>
				<input
					type="text"
					id="funFacts"
					name="funFacts"
					value={formData.fun_facts}
					onChange={handleChange}
					placeholder="Comma-separated values"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="others"
					className="block text-gray-700 text-sm font-bold mb-2">
					Other Details:
				</label>
				<input
					type="text"
					id="others"
					name="others"
					value={formData.others}
					onChange={handleChange}
					placeholder="Comma-separated values"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>

			<div className="flex items-center justify-between">
				<button
					type="submit"
					onClick={onSubmit}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
					Submit
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
					Cancel
				</button>
			</div>
		</form>
	);
};

export default AddConnectionForm;
