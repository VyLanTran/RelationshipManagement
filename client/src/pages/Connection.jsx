import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar.jsx'
import ConnectionGroup from '../components/connection/ConnectionGroup.tsx'
import ConnectionCard from '../components/connection/ConnectionCard.jsx'
import AddConnectionForm from '../components/connection/AddConnectionForm.jsx'
import ConnectionDetail from '../components/connection/ConnectionDetailCard.jsx'
import axios from 'axios'
import { useSelector } from 'react-redux'
import BASE_URL from '../constants.js'

const Connection = () => {
	const [connections, setConnections] = useState([])
	const [searchInput, setSearchInput] = useState('')
	const [showAddForm, setShowAddForm] = useState(false)
	const [showConnectionDetails, setShowConnectionDetails] = useState(false)
	const [selectedConnection, setSelectedConnection] = useState(null)
	const [user, setUser] = useState(null)
	const { userId } = useParams()
	const currentUser = useSelector((state) => state.auth.user)
	const token = useSelector((state) => state.auth.token)

	useEffect(() => {
		// get the current user
		const getUser = async () => {
			const res = await fetch(`${BASE_URL}/users/${userId}`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			})
			const data = await res.json()
			if (res.ok) {
				setUser(data)
			}
		}
		// fetch the user's connection
		const fetchConnections = async () => {
			const res = await fetch(`${BASE_URL}/connections/${currentUser._id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()

			if (res.ok) {
				setConnections(data.connections)
			}
		}
		if (currentUser) {
			getUser()
			fetchConnections()
		}
	}, [user, userId])

	const handleSelectConnection = (connection) => {
		setShowConnectionDetails(true)
		setSelectedConnection(connection)
	}

	const searchConnection = (e) => {
		e.preventDefault()
		setSearchInput(e.target.value)
	}

	const handleCloseDetail = () => {
		setShowConnectionDetails(false)
	}

	const handleCloseForm = () => {
		setShowAddForm(false)
	}
	// change to handle null connections
	const filteredData = connections
		? connections.filter(
				(connection) =>
					connection &&
					connection.name &&
					String(connection.name)
						.toLowerCase()
						.includes(searchInput.toLowerCase())
			)
		: []

	return (
		<div>
			<Navbar />
			{connections?.length == 0 ? (
				<div className="flex justify-center pt-[10vh]">
					<ConnectionGroup />
					<div className="w-[145vh] rounded-[20px] h-[84vh] p-[1vh] m-[2vh]">
						<form className="flex justify-between">
							<div className="flex">
								<input
									value={searchInput}
									onChange={searchConnection}
									className="border border-solid border-[rgb(84,84,84)] bg-slate-50 w-[40vh] h-[6vh] outline-none rounded-3xl pl-[2vh]"
									placeholder="Finding someone?"></input>
								<button className="font-azeret bg-slate-50 w-[25vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
									Search
								</button>
							</div>
							<button
								className="font-azeret bg-[#8DC363] w-[20vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
								onClick={(e) => {
									e.preventDefault()
									setShowAddForm(true)
								}}>
								Add
							</button>
						</form>
						<AddConnectionForm
							isOpen={showAddForm}
							onClose={handleCloseForm}
							userId={userId}
						/>
					</div>
				</div>
			) : (
				<div className="flex justify-center pt-[10vh]">
					<ConnectionGroup />
					<div className="w-[145vh] rounded-[20px] h-[84vh] p-[1vh] m-[2vh]">
						<form className="flex justify-between">
							<div className="flex">
								<input
									value={searchInput}
									onChange={searchConnection}
									className="border border-solid border-[rgb(84,84,84)] bg-slate-50 w-[40vh] h-[6vh] outline-none rounded-3xl pl-[2vh]"
									placeholder="Finding someone?"></input>
								<button className="font-azeret bg-slate-50 w-[25vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
									Search
								</button>
							</div>
							<button
								className="font-azeret bg-[#8DC363] w-[20vh] text-[large] font-bold border h-[6vh] rounded-3xl ml-[2vh] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
								onClick={(e) => {
									e.preventDefault()
									setShowAddForm(true)
								}}>
								Add
							</button>
						</form>
						<AddConnectionForm
							isOpen={showAddForm}
							onClose={handleCloseForm}
							userId={userId}
						/>
						<section className="h-[75vh] mt-[2vh] rounded-[20px]">
							<div className="flex justify-between flex-wrap overflow-auto max-h-[100%] overflow-x-hidden">
								{filteredData.slice().map((connection, id) => (
									<ConnectionCard
										key={id}
										_id={connection['_id']}
										name={connection['name']}
										member_of={['Viet Tech', 'Team4'].join(', ')}
										phone={connection['phone']}
										email={connection['email']}
										last_contacted={'02/04/2023'}
										userId={userId}
										onSelect={() => handleSelectConnection(connection)}
									/>
								))}
							</div>
						</section>
						<ConnectionDetail
							isOpen={showConnectionDetails}
							onClose={handleCloseDetail}
							connection={selectedConnection}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

export default Connection
