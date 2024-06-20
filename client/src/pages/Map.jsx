'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import MapCard from '../components/map/MapCard.jsx'
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'

const MapGroup = () => {
    const mapRef = React.useRef(null)

    const [ mapMarkers, setMapMarkers ] = useState([])
    const [ mapInstance, setMapInstance ] = useState(null);
    const [ currGroup, setCurrGroup ] = useState("Everyone");
    const [ connections, setConnections ] = useState([]);
    const [ checkRefresh, setCheckRefresh ] = useState(true);

    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        // fetch the user's connection
        const fetchConnections = async () => {

            const resAll = await fetch(
                `${BASE_URL}/users/${currentUser._id}/friends`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const resGroup = await fetch(
                `${BASE_URL}/groups/${currGroup}/members`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataAll = await resAll.json()
            const dataGroup = await resGroup.json()

            if (resAll.ok && currGroup=="Everyone") {
                setConnections(dataAll)
            } else if (resGroup.ok) {
                setConnections(dataGroup)
            }
        }
        if (currentUser) {
            fetchConnections()
        }
    }, [checkRefresh])


    const initMap = useCallback(async () => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
            version: 'weekly',
        });
    
        console.log("Loading map");
    
        const { Map } = await loader.importLibrary('maps');
    
        const position = { lat: 53.54, lng: 10 };
        const mapOptions = {
            center: position,
            zoom: 3,
            mapId: process.env.REACT_APP_GOOGLE_MAPS_ID,
        };
    
        const map = new Map(mapRef.current, mapOptions);
        setMapInstance(map);
      }, []);
    

    const initMarkers = useCallback(async (map) => {
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
          version: 'weekly',
        });
    
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');
        const infoWindow = new window.google.maps.InfoWindow();
    
        const newMarkers = await Promise.all(
            connections.map(async (connection) => {
                if (connection && 'currentCity' in connection) {
                    try {
                        const results = await getGeocode({ address: connection.currentCity });
                        const { lat, lng } = await getLatLng(results[0]);
            
                        const marker = new AdvancedMarkerElement({
                            map,
                            position: { lat, lng },
                        });
    
                        marker.addListener('click', () => {
                            infoWindow.setContent(`<b>${connection.name}</b><br/>${connection.currentCity}`);
                            infoWindow.open(map, marker);
                        });

                        return marker;
                    } catch (error) {
                        console.error('Error creating marker:', error);
                        return null;
                    }
                }
                return null;
            })
        );
        
        setMapMarkers(newMarkers.filter(Boolean))
        new MarkerClusterer({ map, markers: mapMarkers });
    }, [connections, setMapMarkers]);
    
    useEffect(() => {
            initMap();
        }, []);
    
    useEffect(() => {
        if (mapInstance) {
            initMarkers(mapInstance);
        }
    }, [mapInstance, initMarkers]);

    return (
        <div>
            <div className="flex justify-center flex-row">
                <MapCard total={connections.length} groups={currGroup} setCurrGroup={setCurrGroup} checkRefresh={checkRefresh} setCheckRefresh={setCheckRefresh} mapMarkers={mapMarkers} setMapMarkers={setMapMarkers}/>
                <div className="w-[150vh] bg-[#FCAF3D] rounded-[20px] h-[84vh] p-[2.5vh] m-[2vh]">
                    <div
                        className="w-[145vh] rounded-[20px] h-[80vh] mt-[-0.5vh]"
                        ref={mapRef}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapGroup
