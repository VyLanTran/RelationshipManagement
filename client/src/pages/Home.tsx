import React from "react";
import Navbar from "../components/navbar/Navbar.tsx";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="pt-[60px]">This is home page</div>
        </div>
    );
}

export default Home;