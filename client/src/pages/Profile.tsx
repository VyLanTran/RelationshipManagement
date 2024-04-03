import React from "react";

const Profile = () => {
    return (
        <div className="bg-green-500">
            <div>
                {/* Left sidebar */}
                <div className="w-[20%] bg-yellow-400"></div>
                {/* Main */}
                <div className="w-[60%] bg-red-400">
                    profile
                </div>
                {/* Right sidebar */}
                <div className="w-[20%] bg-blue-400"></div>
            </div>
        </div>
    );
}

export default Profile;