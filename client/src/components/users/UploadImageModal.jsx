import { useRef, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from "../../store/authReducer"

// TODO : make responsive to screen size
const UploadImageModal = ({ user, userId, isOpen, onClose, isProfilePicture }) => {

    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()
    const [image, setImage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(
                (isProfilePicture ? `http://localhost:3001/users/profilePicture` : `http://localhost:3001/users/coverPhoto`),
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        profilePicture: image,
                        coverPhoto: image
                    })
                })
            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            }
            else {
                // localStorage.setItem("user", JSON.stringify(json));
                dispatch(
                    updateUser({
                        user: json
                    })
                )
                handleClose()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleClose = () => {
        setImage("")
        onClose()
    }


    const uploadImage = (e) => {
        const file = e.target.files[0]
        transformFile(file)
    }

    // convert image into base64 type
    const transformFile = (file) => {
        // Create a FileReader object that allows us to read the contents of a file in our computer
        const reader = new FileReader()

        if (file) {
            // Read the contenets and create a URL representing the file's data
            reader.readAsDataURL(file)
            // onloadend() is triggered when the reading into URL process is done
            reader.onloadend = () => {
                setImage(reader.result)
            }
        }
        else {
            setImage("")
        }
    }

    // TODO: close modal when clicking outside of its area
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center pt-[60px] ${isOpen ? "" : "hidden"}`}>
            <div
                className="bg-white p-8 rounded-lg shadow-xl relative py-[20px]">
                <span className="text-md">
                    {isProfilePicture ? "Choose profile picture" : "Choose cover photo"}
                </span>
                <div
                    className="absolute top-[2%] right-[2%] cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full w-[34px] h-[34px] flex items-center justify-center text-gray-700"
                    onClick={handleClose}
                >
                    X
                </div>
                <div className="border-t border-gray-300 my-4"></div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6 text-sm">
                        <input
                            type="file"
                            accept="image/"
                            onChange={uploadImage}
                            placeholder=""
                        // required
                        />
                        {/* Display the selected image */}
                        <ImagePreview>
                            {image ? (
                                <div>
                                    <img src={image} alt="Selected image" />
                                </div>
                            ) :
                                (
                                    <span>Image Preview</span>
                                )}
                        </ImagePreview>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-[#FFB302] rounded-md hover:bg-[#ffc744]">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadImageModal;

const ImagePreview = ({ children }) => {
    return (
        <div
            className="mx-[2rem] p-[2rem] border border-solid border-[#b7b7b7] w-[400px] h-[400px] max-w-[400px] flex items-center justify-center">
            <div className="w-full">
                {children}
            </div>
        </div>

    )
}