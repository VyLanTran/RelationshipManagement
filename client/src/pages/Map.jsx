'use client'

import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { Loader } from "@googlemaps/js-api-loader";
import MapCard from "../components/map/MapCard.jsx";
import Navbar from "../components/navbar/Navbar.jsx";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useSelector } from "react-redux";
import BASE_URL from '@/../../constants.js'

const MapGroup = () => {
    const mapRef = React.useRef(null);

    const [ connections, setConnections ] = useState([]);
    
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        // fetch the user's connection
        const fetchConnections = async () => {
            const res = await fetch(
                `${BASE_URL}/connections/${currentUser._id}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const data = await res.json()

            if (res.ok) {
                setConnections(data.connections)
            }
        }
        if (currentUser) {
            fetchConnections()
        }
    }, [currentUser])
    
    // Load the map in + general map configuration
    useEffect(() => {

        const initMap = async () => {
            const loader = new Loader({
                apiKey: 'AIzaSyBUIvdKMKt7Hav5Ly79qwuTEZszxLw1X1I',
                version: "weekly",
            })

            const { Map, InfoWindow } = await loader.importLibrary('maps');

            const { AdvancedMarkerElement, PinElement } = await loader.importLibrary('marker');
              
            const position = { lat: 53.54, lng: 10 };

            // map options
            const mapOptions = {
                center: position,
                zoom: 3,
                mapId: '7edf854779b8d237'
            }

            // setup map
            const map = new Map(mapRef.current, mapOptions);

            const infoWindow = new InfoWindow();

            const markers = [];

            await Promise.all(connections.slice().map(async (connection) => {
                if (connection && "location" in connection) {
                    try {
                        // Perform geocoding to get latitude and longitude
                        const results = await getGeocode({ 'address': connection.location });
                        const { lat, lng } = await getLatLng(results[0]);

                        const marker = new AdvancedMarkerElement({
                            map,
                            position: { lat, lng },
                        });

                        markers.push(marker)

                        // Add a click listener for each marker, and set up the info window.
                        marker.addListener('click', ({ domEvent, latLng }) => {
                            const { target } = domEvent;
                            infoWindow.close();
                            const html = "<b>" + connection.name + "</b><br/>" + connection.location
                            infoWindow.setContent(html);
                            infoWindow.open(marker.map, marker, html);
                        });

                    } catch (error) {
                        console.error(error)
                    }                
                } else {
                    console.log("No location")
                }
            }));

            const cluster = new MarkerClusterer({ map: map, markers: markers });
        }

        initMap();
    }, [connections]);

    return (
        <div>
            <Navbar />
            <div className="flex justify-center flex-row pt-[10vh]">
                <MapCard total={connections.length}/>
            <div className="w-[150vh] bg-[#FCAF3D] rounded-[20px] h-[84vh] p-[2.5vh] m-[2vh]">
                <div className="w-[145vh] rounded-[20px] h-[80vh] mt-[-0.5vh]" ref={mapRef} />
            </div>
        </div>
        </div>
    );
};

export default MapGroup;
