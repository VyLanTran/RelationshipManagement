import { useState, React } from 'react'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { MdEdit, MdClose } from 'react-icons/md'
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
	return (
		<div
			className={`fixed top-7 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
				isOpen ? '' : 'hidden'
			}`}>
			<div className=" text-white p-4 m-1 sm:w-2/3 h-[90%]">
				<Card className="h-[100%] rounded-[7%] text-left">
					<CardHeader className="flex-row justify-between">
						<CardTitle className="text-[7vh]">About</CardTitle>
						<MdEdit className="text-[6vh] cursor-pointer aria-label" />
					</CardHeader>
					<CardContent className="h-[59%] overflow-auto mt-[-3vh]">
						<p>
							Nickname: <b>{userData.username}</b>
						</p>
						<p>
							Birthday: <b>{userData.birthday}</b>
						</p>
						<p>
							How we met: <b>[Test]</b>
						</p>
						<p>
							Relationship: <b>[Test]</b>
						</p>
						<p>
							Hobbies: <b>[Test]</b>
						</p>
						<div>
							<p>Fun facts:</p>
							<ul className="list-disc ml-[8vh]">
								<li> fun fact 1</li>
								<li> fun fact 2</li>
								<li> fun fact 3</li>
								<li> fun fact 3</li>
								<li> fun fact 3</li>
								<li> fun fact 3</li>
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
							<h1 className="text-[4vh]">Nguyễn Thị Test</h1>
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
	)
}

export default ConnectionDetail
