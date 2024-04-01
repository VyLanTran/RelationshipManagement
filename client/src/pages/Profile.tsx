import React from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import ProfileCard from "../components/profile/ProfileCard.tsx";
import { useAuthContext } from "../hooks/useAuthContext.js";

const Profile = () => {
    const { user } = useAuthContext();

    return (
        <div>
            <Navbar />
            <ProfileCard />
        </div>
    );
}

export default Profile;