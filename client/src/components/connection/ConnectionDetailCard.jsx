import { useState, React, useEffect } from 'react'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { MdEdit, MdClose } from 'react-icons/md'
import EditModal from './EditModal.jsx'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '../ui/card'

const ConnectionDetail = ({ isOpen, onClose, connection }) => {
	const [userData, setUserData] = useState(connection)
	const handleClose = () => {
		onClose()
	}
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleEditClick = () => {
		setIsModalOpen(true)
	}
	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	return (
		<div>
			<div
				className={`fixed top-7 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
					isOpen ? '' : 'hidden'
				}`}>
				<div className=" text-white p-4 m-1 sm:w-2/3 h-[90%]">
					<Card className="h-[100%] rounded-[7%] text-left">
						<CardHeader className="flex-row justify-between pt-3">
							<CardTitle className="text-[7vh]">About</CardTitle>
							<MdEdit
								className="text-[6vh] cursor-pointer aria-label"
								onClick={handleEditClick}
							/>
						</CardHeader>
						<CardContent className="h-[59%] overflow-auto mt-[-3vh]">
							<p>
								Nickname: <b>{userData.username}</b>
							</p>
							<p>
								Birthday: <b>{userData.birthday}</b>
							</p>
							<p>
								How we met: <b>{userData.meet_how}</b>
							</p>
							<p>
								Relationship: <b>{userData.relationship}</b>
							</p>
							<p>
								Hobbies: <b>{userData.hobbies.join(', ')}</b>
							</p>
							<div>
								<p>Fun facts:</p>
								<ul className="list-disc ml-[8vh]">
									{userData.fun_facts.map((fun_fact) => (
										<li>{fun_fact.trim()}</li>
									))}
								</ul>
							</div>
						</CardContent>
						<CardFooter className="flex justify-center items-center mt-[4vh]">
							<button className="bg-[#FFB302] font-azeret w-[90%] text-[large] font-bold border h-[7vh] rounded-3xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
								Add notes
							</button>
						</CardFooter>
					</Card>
				</div>

				<div className=" text-white p-4 m-1.5 sm:w-1/3 h-[90%]">
					<Card className="h-[100%] bg-[#74B840] rounded-[7%] relative">
						<MdClose
							className="text-[6vh] absolute top-1 right-2 cursor-pointer"
							onClick={handleClose}
						/>
						<CardHeader>
							<CardTitle className="flex flex-col justify-center items-center">
								<IoPersonCircleSharp className="mt-[-4vh] w-[57%] h-[57%]" />
								<h1 className="text-[4vh]">{userData.name}</h1>
							</CardTitle>
						</CardHeader>
						<CardContent className="h-[28%] text-left">
							<p>
								<b>Local time: </b>9:50
							</p>
							<p>
								<b>Last in touch: </b>Over a week ago
							</p>
						</CardContent>
						<CardFooter className="flex flex-col justify-center items-center">
							<button className="bg-[#FFB302] font-azeret w-[90%] text-[large] font-bold border h-[7vh] rounded-3xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
								Messages
							</button>
							<button className="mt-[1vh] bg-[#FFB302] font-azeret w-[90%] text-[large] font-bold border h-[7vh] rounded-3xl border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]">
								Engagements
							</button>
						</CardFooter>
					</Card>
				</div>
			</div>
			<EditModal
				connection={connection}
				connectionId={connection._id}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</div>
	)
}

export default ConnectionDetail
