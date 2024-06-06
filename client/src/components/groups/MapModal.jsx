import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

export function MapModal({ group, members }) {

    const mapRef = React.useRef(null)

    // Load the map in + general map configuration
    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: 'AIzaSyBUIvdKMKt7Hav5Ly79qwuTEZszxLw1X1I',
                version: 'weekly',
            })

            const { Map, InfoWindow } = await loader.importLibrary('maps')

            const { AdvancedMarkerElement, PinElement } =
                await loader.importLibrary('marker')

            const position = { lat: 53.54, lng: 10 }

            // map options
            const mapOptions = {
                center: position,
                zoom: 3,
                mapId: '7edf854779b8d237',
            }

            // setup map
            const map = new Map(mapRef.current, mapOptions)

            const infoWindow = new InfoWindow()

            const markers = []

            await Promise.all(
                members.slice().map(async (member) => {
                    if (member && 'currentCity' in member) {
                        try {
                            // Perform geocoding to get latitude and longitude
                            const results = await getGeocode({
                                address: member.currentCity,
                            })
                            const { lat, lng } = await getLatLng(results[0])

                            const marker = new AdvancedMarkerElement({
                                map,
                                position: { lat, lng },
                            })

                            markers.push(marker)

                            // Add a click listener for each marker, and set up the info window.
                            marker.addListener(
                                'click',
                                ({ domEvent, latLng }) => {
                                    const { target } = domEvent
                                    infoWindow.close()
                                    const html =
                                        '<b>' +
                                        member.name +
                                        '</b><br/>' +
                                        member.currentCity
                                    infoWindow.setContent(html)
                                    infoWindow.open(marker.map, marker, html)
                                }
                            )
                        } catch (error) {
                            console.error(error)
                        }
                    } else {
                        console.log('No location')
                    }
                })
            )

            const cluster = new MarkerClusterer({ map: map, markers: markers })
        }

        initMap()
    }, [members])

    return (
        <div className='h-[100%] w-[100%] flex items-center justify-center'>
            <div className='h-[95%] w-[98%] rounded-[10px]' ref={mapRef} />
        </div>
    )
}

