import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import GroupCard from '../components/groups/GroupCard.tsx'
import axios from 'axios'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'

const Home = () => {
	const user = useSelector((state) => state.auth.user)
	const token = useSelector((state) => state.auth.token)

	const [groups, setGroups] = useState([])
	const [newGroupName, setNewGroupName] = useState('')
	const authHeader = { headers: { Authorization: `Bearer ${token}` } }
	const [isOpen, setIsOpen] = useState(false)
	const [message, setMessage] = useState('')

	const navigate = useNavigate()

	const routeChange = () => {
		navigate('/groups')
	}

	const toggleModal = () => {
		setIsOpen(!isOpen)
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		setMessage('')
		try {
			const res = await axios.post(
				`${BASE_URL}/groups/`,
				{
					name: newGroupName,
					admin: user._id,
				},
				authHeader
			)
			setMessage('New group added successfully')
			setNewGroupName('')
		} catch (error) {
			setMessage(error.response.data['message'])
		}
	}

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await axios.get(
					`${BASE_URL}/groups/user/${user._id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				setGroups(response.data)
			} catch (err) {
				console.error(err)
			}
		}

		// Make sure that the user must be authenticated before they can view their groups
		if (user) {
			fetchGroups()
		}
	}, [user])

    return (
        <div>
            <div className="pt-[30px]">
                {groups?.length === 0 ? (
                    <div className="text-center space-y-3">
                        <h1 className="text-6xl">Oh no!</h1>
                        <h3 className="text-xl">
                            You haven't created any friend group yet.
                        </h3>
                        <button
                            className="bg-[#FFB302] text-xl text-center w-[100vh] text-[large] h-[7vh] mb-[-2vh] mt-[1vh] rounded-[10px] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                            onClick={toggleModal}
                        >
                            Create a new friend group
                        </button>
                        <Modal
                            className="flex justify-center items-center"
                            isOpen={isOpen}
                            onRequestClose={toggleModal}
                            shouldCloseOnOverlayClick={true}
                        >
                            <div className="bg-[#fff] border-2 border-[#FFB302] rounded-[20px] w-[100vh] h-[30vh] p-[2.5vh] mt-[30vh] content-center">
                                <p className="text-3xl m-[3vh]">
                                    Create new group
                                </p>
                                <input
                                    className="content-center text-xl mr-[3vh] w-[60vh] rounded-[10px] px-[3vh] py-[2vh]"
                                    placeholder="Name"
                                    id="name"
                                    name="name"
                                    value={newGroupName}
                                    onChange={(e) =>
                                        setNewGroupName(e.target.value)
                                    }
                                />
                                <button
                                    className="ml-[1vh] rounded-[10px] bg-[#FFB302] px-[3vh] text-l h-[6vh] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                    onClick={onSubmit}
                                >
                                    Create
                                </button>
                                <p className="text-red-500">{message}</p>
                            </div>
                        </Modal>
                    </div>
                ) : (
                    <div>
                        <div className="text-center">
                            <h1 className="text-4xl">
                                Discover your friend groups.
                            </h1>
                        </div>
                        <div className="flex justify-center flex-row pt-[20px]">
                            {groups.slice(0, 3).map((group, id) => (
                                <GroupCard
                                    key={id}
                                    group_name={group['name']}
                                    url={'groups/' + group['_id']}
                                    participants={[]}
                                />
                            ))}
                        </div>
                        {groups?.length > 3 ? (
                            <div>
                                <button
                                    className="bg-[#FFB302] text-xl text-center w-[100vh] text-[large] h-[7vh] mb-[-2vh] mt-[1vh] rounded-[10px] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                                    onClick={routeChange}
                                >
                                    See all of your friend groups
                                </button>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <div className="mt-[3vh]">
                            <p className="text-l text-gray-700">
                                ...or, discover common friends by clicking
                                outside the group
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
