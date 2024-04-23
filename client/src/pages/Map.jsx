'use client'

import React, { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import MapCard from '../components/map/MapCard.tsx'
import Navbar from '../components/navbar/Navbar.jsx'
import usePlaceAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu'
import BASE_URL from '../constants.js'

const MapGroup = () => {
	const mapRef = React.useRef(null)
	const [connections, setConnections] = useState([])
	const user = useSelector((state) => state.auth.user)

	//Grabing the connections to display positions on the map
	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/connections`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				})
				setConnections(response.data.connections)
			} catch (err) {
				console.error(err)
			}
		}
		if (user) {
			fetchConnections()
		}
	}, [user])

	// Load the map in + general map configuration
	useEffect(() => {
		const initMap = async () => {
			const loader = new Loader({
				apiKey: 'AIzaSyBUIvdKMKt7Hav5Ly79qwuTEZszxLw1X1I',
				version: 'weekly',
			})

			const { Map } = await loader.importLibrary('maps')

			const { AdvancedMarkerElement } = await loader.importLibrary('marker')

			const position = { lat: 53.54, lng: 10 }

			// map options
			const mapOptions = {
				center: position,
				zoom: 3,
				mapId: '416e6fbb21cbb74a',
			}

			// setup map
			const map = new Map(mapRef.current, mapOptions)

			console.log(connections)

			connections.slice().map(async (connection) => {
				if (connection['location']) {
					try {
						// Perform geocoding to get latitude and longitude
						const results = await getGeocode({
							address: connection.location,
						})
						const { lat, lng } = await getLatLng(results[0])
						new AdvancedMarkerElement({
							map,
							position: { lat, lng },
						})
					} catch (error) {
						console.error(error)
					}
				} else {
					console.log('No location')
				}
			})
		}

		initMap()
	}, [connections])

	return (
		<div>
			<Navbar />
			<div className="flex justify-center flex-row pt-[10vh]">
				<MapCard />
				<div className="w-[150vh] bg-[#FFB302] rounded-[20px] h-[84vh] p-[2.5vh] m-[2vh]">
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
