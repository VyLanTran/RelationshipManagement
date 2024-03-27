import React from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import GroupCard from "../components/navbar/GroupCard.tsx";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="text-center pt-[90px]">
                <h1 className="text-4xl">Discover your friend groups.</h1>
            </div>
            <div className="flex justify-center flex-row pt-[20px]">
                <GroupCard group_name={"something"} url={"something"} participants={["something", "something"]} />
                <GroupCard group_name={"something"} url={"something"} participants={["something", "something", "somethingelse"]} />
                <GroupCard group_name={"something"} url={"something"} participants={["something", "something"]} />
            </div>
            <div>
                <input className="bg-[#FFB302] text-xl text-center w-[100vh] text-[large] h-[7vh] mb-[-2vh] mt-[1vh] rounded-[10px] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                    value="See all of your friend groups."
                />
            </div>
            <div className="mt-[3vh]">
                <p className="text-l text-gray-700">...or, discover common friends by clicking outside the group</p>
            </div>
        </div>
    );
}

export default Home;