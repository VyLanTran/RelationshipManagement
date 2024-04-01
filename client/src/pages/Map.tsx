'use client';

import React, { useEffect, version } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import GroupMap from "../components/groups/GroupMap.tsx";
import Navbar from "../components/navbar/Navbar.tsx";

const MapGroup = () => {
    const mapRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {

        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.MAP_API_KEY,
                version: "weekly",
            })

            const { Map } = await loader.importLibrary('maps');

            type Position = {
                lat: number;
                lng: number;
              };
              
            const position: Position = { lat: 53.54, lng: 10 };

            // map options
            const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 17,
                mapId: process.env.MAP_ID
            }

            // setup
            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
        }

        initMap();
    }, []);
    
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
                <div className="w-[145vh] rounded-[20px] h-[80vh] mt-[-0.5vh]" ref={mapRef} />
            </div>
        </div>
        </div>
    );
};

export default MapGroup;
