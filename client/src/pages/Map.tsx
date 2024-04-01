import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GroupMap from "../components/groups/GroupMap.tsx";
import Navbar from "../components/navbar/Navbar.tsx";

const Map: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-wrap justify-center flex-row pt-[10vh]">
        <GroupMap
          group_name={"Test"}
          url={""}
          participants={["something", "something"]} // Placeholder for now
        />
        <div className="w-[150vh] bg-[#FFB302] rounded-[20px] h-[84vh] p-[2.5vh] m-[2vh]">
            <div>
                <button></button>
                <button></button>
                <button></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
