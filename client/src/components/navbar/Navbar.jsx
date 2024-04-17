import React from "react";
import NavbarButton from "./NavbarButton.tsx";
import { FaGear } from "react-icons/fa6";
import { RiBookletFill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout.js";
import { Link, useNavigate } from "react-router-dom";
import { IoIosContacts } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { FaMap } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const { logout } = useLogout();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const connectionUrl = user ? `/connection/${user._id}` : "/login";

	return (
		// TODO: use shadcn menu
		<div className="fixed h-[60px] z-10 w-full bg-[#FFB302] flex flex-row justify-between items-center px-10">
			<div
				onClick={() => navigate("/")}
				className="cursor-pointer font-bold">
				Logo
			</div>
			<div className="flex flex-row gap-4 items-center">
				{/* TODO: use tooltips for these buttons */}
				<NavbarButton
					icon={<RiBookletFill size={18} />}
					name="My space"
					url="/home"
				/>
				<NavbarButton
					icon={<FaBell size={18} />}
					name="Notifications"
					url="/notification"
				/>
				<NavbarButton
					icon={<FaGear size={18} />}
					name="Settings"
					url="/setting"
				/>
				<NavbarButton
					icon={<FaMap size={18} />}
					name="Map"
					url="/map"
				/>
				<NavbarButton
					icon={<IoIosContacts size={20} />}
					name="Connection"
					url={connectionUrl}
				/>

				{user ? (
					<div className="flex flex-row items-center gap-4">
						<span
							onClick={() => navigate(`/${user._id}`)}
							className="cursor-pointer font-bold">
							{user.username}
						</span>
						{/* Log out */}
						<button onClick={handleLogout}>
							<MdLogout size={20} />
						</button>
					</div>
				) : (
					<div className="flex flex-row items-center gap-4">
						<Link to="/">Log in</Link>
						<Link to="/signup">Sign up</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
