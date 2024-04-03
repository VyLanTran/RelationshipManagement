import React from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import { useAuthContext } from "../hooks/useAuthContext.js";

const Settings = () => {
    const { user } = useAuthContext();

    return (
        <div>
            <Navbar />
            <div className="pt-[60px]">This is the setting page</div>
        </div>
    );
}

export default Settings;